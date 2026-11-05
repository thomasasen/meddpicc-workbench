import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  deleteRecovery,
  readRecovery,
  RecoveryStorageError,
  writeRecovery,
  type RecoverySnapshot,
} from '../services/toolRecovery'

type RecoveryOptions<T> = {
  tool: string
  value: Readonly<Ref<T>>
  validate: (value: unknown) => value is T
  /** Ersetzt den vollständigen Tool-Input in einem synchronen Commit. */
  restore: (value: T) => void
  tracked?: (value: T) => unknown
}

const CHANNEL = 'meddpicc-tool-recovery-events'

export function useToolRecovery<T>({ tool, value, validate, restore, tracked }: RecoveryOptions<T>) {
  const enabled = ref(false)
  const candidate = shallowRef<RecoverySnapshot<T> | null>(null)
  const message = ref('')
  const conflict = ref(false)
  const busy = ref(true)
  const project = tracked ?? ((draft: T) => draft)
  const initial = JSON.stringify(value.value)
  const initialTracked = JSON.stringify(project(value.value))
  const modified = computed(() => JSON.stringify(project(value.value)) !== initialTracked)
  let lastSaved = initial
  let observedToken: string | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  // Serialisiert parallele Debounce-, Navigations- und Löschvorgänge.
  let pendingFlush: Promise<void> = Promise.resolve()
  let disposed = false
  let acknowledgedNavigation = false
  let channel: BroadcastChannel | null = null

  function signalOtherTabs() {
    try {
      channel?.postMessage({ tool })
    } catch {
      /* Keine Daten übertragen; Konflikte werden zudem transaktional geprüft. */
    }
  }

  async function inspect() {
    busy.value = true
    try {
      const result = await readRecovery(tool, validate)
      if (disposed) return
      if (result.kind === 'available') {
        candidate.value = result.snapshot
        observedToken = result.snapshot.token
      } else if (result.kind === 'invalid') {
        message.value = 'Recoverydaten sind beschädigt, inkompatibel oder abgelaufen. Sie werden nicht geladen.'
      }
    } catch {
      if (!disposed) message.value = 'Lokaler Browserspeicher nicht verfügbar. Es wurde nichts gesichert.'
    } finally {
      if (!disposed) busy.value = false
    }
  }

  function flush(): Promise<boolean> {
    clearTimeout(timer)
    const task = pendingFlush.then(async () => {
      if (!enabled.value || conflict.value || disposed) return false
      const serialized = JSON.stringify(value.value)
      if (serialized === lastSaved) return true
      // Unvollständige Formulare dürfen nicht als Tab-Konflikt gelten.
      if (!validate(value.value)) {
        message.value = 'Eingaben sind momentan nicht vollständig speicherbar. Änderungen sind noch nicht lokal gesichert.'
        return false
      }
      try {
        const saved = await writeRecovery(tool, value.value, observedToken, validate)
        if (disposed) return false
        observedToken = saved.token
        lastSaved = serialized
        message.value =
          serialized === JSON.stringify(value.value)
            ? 'Nur lokal zwischengesichert. Nicht als Datei gespeichert.'
            : 'Neuere Änderungen sind noch nicht lokal gesichert.'
        signalOtherTabs()
        return serialized === JSON.stringify(value.value)
      } catch (error) {
        if (disposed) return false
        if (error instanceof RecoveryStorageError && (error.reason === 'conflict' || error.reason === 'invalid')) {
          conflict.value = true
          enabled.value = false
          message.value =
            'Recoverystand ist ungültig oder wurde in einem anderen Tab verändert. Automatisches Sichern angehalten.'
        } else if (error instanceof RecoveryStorageError && error.reason === 'quota') {
          message.value = 'Speichergrenze erreicht. Die aktuellen Änderungen sind nicht lokal gesichert.'
        } else {
          enabled.value = false
          message.value = 'Lokales Zwischenspeichern fehlgeschlagen. Die aktuellen Änderungen sind nicht gesichert.'
        }
        return false
      }
    })
    pendingFlush = task.then(
      () => undefined,
      () => undefined,
    )
    return task
  }

  function schedule() {
    if (!enabled.value || conflict.value || candidate.value) return
    clearTimeout(timer)
    if (JSON.stringify(value.value) === lastSaved) {
      if (
        message.value === 'Änderungen sind noch nicht lokal gesichert.' ||
        message.value === 'Neuere Änderungen sind noch nicht lokal gesichert.'
      ) {
        message.value = 'Nur lokal zwischengesichert. Nicht als Datei gespeichert.'
      }
      return
    }
    message.value = 'Änderungen sind noch nicht lokal gesichert.'
    timer = setTimeout(() => void flush(), 600)
  }

  function activate() {
    if (busy.value || candidate.value || conflict.value) {
      message.value = 'Bitte zuerst vorhandene Recoverydaten prüfen oder den Konflikt durch Neuladen auflösen.'
      return
    }
    enabled.value = true
    // Auch bereits vor dem Opt-in erfasste oder per Handoff übernommene
    // Eingaben sofort sichern. Eine Aktivierung ohne spätere Änderung darf
    // keinen vermeintlich geschützten, aber nie geschriebenen Entwurf erzeugen.
    lastSaved = ''
    message.value = 'Recovery aktiviert. Die erste lokale Sicherung wird erstellt.'
    void flush()
  }

  async function recover() {
    const pending = candidate.value
    if (!pending || busy.value) return
    busy.value = true
    try {
      const current = await readRecovery(tool, validate)
      if (current.kind !== 'available' || current.snapshot.token !== pending.token) {
        conflict.value = true
        message.value = 'Der lokale Stand hat sich geändert. Bitte neu laden und erneut prüfen.'
        return
      }
      // Ein Tool muss seine Werte über EINEN synchronen Commit ersetzen.
      restore(structuredClone(current.snapshot.data))
      observedToken = current.snapshot.token
      lastSaved = JSON.stringify(value.value)
      candidate.value = null
      enabled.value = true
      message.value = 'Arbeitsstand wiederhergestellt. Wirtschaftliche Annahmen und Evidenz sind nicht neu bestätigt.'
    } catch {
      message.value = 'Wiederherstellung fehlgeschlagen. Bestehende Eingaben bleiben erhalten.'
    } finally {
      busy.value = false
    }
  }

  async function discard() {
    if (busy.value) return
    busy.value = true
    clearTimeout(timer)
    try {
      enabled.value = false
      await pendingFlush
      await deleteRecovery(tool, validate, observedToken)
      candidate.value = null
      observedToken = null
      enabled.value = false
      conflict.value = false
      message.value = 'Recoverydaten gelöscht und lokales Recovery deaktiviert.'
      signalOtherTabs()
    } catch (error) {
      if (error instanceof RecoveryStorageError && error.reason === 'conflict') {
        conflict.value = true
        message.value = 'Ein anderer Tab hat neuere Recoverydaten. Sie wurden nicht gelöscht. Bitte neu laden.'
      } else {
        message.value = 'Die Recoverydaten konnten nicht gelöscht werden.'
      }
    } finally {
      busy.value = false
    }
  }

  function otherTab(event: MessageEvent) {
    const data: unknown = event.data
    if (!data || typeof data !== 'object') return
    const notice = data as Record<string, unknown>
    if (notice.tool !== tool && notice.tool !== '*') return
    clearTimeout(timer)
    enabled.value = false
    conflict.value = true
    message.value = 'Recoverydaten wurden in einem anderen Tab geändert oder gelöscht. Bitte neu laden.'
  }

  function beforeUnload(event: BeforeUnloadEvent) {
    if (!modified.value) return
    if (enabled.value && !conflict.value && lastSaved === JSON.stringify(value.value)) return
    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(CHANNEL)
        channel.addEventListener('message', otherTab)
      }
    } catch {
      channel = null
    }
    void inspect()
    window.addEventListener('beforeunload', beforeUnload)
  })

  onBeforeUnmount(() => {
    disposed = true
    clearTimeout(timer)
    channel?.removeEventListener('message', otherTab)
    channel?.close()
    window.removeEventListener('beforeunload', beforeUnload)
  })

  watch(value, schedule, { deep: true })

  async function canLeave(): Promise<boolean> {
    if (acknowledgedNavigation) {
      acknowledgedNavigation = false
      // Ein ausdrücklicher Tool-Handoff ist keine Zusage, dass der gesamte
      // Ursprungsentwurf gespeichert wurde. Vor dem Wechsel ausstehendes
      // Opt-in-Recovery abschließen oder einen Verlust ausdrücklich bestätigen.
      if (enabled.value && !(await flush())) {
        return window.confirm('Die aktuellen Änderungen konnten nicht lokal gesichert werden. Trotzdem fortfahren?')
      }
      return true
    }
    if (enabled.value) {
      if (await flush()) return true
      return window.confirm('Die aktuellen Änderungen konnten nicht lokal gesichert werden. Trotzdem fortfahren?')
    }
    if (!modified.value) return true
    return window.confirm('Ungesicherte Eingaben gehen beim Verlassen dieses Tools verloren. Trotzdem fortfahren?')
  }

  onBeforeRouteLeave(canLeave)

  function acknowledgeNavigation() {
    acknowledgedNavigation = true
  }

  return {
    enabled,
    candidate,
    message,
    conflict,
    busy,
    modified,
    activate,
    recover,
    discard,
    acknowledgeNavigation,
    canLeave,
  }
}

export function announceAllRecoveryDeleted() {
  if (typeof BroadcastChannel === 'undefined') return
  let channel: BroadcastChannel | null = null
  try {
    channel = new BroadcastChannel(CHANNEL)
    channel.postMessage({ tool: '*' })
  } catch {
    // Ein blockierter Signalkanal ändert nichts an einer bereits erfolgten Löschung.
  } finally {
    channel?.close()
  }
}
