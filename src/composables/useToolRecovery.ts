import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch, type Ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  deleteRecovery,
  readRecovery,
  recoveryStorageKey,
  RecoveryStorageError,
  writeRecovery,
  type RecoverySnapshot,
} from '../services/toolRecovery'

type RecoveryOptions<T> = {
  tool: string
  value: Readonly<Ref<T>>
  validate: (value: unknown) => value is T
  restore: (value: T) => void
}

export function useToolRecovery<T>({ tool, value, validate, restore }: RecoveryOptions<T>) {
  const enabled = ref(false)
  const candidate = shallowRef<RecoverySnapshot<T> | null>(null)
  const message = ref('')
  const conflict = ref(false)
  const initial = JSON.stringify(value.value)
  const modified = computed(() => JSON.stringify(value.value) !== initial)
  let lastSaved = initial
  let observedToken: string | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  let disposed = false

  function storage(): Storage {
    return window.localStorage
  }

  function readCandidate() {
    const result = readRecovery(storage(), tool, validate)
    if (result.kind === 'available') {
      candidate.value = result.snapshot
      observedToken = result.snapshot.token
    } else if (result.kind === 'invalid') {
      message.value = 'Vorhandene Recoverydaten sind ungültig oder abgelaufen. Sie werden nicht geladen.'
    } else if (result.kind === 'unavailable') {
      message.value = 'Der lokale Browserspeicher ist nicht verfügbar.'
    }
  }

  function flush(): boolean {
    if (!enabled.value || conflict.value || disposed) return false
    clearTimeout(timer)
    const serialized = JSON.stringify(value.value)
    if (serialized === lastSaved) return true
    try {
      const saved = writeRecovery(storage(), tool, value.value, observedToken, validate)
      observedToken = saved.token
      lastSaved = serialized
      message.value = 'Nur lokal zwischengesichert. Keine gespeicherte Projektdatei.'
      return true
    } catch (error) {
      if (error instanceof RecoveryStorageError && error.reason === 'conflict') {
        conflict.value = true
        message.value = 'Ein anderer Tab hat den Recoverystand verändert. Automatisches Sichern wurde angehalten.'
      } else {
        message.value = 'Lokales Zwischenspeichern fehlgeschlagen. Die Eingaben sind nicht gesichert.'
      }
      return false
    }
  }

  function activate() {
    if (candidate.value) {
      message.value = 'Bitte zuerst den vorhandenen Recoverystand wiederherstellen oder verwerfen.'
      return
    }
    enabled.value = true
    lastSaved = ''
    flush()
  }

  function recover() {
    const snapshot = candidate.value
    if (!snapshot) return
    // Prüfen unmittelbar vor dem vollständigen, vom Tool bereitgestellten Restore.
    const current = readRecovery(storage(), tool, validate)
    if (current.kind !== 'available' || current.snapshot.token !== snapshot.token) {
      conflict.value = true
      message.value = 'Der Recoverystand hat sich geändert. Bitte die Seite neu laden und erneut prüfen.'
      return
    }
    try {
      restore(structuredClone(snapshot.data))
      enabled.value = true
      observedToken = snapshot.token
      lastSaved = JSON.stringify(snapshot.data)
      candidate.value = null
      message.value = 'Arbeitsstand wiederhergestellt. Werte und Annahmen sind weiterhin ungeprüft.'
    } catch {
      message.value = 'Die Wiederherstellung konnte nicht vollständig abgeschlossen werden.'
    }
  }

  function discard() {
    try {
      deleteRecovery(storage(), tool)
      candidate.value = null
      observedToken = null
      enabled.value = false
      conflict.value = false
      message.value = 'Lokale Recoverydaten verworfen.'
    } catch {
      message.value = 'Recoverydaten konnten nicht gelöscht werden.'
    }
  }

  function storageChanged(event: StorageEvent) {
    if (event.storageArea !== storage() || (event.key !== recoveryStorageKey(tool) && event.key !== null)) return
    clearTimeout(timer)
    conflict.value = true
    enabled.value = false
    message.value = 'Recoverydaten wurden in einem anderen Tab geändert oder gelöscht. Bitte neu laden.'
  }

  function beforeUnload(event: BeforeUnloadEvent) {
    if (!modified.value) return
    if (enabled.value) flush()
    if (JSON.stringify(value.value) === lastSaved && enabled.value && !conflict.value) return
    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => {
    readCandidate()
    window.addEventListener('storage', storageChanged)
    window.addEventListener('beforeunload', beforeUnload)
  })
  onBeforeUnmount(() => {
    if (enabled.value) flush()
    disposed = true
    clearTimeout(timer)
    window.removeEventListener('storage', storageChanged)
    window.removeEventListener('beforeunload', beforeUnload)
  })

  watch(
    value,
    () => {
      if (!enabled.value || conflict.value) return
      clearTimeout(timer)
      timer = setTimeout(flush, 750)
    },
    { deep: true },
  )

  onBeforeRouteLeave(() => {
    if (!modified.value) return true
    if (enabled.value) flush()
    if (enabled.value && !conflict.value && JSON.stringify(value.value) === lastSaved) return true
    return window.confirm('Ungesicherte Eingaben gehen beim Verlassen dieses Tools verloren. Trotzdem fortfahren?')
  })

  return { enabled, candidate, message, conflict, modified, activate, recover, discard }
}
