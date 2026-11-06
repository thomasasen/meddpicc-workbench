import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  deleteRecovery,
  readRecovery,
  readRecoveryEpoch,
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

/** Explizite, ausschließlich auf dem aktiven Microtool basierende Sicherungsanzeige. */
export type ToolSaveState = 'checking' | 'available' | 'inactive' | 'unsaved' | 'pending' | 'saving' | 'saved' | 'error'

export function useToolRecovery<T>({ tool, value, validate, restore, tracked }: RecoveryOptions<T>) {
  const enabled = ref(false)
  const candidate = shallowRef<RecoverySnapshot<T> | null>(null)
  const message = ref('')
  const conflict = ref(false)
  const busy = ref(true)
  const saving = ref(false)
  const savedOnce = ref(false)
  const saveFailed = ref(false)
  const project = tracked ?? ((draft: T) => draft)
  const initial = JSON.stringify(value.value)
  const initialTracked = JSON.stringify(project(value.value))
  const modified = computed(() => JSON.stringify(project(value.value)) !== initialTracked)
  let lastSaved = initial
  let observedToken: string | null = null
  let observedEpoch: string | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  // Serialisiert parallele Debounce-, Navigations- und Löschvorgänge.
  let pendingFlush: Promise<void> = Promise.resolve()
  let disposed = false
  let acknowledgedNavigation = false
  let channel: BroadcastChannel | null = null

  const saveStatus = computed<ToolSaveState>(() => {
    if (conflict.value || saveFailed.value) return 'error'
    if (candidate.value) return 'available'
    if (busy.value) return 'checking'
    if (!enabled.value) return modified.value ? 'unsaved' : 'inactive'
    if (saving.value) return 'saving'
    return savedOnce.value && JSON.stringify(value.value) === lastSaved ? 'saved' : 'pending'
  })

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
      const epoch = await readRecoveryEpoch()
      if (disposed) return
      observedEpoch = epoch
      if (result.kind === 'available') {
        candidate.value = result.snapshot
        observedToken = result.snapshot.token
      } else if (result.kind === 'invalid') {
        saveFailed.value = true
        message.value = 'Recoverydaten sind beschädigt, inkompatibel oder abgelaufen. Sie werden nicht geladen.'
      }
    } catch {
      if (!disposed) {
        saveFailed.value = true
        message.value = 'Lokaler Browserspeicher nicht verfügbar. Es wurde nichts gesichert.'
      }
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
        saveFailed.value = true
        message.value =
          'Eingaben sind momentan nicht vollständig speicherbar. Änderungen sind noch nicht lokal gesichert.'
        return false
      }
      saving.value = true
      try {
        const saved = await writeRecovery(tool, value.value, observedToken, validate, Date.now(), observedEpoch)
        if (disposed) return false
        observedToken = saved.token
        lastSaved = serialized
        savedOnce.value = true
        saveFailed.value = false
        message.value =
          serialized === JSON.stringify(value.value)
            ? 'Nur lokal zwischengesichert. Nicht als Datei gespeichert.'
            : 'Neuere Änderungen sind noch nicht lokal gesichert.'
        signalOtherTabs()
        return serialized === JSON.stringify(value.value)
      } catch (error) {
        if (disposed) return false
        saveFailed.value = true
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
      } finally {
        saving.value = false
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
      if (savedOnce.value) saveFailed.value = false
      if (
        message.value === 'Änderungen sind noch nicht lokal gesichert.' ||
        message.value === 'Neuere Änderungen sind noch nicht lokal gesichert.'
      ) {
        message.value = 'Nur lokal zwischengesichert. Nicht als Datei gespeichert.'
      }
      return
    }
    saveFailed.value = false
    message.value = 'Änderungen sind noch nicht lokal gesichert.'
    timer = setTimeout(() => void flush(), 600)
  }

  function activate() {
    if (busy.value || candidate.value || conflict.value) {
      message.value = 'Bitte zuerst vorhandene Recoverydaten prüfen oder den Konflikt durch Neuladen auflösen.'
      return
    }
    enabled.value = true
    savedOnce.value = false
    saveFailed.value = false
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
      const epoch = await readRecoveryEpoch()
      if (current.kind !== 'available' || current.snapshot.token !== pending.token) {
        conflict.value = true
        message.value = 'Der lokale Stand hat sich geändert. Bitte neu laden und erneut prüfen.'
        return
      }
      // Ein Tool muss seine Werte über EINEN synchronen Commit ersetzen.
      restore(structuredClone(current.snapshot.data))
      observedToken = current.snapshot.token
      observedEpoch = epoch
      lastSaved = JSON.stringify(value.value)
      savedOnce.value = true
      saveFailed.value = false
      candidate.value = null
      enabled.value = true
      message.value = 'Arbeitsstand wiederhergestellt. Wirtschaftliche Annahmen und Evidenz sind nicht neu bestätigt.'
    } catch {
      saveFailed.value = true
      message.value = 'Wiederherstellung fehlgeschlagen. Bestehende Eingaben bleiben erhalten; der lokale Stand konnte nicht geprüft werden.'
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
      savedOnce.value = false
      saveFailed.value = false
      conflict.value = false
      message.value = 'Recoverydaten gelöscht und lokales Recovery deaktiviert.'
      signalOtherTabs()
    } catch (error) {
      saveFailed.value = true
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
      // Ein Handoff wurde vor dem Schreiben in sessionStorage bestätigt.
      acknowledgedNavigation = false
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

  /** Erst die Verlustprüfung, dann die Session-Übergabe schreiben. */
  async function prepareHandoff(): Promise<boolean> {
    if (enabled.value) {
      if (!(await flush())) {
        const proceed = window.confirm(
          'Die aktuellen Änderungen konnten nicht lokal gesichert werden. Trotzdem fortfahren?',
        )
        if (!proceed) return false
      }
    } else if (modified.value) {
      const proceed = window.confirm(
        'Der Toolwechsel überträgt nicht den gesamten Entwurf. Ungesicherte Eingaben gehen verloren. Trotzdem fortfahren?',
      )
      if (!proceed) return false
    }
    acknowledgedNavigation = true
    return true
  }

  function clearHandoffApproval() {
    acknowledgedNavigation = false
  }

  return {
    enabled,
    saveStatus,
    candidate,
    message,
    conflict,
    busy,
    modified,
    activate,
    recover,
    discard,
    prepareHandoff,
    clearHandoffApproval,
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
