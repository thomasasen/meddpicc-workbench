import { onBeforeUnmount, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'

import {
  discardToolRecovery,
  readToolRecovery,
  RecoveryConflictError,
  setToolRecoveryEnabled,
  writeToolRecovery,
  type RecoverySnapshot,
  type RecoveryToolId,
} from '../services/toolRecovery'

export interface ToolRecoveryAdapter<T> {
  toolId: RecoveryToolId
  read: () => T
  restore: (payload: T) => void
  validate: (value: unknown) => value is T
  isMeaningful: (value: T) => boolean
}

export interface ToolRecoveryController {
  ready: boolean
  enabled: boolean
  dirty: boolean
  saving: boolean
  savedAt: string
  error: string
  invalid: boolean
  conflict: boolean
  pending: { savedAt: string; conflict: boolean } | null
  enable: () => Promise<void>
  disable: () => Promise<void>
  restore: () => Promise<void>
  discard: () => Promise<void>
  resetAcknowledged: () => Promise<void>
  inspectConflict: () => Promise<void>
  allowNextNavigation: () => void
}

const RECOVERY_CHANNEL = 'meddpicc-recovery-notifications'
const SAVE_DEBOUNCE_MS = 800
const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Die lokale Recovery-Funktion ist nicht verfügbar.'

/**
 * One adapter per long-running tool. Keeps each tool's data contract independent;
 * neither Pinia's legacy project nor session handoffs are touched.
 */
export function useToolRecovery<T>(adapter: ToolRecoveryAdapter<T>): ToolRecoveryController {
  const router = useRouter()
  const state = reactive({
    ready: false,
    enabled: false,
    dirty: false,
    saving: false,
    savedAt: '',
    error: '',
    invalid: false,
    conflict: false,
    pending: null as { savedAt: string; conflict: boolean } | null,
  })

  let baseline = JSON.stringify(adapter.read())
  let latestSaved = ''
  let revision: number | null = null
  let offered: RecoverySnapshot<T> | null = null
  let timer: ReturnType<typeof setTimeout> | null = null
  let inFlight = false
  let mounted = false
  let allowOneNavigation = false
  let channel: BroadcastChannel | null = null

  function fingerprint(): string {
    return JSON.stringify(adapter.read())
  }

  function clearTimer(): void {
    if (timer !== null) clearTimeout(timer)
    timer = null
  }

  function notify(type: 'updated' | 'removed'): void {
    channel?.postMessage({ type, toolId: adapter.toolId })
  }

  function beforeUnload(event: BeforeUnloadEvent): void {
    if (!state.dirty) return
    event.preventDefault()
    event.returnValue = ''
  }

  function updateDirty(): void {
    const data = adapter.read()
    state.dirty = adapter.isMeaningful(data) && fingerprint() !== baseline
  }

  function scheduleSave(): void {
    clearTimer()
    if (!state.ready || !state.enabled || state.pending || state.invalid || state.conflict || !state.dirty) return
    if (fingerprint() === latestSaved) return
    timer = setTimeout(() => void save(), SAVE_DEBOUNCE_MS)
  }

  async function save(): Promise<void> {
    clearTimer()
    if (inFlight || !mounted || !state.enabled || state.pending || state.invalid || state.conflict || !state.dirty) return
    const data = adapter.read()
    if (!adapter.validate(data)) {
      state.error = 'Der aktuelle Entwurf enthält ungültige Werte und konnte nicht lokal gesichert werden.'
      return
    }
    const current = fingerprint()
    if (current === latestSaved) return
    inFlight = true
    state.saving = true
    try {
      const stored = await writeToolRecovery(adapter.toolId, revision, data)
      revision = stored.revision
      latestSaved = current
      state.savedAt = stored.savedAt
      state.error = ''
      notify('updated')
    } catch (error) {
      state.error = errorMessage(error)
      if (error instanceof RecoveryConflictError) state.conflict = true
    } finally {
      inFlight = false
      state.saving = false
      if (fingerprint() !== current && !state.conflict) scheduleSave()
    }
  }

  watch(
    () => fingerprint(),
    () => {
      updateDirty()
      scheduleSave()
    },
  )

  watch(
    () => state.dirty,
    (dirty) => {
      if (!mounted) return
      if (dirty) window.addEventListener('beforeunload', beforeUnload)
      else window.removeEventListener('beforeunload', beforeUnload)
    },
  )

  async function inspectConflict(): Promise<void> {
    clearTimer()
    try {
      const read = await readToolRecovery(adapter.toolId)
      state.enabled = read.enabled
      revision = read.snapshot?.revision ?? null
      state.invalid = read.invalid || (read.snapshot !== null && !adapter.validate(read.snapshot.payload))
      if (state.invalid) {
        state.error = 'Der lokale Recovery-Stand ist beschädigt, abgelaufen oder nicht kompatibel. Er wird nicht geladen.'
        state.pending = null
        offered = null
        state.conflict = false
        return
      }
      offered = read.snapshot as RecoverySnapshot<T> | null
      state.pending = offered
        ? { savedAt: offered.savedAt, conflict: state.dirty && fingerprint() !== JSON.stringify(offered.payload) }
        : null
      state.conflict = false
      state.error = ''
      if (!offered) {
        latestSaved = ''
        state.savedAt = ''
        if (state.enabled) scheduleSave()
      }
    } catch (error) {
      state.error = errorMessage(error)
    }
  }

  async function enable(): Promise<void> {
    if (!state.ready || state.pending || state.invalid) return
    try {
      await setToolRecoveryEnabled(adapter.toolId, true)
      state.enabled = true
      state.error = ''
      scheduleSave()
    } catch (error) {
      state.error = errorMessage(error)
    }
  }

  async function disable(): Promise<void> {
    clearTimer()
    try {
      await setToolRecoveryEnabled(adapter.toolId, false)
      state.enabled = false
      state.pending = null
      state.invalid = false
      state.conflict = false
      revision = null
      offered = null
      latestSaved = ''
      state.savedAt = ''
      state.error = ''
      notify('removed')
    } catch (error) {
      state.error = errorMessage(error)
    }
  }

  async function restore(): Promise<void> {
    if (!offered) return
    try {
      const read = await readToolRecovery(adapter.toolId)
      if (!read.snapshot || read.snapshot.revision !== offered.revision || !adapter.validate(read.snapshot.payload)) {
        state.conflict = true
        state.error = 'Der Recovery-Stand hat sich geändert. Bitte erneut prüfen.'
        return
      }
      const safePayload = structuredClone(read.snapshot.payload)
      if (!adapter.validate(safePayload)) throw new Error('Ungültiger Recovery-Stand.')
      // One synchronous, validated application; Vue flushes once after the assignment.
      adapter.restore(safePayload)
      revision = read.snapshot.revision
      latestSaved = JSON.stringify(safePayload)
      state.savedAt = read.snapshot.savedAt
      state.pending = null
      offered = null
      state.invalid = false
      state.error = ''
      state.conflict = false
      updateDirty()
    } catch (error) {
      state.error = errorMessage(error)
    }
  }

  async function discard(): Promise<void> {
    clearTimer()
    try {
      await discardToolRecovery(adapter.toolId, state.invalid ? undefined : offered?.revision)
      state.pending = null
      state.invalid = false
      state.conflict = false
      state.savedAt = ''
      state.error = ''
      revision = null
      latestSaved = ''
      offered = null
      notify('removed')
      scheduleSave()
    } catch (error) {
      state.error = errorMessage(error)
      if (error instanceof RecoveryConflictError) state.conflict = true
    }
  }

  async function resetAcknowledged(): Promise<void> {
    clearTimer()
    baseline = fingerprint()
    updateDirty()
    try {
      await discardToolRecovery(adapter.toolId, revision)
      revision = null
      latestSaved = ''
      state.savedAt = ''
      state.error = ''
      notify('removed')
    } catch (error) {
      state.error = errorMessage(error)
      if (error instanceof RecoveryConflictError) state.conflict = true
    }
  }

  function allowNextNavigation(): void {
    allowOneNavigation = true
  }

  const unregisterGuard = router.beforeEach((to, from) => {
    if (!mounted || to.fullPath === from.fullPath) return true
    if (allowOneNavigation) {
      allowOneNavigation = false
      return true
    }
    if (!state.dirty) return true
    return window.confirm(
      'Ungesicherte Eingaben dieses Tools verlassen? Ein Recovery-Snapshot ist keine gespeicherte Datei. ' +
        'Du kannst hierbleiben und deine Arbeit fortsetzen.',
    )
  })

  onMounted(async () => {
    mounted = true
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(RECOVERY_CHANNEL)
        channel.onmessage = (event: MessageEvent) => {
          const data = event.data as { type?: string; toolId?: string }
          if (data?.toolId !== adapter.toolId) return
          clearTimer()
          state.conflict = true
          state.error =
            'Recovery wurde in einem anderen Tab geändert oder gelöscht. Bitte den aktuellen Stand prüfen.'
        }
      }
      await inspectConflict()
    } finally {
      state.ready = true
      updateDirty()
      if (state.dirty) window.addEventListener('beforeunload', beforeUnload)
      scheduleSave()
    }
  })

  onBeforeUnmount(() => {
    clearTimer()
    mounted = false
    window.removeEventListener('beforeunload', beforeUnload)
    channel?.close()
    unregisterGuard()
  })

  return Object.assign(state, {
    enable,
    disable,
    restore,
    discard,
    resetAcknowledged,
    inspectConflict,
    allowNextNavigation,
  })
}
