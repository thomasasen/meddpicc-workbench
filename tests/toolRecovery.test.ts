import { describe, expect, it } from 'vitest'
import {
  deleteAllRecovery,
  deleteRecovery,
  readRecovery,
  recoveryStorageKey,
  RECOVERY_RETENTION_MS,
  RecoveryStorageError,
  writeRecovery,
} from '../src/services/toolRecovery'

type Draft = { name: string; value: number }
const valid = (value: unknown): value is Draft =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.keys(value).every((key) => ['name', 'value'].includes(key)) &&
  typeof (value as Draft).name === 'string' &&
  typeof (value as Draft).value === 'number' &&
  Number.isFinite((value as Draft).value)

function storage(): Storage {
  const values = new Map<string, string>()
  return {
    get length() {
      return values.size
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => void values.delete(key),
    setItem: (key, value) => void values.set(key, value),
  }
}

describe('lokales Recovery (nur nach Opt-in durch den Aufrufer)', () => {
  it('speichert vor ausdrücklichem write-Aufruf keine Daten', () => {
    const local = storage()
    expect(readRecovery(local, 'metric-builder', valid).kind).toBe('none')
    expect(local.length).toBe(0)
  })

  it('prüft Wiederherstellung und löscht den gewählten Snapshot', () => {
    const local = storage()
    const saved = writeRecovery(local, 'metric-builder', { name: 'Test', value: 20 }, null, valid, 10_000)
    expect(readRecovery(local, 'metric-builder', valid, 10_001)).toEqual({
      kind: 'available',
      snapshot: saved,
    })
    deleteRecovery(local, 'metric-builder')
    expect(readRecovery(local, 'metric-builder', valid).kind).toBe('none')
  })

  it('verwirft abgelaufene und inkompatible Daten ohne teilweise Übernahme', () => {
    const local = storage()
    writeRecovery(local, 'metric-builder', { name: 'Alt', value: 1 }, null, valid, 10_000)
    expect(readRecovery(local, 'metric-builder', valid, 10_000 + RECOVERY_RETENTION_MS).kind).toBe('invalid')
    local.setItem(recoveryStorageKey('metric-builder'), '{"version":999}')
    expect(readRecovery(local, 'metric-builder', valid).kind).toBe('invalid')
  })

  it('verhindert veraltete Folgeschreibvorgänge eines weiteren Tabs', () => {
    const local = storage()
    const first = writeRecovery(local, 'metric-builder', { name: 'A', value: 1 }, null, valid)
    writeRecovery(local, 'metric-builder', { name: 'B', value: 2 }, first.token, valid)
    expect(() => writeRecovery(local, 'metric-builder', { name: 'C', value: 3 }, first.token, valid)).toThrowError(
      RecoveryStorageError,
    )
  })

  it('behandelt Speicherverbote und Quota ohne Datenverlust', () => {
    const local = storage()
    local.setItem = () => {
      throw new DOMException('blocked', 'QuotaExceededError')
    }
    expect(() => writeRecovery(local, 'metric-builder', { name: 'A', value: 1 }, null, valid)).toThrowError(
      RecoveryStorageError,
    )
    expect(readRecovery(local, 'metric-builder', valid).kind).toBe('none')
  })

  it('entfernt alle Recovery-Snapshots, aber keine anderen Browserdaten', () => {
    const local = storage()
    local.setItem('unrelated', 'keep')
    writeRecovery(local, 'metric-builder', { name: 'A', value: 1 }, null, valid)
    writeRecovery(local, 'cost-of-delay', { name: 'B', value: 2 }, null, valid)
    expect(deleteAllRecovery(local)).toBe(2)
    expect(local.getItem('unrelated')).toBe('keep')
    expect(local.length).toBe(1)
  })
})
