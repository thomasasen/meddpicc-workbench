import { describe, expect, it } from 'vitest'

import { emptyCostOfDelayInput } from '../domain/costOfDelay'
import { emptyMetricDraft } from '../domain/metricBuilder'
import { blankValueBridge } from '../domain/valueBridge'
import { DEFAULT_SCENARIO_SETTINGS } from '../domain/businessCaseScenarios'
import { RECOVERY_MAX_BYTES, RECOVERY_TTL_MS, isRecoverySnapshot, writeToolRecovery } from './toolRecovery'
import {
  isCostOfDelayRecovery,
  isMetricBuilderRecovery,
  isReverseTimelineRecovery,
  isSoftwarePaybackRecovery,
  isValueBridgeRecovery,
} from './toolRecoveryValidators'

describe('Recovery envelope and privacy boundaries', () => {
  const now = Date.parse('2026-11-05T12:00:00.000Z')
  const base = {
    schemaVersion: 1,
    toolId: 'metric-builder',
    revision: 2,
    savedAt: new Date(now - 3000).toISOString(),
    expiresAt: new Date(now - 3000 + RECOVERY_TTL_MS).toISOString(),
    payload: { draft: emptyMetricDraft(), step: 1 },
  }

  it('rejects unknown versions, other tools, invalid timestamps and expired snapshots', () => {
    expect(isRecoverySnapshot(base, 'metric-builder', now)).toBe(true)
    expect(isRecoverySnapshot({ ...base, schemaVersion: 2 }, 'metric-builder', now)).toBe(false)
    expect(isRecoverySnapshot(base, 'value-bridge', now)).toBe(false)
    expect(isRecoverySnapshot({ ...base, revision: -1 }, 'metric-builder', now)).toBe(false)
    expect(isRecoverySnapshot({ ...base, expiresAt: new Date(now - 1).toISOString() }, 'metric-builder', now)).toBe(
      false,
    )
    expect(isRecoverySnapshot({ ...base, savedAt: 'invalid date' }, 'metric-builder', now)).toBe(false)
  })

  it('limits snapshot payload sizes before opening the browser database', async () => {
    expect(RECOVERY_MAX_BYTES).toBe(256 * 1024)
    await expect(writeToolRecovery('metric-builder', null, { secret: 'a'.repeat(RECOVERY_MAX_BYTES) })).rejects.toThrow(
      '256 KB',
    )
  })
})

describe('strict recovery payload contracts', () => {
  it('accepts incomplete but structurally valid input without treating it as customer evidence', () => {
    expect(isMetricBuilderRecovery({ draft: emptyMetricDraft(), step: 1 })).toBe(true)
    expect(
      isCostOfDelayRecovery({
        draft: emptyCostOfDelayInput(),
        step: 1,
        chosenDelay: 6,
        customDelay: null,
        benefitEntryPeriod: 'annual',
      }),
    ).toBe(true)
    expect(isValueBridgeRecovery({ draft: blankValueBridge(), step: 1 })).toBe(true)
    expect(
      isSoftwarePaybackRecovery({
        costs: [],
        metrics: [],
        horizon: 36,
        selectedScenario: 'base',
        scenarioSettings: structuredClone(DEFAULT_SCENARIO_SETTINGS),
        reportCustomer: '',
        reportProject: 'Softwareprojekt',
        reportAuthor: '',
        reportPain: '',
        reportGoal: '',
        reportDate: '05.11.2026',
      }),
    ).toBe(true)
    expect(
      isReverseTimelineRecovery({
        customerName: '',
        planTitle: 'Go-Live-Timeline',
        referenceDate: '2026-11-05',
        targetGoLiveDate: '',
        compellingEvent: '',
        steps: [],
      }),
    ).toBe(true)
  })

  it('rejects manipulated economic assumptions, malformed lists and injected keys', () => {
    expect(isMetricBuilderRecovery({ draft: { ...emptyMetricDraft(), formula: 'malicious' }, step: 1 })).toBe(false)
    expect(isValueBridgeRecovery({ draft: { ...blankValueBridge(), metrics: 'bad' }, step: 1 })).toBe(false)
    expect(
      isCostOfDelayRecovery({
        draft: { ...emptyCostOfDelayInput(), annualBenefitEur: Number.POSITIVE_INFINITY },
        step: 1,
        chosenDelay: 6,
        customDelay: null,
        benefitEntryPeriod: 'annual',
      }),
    ).toBe(false)
    expect(
      isReverseTimelineRecovery({
        customerName: '',
        planTitle: 'Plan',
        referenceDate: '',
        targetGoLiveDate: '',
        compellingEvent: '',
        steps: [
          { id: '1', label: 'step', duration: 4, durationUnit: 'invalid', owner: 'shared', area: 'implementation' },
        ],
      }),
    ).toBe(false)
    expect(isMetricBuilderRecovery(JSON.parse('{"draft":{},"step":1,"__proto__":{"admin":true}}'))).toBe(false)
  })
})
