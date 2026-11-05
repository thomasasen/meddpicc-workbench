import { describe, expect, it } from 'vitest'
import {
  parseRecoverySnapshot,
  writeRecovery,
  RECOVERY_MAX_BYTES,
  RECOVERY_RETENTION_MS,
} from '../src/services/toolRecovery'
import { validMetricBuilderDraft, validCostOfDelayInput, validValueBridgeInput } from '../src/services/recoveryDrafts'
import { emptyMetricDraft } from '../src/domain/metricBuilder'
import { emptyCostOfDelayInput } from '../src/domain/costOfDelay'
import { blankValueBridge } from '../src/domain/valueBridge'

const valid = (value: unknown): value is { label: string } =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.keys(value).length === 1 &&
  typeof (value as { label?: unknown }).label === 'string'

const now = Date.parse('2026-11-05T12:00:00.000Z')
const snapshot = () => ({
  version: 1,
  tool: 'metric-builder',
  token: 'test-token-123',
  savedAt: new Date(now).toISOString(),
  expiresAt: new Date(now + RECOVERY_RETENTION_MS).toISOString(),
  data: { label: 'Test' },
})

describe('Recovery-Snapshot-Parser (keine Browserspeicherung)', () => {
  it('akzeptiert einen vollständigen, kompatiblen Stand', () => {
    expect(parseRecoverySnapshot(JSON.stringify(snapshot()), 'metric-builder', valid, now).kind).toBe('available')
  })

  it('weist Version, fremdes Tool, verfallene Snapshots und manipulierte Inhalte zurück', () => {
    for (const changes of [
      { version: 2 },
      { tool: 'value-bridge' },
      { expiresAt: new Date(now).toISOString() },
      { expiresAt: new Date(now - 1).toISOString() },
      { savedAt: new Date(now + 30_000).toISOString(), expiresAt: new Date(now + 5_000).toISOString() },
      { data: { label: 10 } },
      { data: { label: 'Test', unexpected: true } },
      { token: '' },
    ]) {
      expect(
        parseRecoverySnapshot(JSON.stringify({ ...snapshot(), ...changes }), 'metric-builder', valid, now).kind,
      ).toBe('invalid')
    }
  })

  it('erkennt unvollständige JSON-Werte und Größenüberschreitung', () => {
    expect(parseRecoverySnapshot('{', 'metric-builder', valid, now).kind).toBe('invalid')
    expect(parseRecoverySnapshot('x'.repeat(RECOVERY_MAX_BYTES + 1), 'metric-builder', valid, now).kind).toBe('invalid')
  })

  it('verarbeitet leere Speicherung und einen unverändert aufbewahrten Stand', () => {
    expect(parseRecoverySnapshot(undefined, 'metric-builder', valid, now).kind).toBe('none')
    expect(parseRecoverySnapshot(JSON.stringify(snapshot()), 'metric-builder', valid, now + 1).kind).toBe('available')
  })
})

describe('Tool-Verträge für untrusted Recoverydaten', () => {
  it('akzeptiert unvollständige, aber strukturell valide Entwürfe', () => {
    expect(validMetricBuilderDraft(emptyMetricDraft())).toBe(true)
    expect(validCostOfDelayInput(emptyCostOfDelayInput())).toBe(true)
    expect(validValueBridgeInput(blankValueBridge())).toBe(true)
  })

  it('verweigert fremde Felder, fehlerhafte Zahlen und falsch geformte Metrics', () => {
    expect(validMetricBuilderDraft({ ...emptyMetricDraft(), problem: 1 })).toBe(false)
    expect(validMetricBuilderDraft({ ...emptyMetricDraft(), extra: true })).toBe(false)
    expect(validCostOfDelayInput({ ...emptyCostOfDelayInput(), annualBenefitEur: 'not a number' })).toBe(false)
    expect(validValueBridgeInput({ ...blankValueBridge(), metrics: [{ included: true }] })).toBe(false)
  })
})

describe('Recovery-Grenzen vor dem Browserzugriff', () => {
  it('verhindert übergroße Schreibvorgänge bereits vor dem Öffnen der Datenbank', async () => {
    await expect(
      writeRecovery('metric-builder', { label: 'X'.repeat(RECOVERY_MAX_BYTES) }, null, valid),
    ).rejects.toMatchObject({ reason: 'quota' })
  })
})
