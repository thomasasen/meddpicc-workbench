/**
 * Opt-in Wiederherstellung für eigenständige Microtools.
 * Kein Projektdatei-Ersatz und keine implizite fachliche Bestätigung.
 */
export const RECOVERY_VERSION = 1
export const RECOVERY_MAX_BYTES = 256 * 1024
export const RECOVERY_RETENTION_MS = 7 * 24 * 60 * 60 * 1000
const PREFIX = 'meddpicc:recovery:v1:'

export type RecoverySnapshot<T> = {
  version: 1
  tool: string
  token: string
  savedAt: string
  expiresAt: string
  data: T
}

export type RecoveryRead<T> =
  | { kind: 'none' }
  | { kind: 'available'; snapshot: RecoverySnapshot<T> }
  | { kind: 'invalid' }
  | { kind: 'unavailable' }

export class RecoveryStorageError extends Error {
  constructor(readonly reason: 'unavailable' | 'quota' | 'conflict' | 'invalid') {
    super(reason)
    this.name = 'RecoveryStorageError'
  }
}

function key(tool: string): string {
  if (!/^[a-z][a-z0-9-]{1,63}$/.test(tool)) throw new RecoveryStorageError('invalid')
  return PREFIX + tool
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function readRecovery<T>(
  storage: Storage,
  tool: string,
  validate: (data: unknown) => data is T,
  now = Date.now(),
): RecoveryRead<T> {
  let raw: string | null
  try {
    raw = storage.getItem(key(tool))
  } catch {
    return { kind: 'unavailable' }
  }
  if (raw === null) return { kind: 'none' }
  if (new TextEncoder().encode(raw).length > RECOVERY_MAX_BYTES) return { kind: 'invalid' }
  try {
    const value: unknown = JSON.parse(raw)
    if (
      !object(value) ||
      value.version !== RECOVERY_VERSION ||
      value.tool !== tool ||
      typeof value.token !== 'string' ||
      !/^[a-z0-9-]{8,80}$/i.test(value.token) ||
      typeof value.savedAt !== 'string' ||
      typeof value.expiresAt !== 'string' ||
      !Number.isFinite(Date.parse(value.savedAt)) ||
      !Number.isFinite(Date.parse(value.expiresAt)) ||
      Date.parse(value.expiresAt) <= now ||
      Date.parse(value.savedAt) > now + 60_000 ||
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

/**
 * compare-and-check gegen bereits beobachtete Änderungen; storage-Events
 * verhindern zusätzlich reguläre konkurrierende Schreibvorgänge. Web Storage
 * bietet KEIN atomisches Compare-and-Swap über mehrere Tabs.
 */
export function writeRecovery<T>(
  storage: Storage,
  tool: string,
  data: T,
  previousToken: string | null,
  validate: (data: unknown) => data is T,
  now = Date.now(),
): RecoverySnapshot<T> {
  if (!validate(data)) throw new RecoveryStorageError('invalid')
  const current = readRecovery(storage, tool, validate, now)
  if (current.kind === 'unavailable') throw new RecoveryStorageError('unavailable')
  if (current.kind === 'invalid') throw new RecoveryStorageError('invalid')
  if ((current.kind === 'available' ? current.snapshot.token : null) !== previousToken) {
    throw new RecoveryStorageError('conflict')
  }
  const snapshot: RecoverySnapshot<T> = {
    version: RECOVERY_VERSION,
    tool,
    token: crypto.randomUUID(),
    savedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + RECOVERY_RETENTION_MS).toISOString(),
    data: structuredClone(data),
  }
  const raw = JSON.stringify(snapshot)
  if (new TextEncoder().encode(raw).length > RECOVERY_MAX_BYTES) throw new RecoveryStorageError('quota')
  try {
    storage.setItem(key(tool), raw)
  } catch (error) {
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.code === 22)) {
      throw new RecoveryStorageError('quota')
    }
    throw new RecoveryStorageError('unavailable')
  }
  return snapshot
}

export function deleteRecovery(storage: Storage, tool: string): void {
  try {
    storage.removeItem(key(tool))
  } catch {
    throw new RecoveryStorageError('unavailable')
  }
}

export function deleteAllRecovery(storage: Storage): number {
  let removed = 0
  try {
    const keys: string[] = []
    for (let index = 0; index < storage.length; index += 1) {
      const name = storage.key(index)
      if (name?.startsWith(PREFIX)) keys.push(name)
    }
    for (const name of keys) {
      storage.removeItem(name)
      removed += 1
    }
  } catch {
    throw new RecoveryStorageError('unavailable')
  }
  return removed
}

export function recoveryStorageKey(tool: string): string {
  return key(tool)
}
