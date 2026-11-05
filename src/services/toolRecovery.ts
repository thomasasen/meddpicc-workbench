/**
 * Opt-in Recovery for individual microtools. No remote endpoints, project files or telemetry.
 * IndexedDB transactions serialize competing writes across tabs.
 */
export const RECOVERY_DB = 'meddpicc-tool-recovery'
export const RECOVERY_VERSION = 1
export const RECOVERY_TTL_MS = 7 * 24 * 60 * 60 * 1000
export const RECOVERY_MAX_BYTES = 256 * 1024

export type RecoveryToolId = 'reverse-timeline' | 'metric-builder' | 'software-payback' | 'cost-of-delay' | 'value-bridge'

export interface RecoverySnapshot<T> {
  schemaVersion: 1
  toolId: RecoveryToolId
  revision: number
  savedAt: string
  expiresAt: string
  payload: T
}

export interface RecoveryReadResult {
  enabled: boolean
  snapshot: RecoverySnapshot<unknown> | null
  invalid: boolean
}

export class RecoveryConflictError extends Error {
  constructor() {
    super('Ein anderer Tab hat diesen lokalen Recovery-Stand geändert. Bitte diesen Tab neu laden und die Stände prüfen.')
    this.name = 'RecoveryConflictError'
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export function isRecoverySnapshot(value: unknown, toolId: RecoveryToolId, now = Date.now()): value is RecoverySnapshot<unknown> {
  if (!isRecord(value)) return false
  if (value.schemaVersion !== RECOVERY_VERSION || value.toolId !== toolId) return false
  if (typeof value.revision !== 'number' || !Number.isSafeInteger(value.revision) || value.revision < 1) return false
  if (typeof value.savedAt !== 'string' || typeof value.expiresAt !== 'string') return false
  const saved = Date.parse(value.savedAt)
  const expires = Date.parse(value.expiresAt)
  if (!Number.isFinite(saved) || !Number.isFinite(expires)) return false
  if (saved > now + 120_000 || expires <= saved || expires > saved + RECOVERY_TTL_MS + 1000) return false
  if (expires <= now) return false
  try {
    return new TextEncoder().encode(JSON.stringify(value)).byteLength <= RECOVERY_MAX_BYTES
  } catch {
    return false
  }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('Lokaler Browserspeicher ist nicht verfügbar.'))
      return
    }
    const request = indexedDB.open(RECOVERY_DB, RECOVERY_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('snapshots')) db.createObjectStore('snapshots')
      if (!db.objectStoreNames.contains('preferences')) db.createObjectStore('preferences')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error('Der lokale Browserspeicher konnte nicht geöffnet werden.'))
    request.onblocked = () => reject(new Error('Ein anderer Tab blockiert den lokalen Browserspeicher.'))
  })
}

export async function readToolRecovery(toolId: RecoveryToolId): Promise<RecoveryReadResult> {
  const db = await openDatabase()
  try {
    return await new Promise<RecoveryReadResult>((resolve, reject) => {
      const tx = db.transaction(['preferences', 'snapshots'], 'readonly')
      const choice = tx.objectStore('preferences').get(toolId)
      const draft = tx.objectStore('snapshots').get(toolId)
      tx.oncomplete = () => {
        const snapshot = draft.result as unknown
        resolve({
          enabled: choice.result === true,
          snapshot: isRecoverySnapshot(snapshot, toolId) ? snapshot : null,
          invalid: snapshot !== undefined && !isRecoverySnapshot(snapshot, toolId),
        })
      }
      tx.onabort = () => reject(new Error('Lokale Recoverydaten konnten nicht gelesen werden.'))
      tx.onerror = () => reject(new Error('Lokale Recoverydaten konnten nicht gelesen werden.'))
    })
  } finally {
    db.close()
  }
}

export async function setToolRecoveryEnabled(toolId: RecoveryToolId, enabled: boolean): Promise<void> {
  const db = await openDatabase()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['preferences', 'snapshots'], 'readwrite')
      if (enabled) tx.objectStore('preferences').put(true, toolId)
      else {
        tx.objectStore('preferences').delete(toolId)
        tx.objectStore('snapshots').delete(toolId)
      }
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(new Error('Die lokale Recovery-Einstellung konnte nicht geändert werden.'))
      tx.onerror = () => reject(new Error('Die lokale Recovery-Einstellung konnte nicht geändert werden.'))
    })
  } finally {
    db.close()
  }
}

export async function writeToolRecovery<T>(
  toolId: RecoveryToolId,
  expectedRevision: number | null,
  payload: T,
): Promise<RecoverySnapshot<T>> {
  // Clone before the transaction: serialization failures never modify stored data.
  const safePayload = JSON.parse(JSON.stringify(payload)) as T
  const now = Date.now()
  const snapshot: RecoverySnapshot<T> = {
    schemaVersion: RECOVERY_VERSION,
    toolId,
    revision: (expectedRevision ?? 0) + 1,
    savedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + RECOVERY_TTL_MS).toISOString(),
    payload: safePayload,
  }
  if (new TextEncoder().encode(JSON.stringify(snapshot)).byteLength > RECOVERY_MAX_BYTES) {
    throw new Error('Der Entwurf ist für die lokale Recovery-Sicherung zu groß (maximal 256 KB).')
  }
  const db = await openDatabase()
  try {
    return await new Promise<RecoverySnapshot<T>>((resolve, reject) => {
      const tx = db.transaction(['preferences', 'snapshots'], 'readwrite')
      const preferences = tx.objectStore('preferences')
      const drafts = tx.objectStore('snapshots')
      let failure: Error | null = null
      const choice = preferences.get(toolId)
      choice.onsuccess = () => {
        if (choice.result !== true) {
          failure = new Error('Lokale Sicherung wurde in einem anderen Tab deaktiviert.')
          tx.abort()
          return
        }
        const current = drafts.get(toolId)
        current.onsuccess = () => {
          const previous = current.result as unknown
          const revision = isRecoverySnapshot(previous, toolId) ? previous.revision : null
          if (previous !== undefined && revision === null) {
            failure = new Error('Ein beschädigter Recovery-Stand muss zuerst verworfen werden.')
            tx.abort()
            return
          }
          if (revision !== expectedRevision) {
            failure = new RecoveryConflictError()
            tx.abort()
            return
          }
          drafts.put(snapshot, toolId)
        }
      }
      tx.oncomplete = () => resolve(snapshot)
      tx.onabort = () => reject(failure ?? new Error('Lokale Sicherung fehlgeschlagen (Speicher gesperrt oder voll).'))
      tx.onerror = () => reject(failure ?? new Error('Lokale Sicherung fehlgeschlagen (Speicher gesperrt oder voll).'))
    })
  } finally {
    db.close()
  }
}

export async function discardToolRecovery(toolId: RecoveryToolId, expectedRevision?: number | null): Promise<void> {
  const db = await openDatabase()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('snapshots', 'readwrite')
      const drafts = tx.objectStore('snapshots')
      let conflict = false
      const current = drafts.get(toolId)
      current.onsuccess = () => {
        const previous = current.result as unknown
        const revision = isRecoverySnapshot(previous, toolId) ? previous.revision : null
        if (expectedRevision !== undefined && revision !== expectedRevision) {
          conflict = true
          tx.abort()
        } else {
          drafts.delete(toolId)
        }
      }
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(conflict ? new RecoveryConflictError() : new Error('Recoverydaten konnten nicht gelöscht werden.'))
      tx.onerror = () => reject(new Error('Recoverydaten konnten nicht gelöscht werden.'))
    })
  } finally {
    db.close()
  }
}

export async function clearAllToolRecovery(): Promise<void> {
  const db = await openDatabase()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['preferences', 'snapshots'], 'readwrite')
      tx.objectStore('preferences').clear()
      tx.objectStore('snapshots').clear()
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(new Error('Lokale Recoverydaten konnten nicht vollständig gelöscht werden.'))
      tx.onerror = () => reject(new Error('Lokale Recoverydaten konnten nicht vollständig gelöscht werden.'))
    })
  } finally {
    db.close()
  }
}
