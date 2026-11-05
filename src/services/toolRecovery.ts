/**
 * Optionales, nicht verschlüsseltes Browser-Recovery für einzelne Microtools.
 * .meddpicc-Import/Export und temporäre Session-Handoffs bleiben unabhängig.
 */
export const RECOVERY_VERSION = 1
export const RECOVERY_MAX_BYTES = 256 * 1024
export const RECOVERY_RETENTION_MS = 7 * 24 * 60 * 60 * 1000

const DB_NAME = 'meddpicc-tool-recovery'
const STORE_NAME = 'snapshots'

export type RecoverySnapshot<T> = {
  version: 1
  tool: string
  token: string
  savedAt: string
  expiresAt: string
  data: T
}

export type RecoveryRead<T> =
  { kind: 'none' } | { kind: 'available'; snapshot: RecoverySnapshot<T> } | { kind: 'invalid' }

export class RecoveryStorageError extends Error {
  constructor(readonly reason: 'unavailable' | 'quota' | 'conflict' | 'invalid') {
    super(reason)
    this.name = 'RecoveryStorageError'
  }
}

function validateTool(tool: string): void {
  if (!/^[a-z][a-z0-9-]{1,63}$/.test(tool)) throw new RecoveryStorageError('invalid')
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function parseRecoverySnapshot<T>(
  raw: unknown,
  tool: string,
  validate: (data: unknown) => data is T,
  now: number,
): RecoveryRead<T> {
  if (raw === undefined) return { kind: 'none' }
  if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > RECOVERY_MAX_BYTES) return { kind: 'invalid' }
  try {
    const value: unknown = JSON.parse(raw)
    if (
      !isObject(value) ||
      value.version !== RECOVERY_VERSION ||
      value.tool !== tool ||
      typeof value.token !== 'string' ||
      !/^[a-z0-9-]{8,80}$/i.test(value.token) ||
      typeof value.savedAt !== 'string' ||
      typeof value.expiresAt !== 'string' ||
      !Number.isFinite(Date.parse(value.savedAt)) ||
      !Number.isFinite(Date.parse(value.expiresAt)) ||
      Date.parse(value.savedAt) > now + 60_000 ||
      Date.parse(value.expiresAt) <= now ||
      Date.parse(value.expiresAt) - Date.parse(value.savedAt) > RECOVERY_RETENTION_MS ||
      !validate(value.data)
    ) {
      return { kind: 'invalid' }
    }
    return { kind: 'available', snapshot: value as RecoverySnapshot<T> }
  } catch {
    return { kind: 'invalid' }
  }
}

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new RecoveryStorageError('unavailable'))
      return
    }
    let request: IDBOpenDBRequest
    try {
      request = indexedDB.open(DB_NAME, 1)
    } catch {
      reject(new RecoveryStorageError('unavailable'))
      return
    }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close()
      resolve(request.result)
    }
    request.onerror = () => reject(new RecoveryStorageError('unavailable'))
    request.onblocked = () => reject(new RecoveryStorageError('unavailable'))
  })
}

function classify(error: unknown): RecoveryStorageError {
  if (error instanceof RecoveryStorageError) return error
  if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22))
    return new RecoveryStorageError('quota')
  return new RecoveryStorageError('unavailable')
}

export async function readRecovery<T>(
  tool: string,
  validate: (data: unknown) => data is T,
  now = Date.now(),
): Promise<RecoveryRead<T>> {
  validateTool(tool)
  const db = await database()
  try {
    return await new Promise<RecoveryRead<T>>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const request = tx.objectStore(STORE_NAME).get(tool)
      let result: RecoveryRead<T> = { kind: 'none' }
      request.onsuccess = () => {
        result = parseRecoverySnapshot(request.result, tool, validate, now)
      }
      tx.oncomplete = () => resolve(result)
      tx.onabort = () => reject(classify(tx.error))
      tx.onerror = () => {
        /* Der transaktionale Abbruch meldet den Fehler. */
      }
    })
  } finally {
    db.close()
  }
}

/** Get + token check + put finden in derselben readwrite-Transaktion statt. */
export async function writeRecovery<T>(
  tool: string,
  data: T,
  expectedToken: string | null,
  validate: (data: unknown) => data is T,
  now = Date.now(),
): Promise<RecoverySnapshot<T>> {
  validateTool(tool)
  if (!validate(data)) throw new RecoveryStorageError('invalid')
  let snapshot: RecoverySnapshot<T>
  let raw: string
  try {
    // Vue-Proxies lassen sich nicht structuredClone-n. JSON bildet den
    // expliziten Snapshot-Vertrag ab und trennt den Datensatz vom UI-State.
    snapshot = {
      version: RECOVERY_VERSION,
      tool,
      token: crypto.randomUUID(),
      savedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + RECOVERY_RETENTION_MS).toISOString(),
      data: JSON.parse(JSON.stringify(data)) as T,
    }
    raw = JSON.stringify(snapshot)
  } catch {
    throw new RecoveryStorageError('invalid')
  }
  if (new TextEncoder().encode(raw).length > RECOVERY_MAX_BYTES) throw new RecoveryStorageError('quota')
  const db = await database()
  try {
    return await new Promise<RecoverySnapshot<T>>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(tool)
      let failure: RecoveryStorageError | null = null
      request.onsuccess = () => {
        const current = parseRecoverySnapshot(request.result, tool, validate, now)
        if (current.kind === 'invalid') {
          failure = new RecoveryStorageError('invalid')
          tx.abort()
          return
        }
        const token = current.kind === 'available' ? current.snapshot.token : null
        if (token !== expectedToken) {
          failure = new RecoveryStorageError('conflict')
          tx.abort()
          return
        }
        store.put(raw, tool)
      }
      tx.oncomplete = () => resolve(snapshot)
      tx.onabort = () => reject(failure ?? classify(tx.error))
      tx.onerror = () => {
        /* Fehler werden erst nach Rollback veröffentlicht. */
      }
    })
  } finally {
    db.close()
  }
}

export async function deleteRecovery(tool: string): Promise<void> {
  validateTool(tool)
  const db = await database()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(tool)
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(classify(tx.error))
    })
  } finally {
    db.close()
  }
}

export async function deleteAllRecovery(): Promise<void> {
  const db = await database()
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).clear()
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(classify(tx.error))
    })
  } finally {
    db.close()
  }
}
