import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { blankBridgeMetric, blankValueBridge, evaluateValueBridge, valueBridgeDemos } from '../src/domain/valueBridge'
import { buildValueBridgePdf } from '../src/report/valueBridgePdf'
import {
  consumeValueBridgeHandoff,
  queueBuilderToBridge,
  queueDelayToBridge,
  queuePaybackToBridge,
} from '../src/domain/valueBridgeHandoff'
import { emptyMetricDraft, buildMetric } from '../src/domain/metricBuilder'
import { emptyCostOfDelayInput } from '../src/domain/costOfDelay'
import { exampleSoftwareProject } from '../src/domain/softwarePayback'

function fakeStorage() {
  const values = new Map<string, string>()
  return {
    setItem(key: string, value: string) {
      values.set(key, value)
    },
    getItem(key: string) {
      return values.get(key) ?? null
    },
    removeItem(key: string) {
      values.delete(key)
    },
  }
}

describe('Value Bridge: Wirkungs- und Evidenzlogik', () => {
  it('nutzt bei realisierbarer Wirkung die vorhandene Monats- und Payback-Engine', () => {
    const result = evaluateValueBridge(valueBridgeDemos.service!)
    expect(result.issues).toEqual([])
    expect(result.countedAnnualEur).toBe(36000)
    expect(result.financial).not.toBeNull()
    expect(result.financial!.costDetails).toHaveLength(2)
    expect(result.financial!.horizon).toBe(36)
    expect(result.questions.some((q) => q.includes('Modellannahme'))).toBe(true)
  })

  it('gibt für rein qualitative, Risiko- und Kapazitätswirkung keinen Euro-Business-Case aus', () => {
    for (const kind of ['capacity', 'risk', 'qualitative', 'potential'] as const) {
      const input = structuredClone(valueBridgeDemos.capacity!)
      input.metrics[0]!.kind = kind
      input.metrics[0]!.annualPotentialEur = 75000
      const result = evaluateValueBridge(input)
      expect(result.financial).toBeNull()
      expect(result.countedAnnualEur).toBe(0)
    }
  })

  it('verhindert doppelt angerechnete Wirkungsgruppen', () => {
    const result = evaluateValueBridge(valueBridgeDemos.sales!)
    expect(result.overlap).toHaveLength(1)
    expect(result.issues.join(' ')).toContain('Doppelzählung')
    expect(result.financial).toBeNull()
    expect(result.countedAnnualEur).toBe(0)
  })

  it('enthält keine unbewiesene Investitionsempfehlung bei offenen Projektkosten', () => {
    const input = structuredClone(valueBridgeDemos.service!)
    input.investmentEur = null
    expect(evaluateValueBridge(input).financial).toBeNull()
  })

  it('blockiert ungültige und leere Zahlen, aber erfindet keine Zahlen für fehlende Messwerte', () => {
    const input = structuredClone(valueBridgeDemos.service!)
    input.metrics[0]!.annualRealizedEur = Number.NaN
    expect(evaluateValueBridge(input).issues.join(' ')).toContain('gültigen EUR-Bereichs')
    input.metrics[0]!.annualRealizedEur = null
    expect(evaluateValueBridge(input).issues.join(' ')).toContain('Jahresbetrag fehlt')
    input.metrics[0]!.annualRealizedEur = 36000
    input.metrics[0]!.before = ''
    expect(evaluateValueBridge(input).questions.join(' ')).toContain('Ausgangswert')
    input.metrics[0]!.annualRealizedEur = 2e12
    expect(evaluateValueBridge(input).issues.length).toBeGreaterThan(0)
    input.metrics[0]!.annualRealizedEur = -50
    expect(evaluateValueBridge(input).issues.length).toBeGreaterThan(0)
    input.metrics[0]!.annualRealizedEur = 36000
    input.metrics[0]!.before = ''
    expect(evaluateValueBridge(input).financial).toBeNull()
  })

  it('verlangt die Herleitung des monetarisierten Jahreswertes', () => {
    const input = structuredClone(valueBridgeDemos.service!)
    input.metrics[0]!.calculation = ''
    const result = evaluateValueBridge(input)
    expect(result.issues.join(' ')).toContain('Herleitung')
    expect(result.financial).toBeNull()
    input.metrics[0]!.calculation = '(6000 - 3000) mal 12 = 36000'
    expect(evaluateValueBridge(input).issues).toEqual([])
  })

  it('erzwingt eine belegte Realisierung und verbietet Überschreiten des Potenzials', () => {
    const input = structuredClone(valueBridgeDemos.service!)
    input.metrics[0]!.realization = ''
    expect(evaluateValueBridge(input).issues.join(' ')).toContain('Realisierungsmechanismus')
    input.metrics[0]!.realization = 'Externe Rechnung sinkt'
    input.metrics[0]!.annualRealizedEur = 37000
    expect(evaluateValueBridge(input).issues.join(' ')).toContain('übersteigt')
  })

  it('gibt ungeprüfte Hypothesen und fehlende Belege nicht als Kundenbestätigung aus', () => {
    const input = structuredClone(valueBridgeDemos.service!)
    input.metrics[0]!.evidence = 'customer-reviewed'
    input.metrics[0]!.source = ''
    expect(evaluateValueBridge(input).issues.join(' ')).toContain('benannten Beleg')
    input.metrics[0]!.source = 'Von Ansprechpartner und Controlling geprüft'
    expect(evaluateValueBridge(input).issues).toEqual([])
  })

  it('behandelt lange deutsche Texte und zusätzliche Metrics ohne willkürliche Berechnung', () => {
    const input = blankValueBridge()
    input.pain = 'Arbeitsprozessorchestrierungsabstimmung'.repeat(20)
    input.metrics = [blankBridgeMetric('very-long')]
    input.metrics[0]!.name = 'Bearbeitungsqualitätsnachverfolgungsprozess'.repeat(12)
    expect(evaluateValueBridge(input).summary).toContain('Arbeitsprozessorchestrierung')
  })
})

describe('Value Bridge: Handoff und PDF', () => {
  it('bewahrt Metric-Builder-Evidenz und schaltet Finanzanrechnung nicht automatisch an', () => {
    const storage = fakeStorage()
    const draft = {
      ...emptyMetricDraft(),
      formula: 'qualitative' as const,
      problem: 'Manuelle Pflege',
      process: 'Service',
      outcome: 'Besserer Ablauf',
      beforeText: 'langsam',
      afterText: 'schnell',
      evidence: 'reference' as const,
    }
    const result = buildMetric(draft)
    expect(result.complete).toBe(true)
    queueBuilderToBridge(draft, result, storage)
    const imported = consumeValueBridgeHandoff(storage)
    expect(imported?.metrics[0]?.evidence).toBe('reference')
    expect(imported?.metrics[0]?.included).toBe(false)
    expect(imported?.metrics[0]?.kind).toBe('qualitative')
    expect(consumeValueBridgeHandoff(storage)).toBeNull()
  })

  it('übernimmt nur den modellierten Ausgangsnutzen aus Cost of Delay und keine Szenariodifferenz', () => {
    const storage = fakeStorage()
    const input = {
      ...emptyCostOfDelayInput(),
      title: 'Prozess',
      annualBenefitEur: 12000,
      effectGroup: 'a',
      financialTreatment: 'realized' as const,
      evidence: 'customer-stated' as const,
    }
    queueDelayToBridge(input, storage)
    const imported = consumeValueBridgeHandoff(storage)
    expect(imported?.metrics[0]?.annualRealizedEur).toBe(12000)
    expect(imported?.metrics[0]?.evidence).toBe('customer-stated')
    expect(imported?.metrics[0]?.included).toBe(false)
    expect(imported?.metrics[0]?.kind).toBe('unclassified')
  })

  it('übernimmt einen Cost-of-Delay-Einmaleffekt niemals als wiederkehrende Jahreswirkung', () => {
    const storage = fakeStorage()
    const input = {
      ...emptyCostOfDelayInput(),
      title: 'Einmalige Vertragsgutschrift',
      benefitKind: 'one-time' as const,
      annualBenefitEur: 50000,
      financialTreatment: 'realized' as const,
      effectGroup: 'einmalig',
      source: 'Fiktive Gutschrift nur in einem Monat',
    }
    queueDelayToBridge(input, storage)
    const imported = consumeValueBridgeHandoff(storage)
    expect(imported?.metrics[0]?.kind).toBe('potential')
    expect(imported?.metrics[0]?.annualRealizedEur).toBeNull()
    expect(imported?.metrics[0]?.included).toBe(false)
    expect(imported?.metrics[0]?.source).toContain('Einmaleffekt')
  })

  it('reine Umsatzerwartung bleibt nichtfinanziell, auch bei hohem Potenzial', () => {
    const input = structuredClone(valueBridgeDemos.capacity!)
    input.metrics[0]!.kind = 'revenue'
    input.metrics[0]!.annualPotentialEur = 999999999
    input.metrics[0]!.included = false
    const result = evaluateValueBridge(input)
    expect(result.countedAnnualEur).toBe(0)
    expect(result.financial).toBeNull()
    expect(result.questions.join(' ')).toContain('Umsatzerwartung')
    input.metrics[0]!.included = true
    expect(evaluateValueBridge(input).issues.join(' ')).toContain('darf nicht')
  })

  it('übernimmt nur kompatible Payback-Kosten, nicht beliebige Zeitreihen', () => {
    const storage = fakeStorage()
    const input = exampleSoftwareProject()
    queuePaybackToBridge(input, storage)
    const imported = consumeValueBridgeHandoff(storage)
    expect(imported?.investmentEur).toBe(120000)
    expect(imported?.saasMonthlyEur).toBe(3000)
    expect(imported?.metrics[0]?.included).toBe(false)
    input.costs[1]!.period = 'annual'
    queuePaybackToBridge(input, storage)
    expect(consumeValueBridgeHandoff(storage)?.investmentEur).toBeNull()
  })

  it('verwirft fremde oder fehlerhafte Handoff-Formate', () => {
    const storage = fakeStorage()
    storage.setItem(
      'meddpicc-value-bridge-handoff-v1',
      JSON.stringify({
        version: 1,
        input: { ...blankValueBridge(), metrics: [{ ...blankBridgeMetric('x'), included: true }] },
      }),
    )
    expect(consumeValueBridgeHandoff(storage)).toBeNull()
  })

  it('erzeugt echte PDF-Seiten mit offenen Annahmen und langen Bezeichnungen', async () => {
    const input = structuredClone(valueBridgeDemos.capacity!)
    input.pain = 'Lange deutsche Prozessbezeichnung'.repeat(35)
    input.metrics[0]!.source = 'Ungeprüfte Ausgangslage'.repeat(50)
    const doc = await PDFDocument.load(await buildValueBridgePdf(input))
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(2)
    expect(doc.getPageCount()).toBeLessThan(20)
  })

  it('erzeugt den vollständig monetarisierten PDF-Fall', async () => {
    const doc = await PDFDocument.load(await buildValueBridgePdf(valueBridgeDemos.service!))
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1)
  })
})
