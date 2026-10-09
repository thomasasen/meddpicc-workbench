<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDownToLine, ClipboardCopy, Plus, RotateCcw, Trash2 } from '@lucide/vue'
import {
  annualMetricPotential,
  calculateSoftwarePayback,
  exampleSoftwareProject,
  newMetric,
  type CostKind,
  type CustomerMetric,
  type MetricFormula,
  type SoftwareCost,
} from '../domain/softwarePayback'
import { formatEuro } from '../domain/quickPayback'
import { createCrmSaasDemo } from '../data/softwarePaybackDemo'
import SoftwareBalanceChart from './SoftwareBalanceChart.vue'
import { summarizeBusinessCase } from '../domain/businessCase'
import { buildSoftwareBusinessCasePdf } from '../report/softwareBusinessCasePdf'
import { buildCustomerBusinessCasePdf } from '../report/customerBusinessCasePdf'
import { compareBusinessScenarios, DEFAULT_SCENARIO_SETTINGS, describeScenarioAssumptions, type BusinessScenarioId, type ScenarioSettings } from '../domain/businessCaseScenarios'

const costs = ref<SoftwareCost[]>([])
const metrics = ref<CustomerMetric[]>([])
const horizon = ref<36 | 60>(36)
const selectedScenario = ref<BusinessScenarioId>('base')
const scenarioSettings = ref<ScenarioSettings>({
  conservative: { ...DEFAULT_SCENARIO_SETTINGS.conservative },
  optimistic: { ...DEFAULT_SCENARIO_SETTINGS.optimistic },
})
function resetScenarios() {
  selectedScenario.value = 'base'
  scenarioSettings.value = {
    conservative: { ...DEFAULT_SCENARIO_SETTINGS.conservative },
    optimistic: { ...DEFAULT_SCENARIO_SETTINGS.optimistic },
  }
}
const scenarioRows = computed(() => compareBusinessScenarios({
  horizonMonths: horizon.value, costs: costs.value, metrics: metrics.value,
}, scenarioSettings.value))
const activeScenario = computed(() => scenarioRows.value?.find((s) => s.id === selectedScenario.value) ?? null)
const activePlan = computed(() => {
  if (!activeScenario.value) return null
  const input = { horizonMonths: horizon.value, costs: costs.value, metrics: metrics.value }
  const r = calculateSoftwarePayback(input, activeScenario.value.assumptions)
  return r.success ? r : null
})
const signedEuro = (n: number) => (n > 0 ? '+' : '') + formatEuro(n)
const roiLabel = (n: number | null) => n === null ? 'Nicht definiert' :
  n.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %'
const copyStatus = ref('')
const exportStatus = ref('')
const demoMessage = ref('')
const chartRef = ref<InstanceType<typeof SoftwareBalanceChart> | null>(null)
const reportCustomer = ref('')
const reportProject = ref('Softwareprojekt')
const reportAuthor = ref('')
const reportPain = ref('')
const reportGoal = ref('')
const reportStatus = ref('')
const reportDate = ref(new Date().toLocaleDateString('de-DE'))
const businessCase = computed(() =>
  summarizeBusinessCase({
    horizonMonths: horizon.value,
    costs: costs.value,
    metrics: metrics.value,
  }),
)
let idCounter = 0

const result = computed(() =>
  calculateSoftwarePayback({
    horizonMonths: horizon.value,
    costs: costs.value,
    metrics: metrics.value,
  }),
)
const plan = computed(() => (result.value.success ? result.value : null))

function id(prefix: string): string {
  idCounter += 1
  return prefix + '-' + idCounter
}
function addCost(kind: CostKind) {
  costs.value.push({
    id: id('cost'),
    name: kind === 'one-time' ? 'Projektaufwand' : kind === 'saas' ? 'SaaS / Betrieb' : 'Abgelöstes Bestandssystem',
    kind,
    amountEur: 0,
    period: 'monthly',
    startMonth: kind === 'one-time' ? 0 : 1,
    effectGroup: kind === 'avoided-legacy' ? id('legacy') : undefined,
  })
}
function addMetric(formula: MetricFormula = 'direct') {
  metrics.value.push(newMetric(id('metric'), formula))
}
function setFormula(metric: CustomerMetric, event: Event) {
  const formula = (event.target as HTMLSelectElement).value as MetricFormula
  metric.formula = formula
  metric.treatment =
    formula === 'risk'
      ? 'risk'
      : formula === 'qualitative'
        ? 'nonfinancial'
        : formula === 'time'
          ? 'capacity'
          : 'realized'
  metric.included = false
}
function setOptionalEndMonth(item: { endMonth?: number }, event: Event) {
  const raw = (event.target as HTMLInputElement).value
  if (!raw) delete item.endMonth
  else item.endMonth = Number(raw)
}
function removeCost(id: string) {
  costs.value = costs.value.filter((c) => c.id !== id)
}
function removeMetric(id: string) {
  metrics.value = metrics.value.filter((m) => m.id !== id)
}
function loadExample() {
  resetScenarios()
  reportCustomer.value = ''
  reportProject.value = 'Softwareeinführung'
  reportPain.value = ''
  reportGoal.value = ''
  const example = exampleSoftwareProject()
  costs.value = example.costs
  metrics.value = example.metrics
  horizon.value = example.horizonMonths
  demoMessage.value =
    'Fiktives Kurzbeispiel: 120.000 EUR einmalig, 3.000 EUR SaaS/Monat, Nutzen ab Monat 7. Keine kundenseitige Validierung.'
  copyStatus.value = ''
  exportStatus.value = ''
}
function loadCrmSaasDemo() {
  resetScenarios()
  reportCustomer.value = 'Beispielwerke Industrie GmbH'
  reportProject.value = 'CRM & Service Transformation 2027'
  reportPain.value =
    'Hoher Aufwand bei CRM-Nacharbeit, Servicevorgängen und mangelnde Nachvollziehbarkeit der Vertriebsprozesse. (Fiktive Ausgangslage.)'
  reportGoal.value =
    'Manuelle Leistungen reduzieren, wirtschaftlich realisierte Kostensenkungen belegen und Conversion verbessern. (Fiktives Zielbild.)'
  const example = createCrmSaasDemo()
  costs.value = example.costs
  metrics.value = example.metrics
  horizon.value = example.horizonMonths
  demoMessage.value =
    'Fiktives CRM-/SaaS-Beispiel: drei hypothetische EUR-Metrics gehen in die Rechnung ein. Zeitersparnis und Risiko sind nicht angerechnet. Keine bestätigten Kundenzahlen.'
  copyStatus.value = ''
  exportStatus.value = ''
}
function clear() {
  resetScenarios()
  reportCustomer.value = ''
  reportProject.value = 'Softwareprojekt'
  reportPain.value = ''
  reportGoal.value = ''
  reportAuthor.value = ''
  reportStatus.value = ''
  demoMessage.value = ''
  costs.value = []
  metrics.value = []
  horizon.value = 36
  copyStatus.value = ''
  exportStatus.value = ''
}

const metricTypes: { value: MetricFormula; label: string }[] = [
  { value: 'direct', label: 'Direkte jährliche EUR-Einsparung / Deckungsbeitrag' },
  { value: 'process', label: 'Vorgänge × veränderte Kosten je Vorgang' },
  { value: 'time', label: 'Vorgänge × Minutenersparnis × Vollkostensatz' },
  { value: 'conversion', label: 'Abschlussquote × zusätzlicher Deckungsbeitrag' },
  { value: 'quality', label: 'Fehlerquote × vermeidbare Fehlerkosten' },
  { value: 'risk', label: 'Risikoreduktion (nur separat ausweisen)' },
  { value: 'qualitative', label: 'Operative / qualitative Kennzahl' },
]

function evidenceLabel(value: CustomerMetric['evidence']): string {
  return {
    hypothesis: 'Verkäuferannahme',
    reference: 'Referenzwert / M1-Hypothese',
    'customer-stated': 'Kundenaussage (nicht unabhängig geprüft)',
    'customer-reviewed': 'Nach eigener Dokumentation mit Kunden geprüft',
  }[value]
}

const checkpoints = computed(() =>
  activePlan.value
    ? [0, 6, 12, 18, 24, 36, 60].filter((m) => m <= horizon.value).map((month) => activePlan.value!.months[month]!)
    : [],
)
const summary = computed(() => {
  if (!plan.value) return ''
  const current = plan.value
  const payback =
    current.sustainedBreakEvenMonth === null
      ? 'Keine bis zum Projektmonat ' + horizon.value + ' anhaltende Amortisation nachweisbar.'
      : 'Bis zum Betrachtungsende anhaltender Break-even im Projektmonat ' + current.sustainedBreakEvenMonth + '.'
  return (
    'Softwareprojekt – Modellrechnung / Schätzung. ' +
    payback +
    ' Kumulierter wirtschaftlicher Saldo bis Monat ' +
    horizon.value +
    ': ' +
    formatEuro(current.cumulativeEur) +
    '. Angesetzte Projektkosten: ' +
    formatEuro(current.costTotalEur) +
    '; berücksichtigter Nutzen einschließlich abgelöster Bestandssysteme: ' +
    formatEuro(current.benefitTotalEur) +
    '. ' +
    current.countedMetrics.length +
    ' finanzielle Kunden-Metrics, davon ' +
    current.unresolvedAssumptions +
    ' nicht als kundenseitig geprüft gekennzeichnet. ' +
    'Wirtschaftliche Monatsrechnung gegenüber dem Status quo, keine zahlungszeitgenaue Liquiditätsplanung, keine Garantie oder Budgetfreigabe.'
  )
})

async function copySummary() {
  if (!plan.value) return
  try {
    await navigator.clipboard.writeText(summary.value)
    copyStatus.value = 'Kundenbotschaft kopiert.'
  } catch {
    copyStatus.value = 'Kopieren fehlgeschlagen. Bitte Text markieren und manuell kopieren.'
  }
}
function graphMarkup(): string {
  const svg = chartRef.value?.getSvgElement()
  if (!svg) throw new Error('Grafik nicht vorhanden')
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', '1200')
  clone.setAttribute('height', '475')
  clone.setAttribute('style', 'background:#ffffff;font-family:system-ui,sans-serif')
  return new XMLSerializer().serializeToString(clone)
}
function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
function exportSvg() {
  try {
    saveBlob(new Blob([graphMarkup()], { type: 'image/svg+xml;charset=utf-8' }), 'software-payback.svg')
    exportStatus.value = 'SVG-Grafik erstellt.'
  } catch {
    exportStatus.value = 'SVG-Export nicht möglich.'
  }
}
async function exportPng() {
  try {
    const markup = graphMarkup()
    const svgBlob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' })
    const src = URL.createObjectURL(svgBlob)
    const img = new Image()
    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('SVG-Darstellung nicht möglich'))
        img.src = src
      })
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 475
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas nicht verfügbar')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('PNG-Konvertierung fehlgeschlagen')
      saveBlob(blob, 'software-payback.png')
      exportStatus.value = 'PNG-Grafik erstellt.'
    } finally {
      URL.revokeObjectURL(src)
    }
  } catch {
    exportStatus.value = 'PNG-Export nicht möglich. Alternativ SVG exportieren.'
  }
}
async function downloadReport(kind: 'customer' | 'finance') {
  if (!businessCase.value || !scenarioRows.value) {
    reportStatus.value = 'Bitte zuerst die Kosten- und Nutzenangaben korrigieren.'
    return
  }
  if (!reportCustomer.value.trim() || !reportProject.value.trim() || !reportAuthor.value.trim()) {
    reportStatus.value = 'Für den PDF-Export bitte Kunde, Projekt und Verfasser angeben.'
    return
  }
  if (kind === 'customer' && (!reportPain.value.trim() || !reportGoal.value.trim())) {
    reportStatus.value = 'Für den Kundenbericht bitte Ausgangssituation und angestrebtes Ergebnis ergänzen.'
    return
  }
  reportStatus.value = 'PDF wird erstellt ...'
  try {
    const data = {
      customer: reportCustomer.value,
      project: reportProject.value,
      preparedBy: reportAuthor.value,
      businessPain: reportPain.value,
      targetOutcome: reportGoal.value,
      date: reportDate.value,
      input: { horizonMonths: horizon.value, costs: costs.value, metrics: metrics.value },
      scenarioSettings: scenarioSettings.value,
      selectedScenario: selectedScenario.value,
    }
    const bytes =
      kind === 'customer' ? await buildCustomerBusinessCasePdf(data) : await buildSoftwareBusinessCasePdf(data)
    const safeName = reportProject.value.replace(/[^a-z0-9_-]+/gi, '-').slice(0, 55) || 'softwareprojekt'
    const prefix = kind === 'customer' ? 'kundenbericht-' : 'finance-anhang-'
    saveBlob(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }), prefix + safeName + '.pdf')
    reportStatus.value = kind === 'customer' ? 'Kundenbericht erstellt.' : 'Finance-Anhang erstellt.'
  } catch {
    reportStatus.value = 'PDF-Erstellung fehlgeschlagen. Bitte Eingaben prüfen und erneut versuchen.'
  }
}
</script>

<template>
  <div class="software-panel">
    <section class="quick-panel software-block" aria-labelledby="software-cost-heading">
      <div class="software-heading">
        <div>
          <p class="eyebrow">1 · Vergleichsbasis</p>
          <h2 id="software-cost-heading">Kosten erfassen</h2>
        </div>
        <button type="button" class="button button-quiet button-with-icon" @click="clear">
          <RotateCcw :size="16" aria-hidden="true" /> Zurücksetzen
        </button>
      </div>
      <p class="software-muted">
        Was kostet die Einführung, was läuft monatlich weiter und welche bisherigen Kosten entfallen?
      </p>
      <div class="software-actions software-cost-actions">
        <button type="button" class="button button-secondary" @click="addCost('one-time')">
          <Plus :size="16" aria-hidden="true" /> Einmalkosten
        </button>
        <button type="button" class="button button-secondary" @click="addCost('saas')">
          <Plus :size="16" aria-hidden="true" /> SaaS / Betrieb
        </button>
        <button type="button" class="button button-secondary" @click="addCost('avoided-legacy')">
          <Plus :size="16" aria-hidden="true" /> Altsystem entfällt
        </button>
      </div>
      <div class="software-start-example">
        <span>Oder zuerst ansehen:</span>
        <button type="button" class="software-example-link" @click="loadExample">Einfaches Beispiel laden</button>
        <span aria-hidden="true">·</span>
        <button type="button" class="software-example-link" @click="loadCrmSaasDemo">
          CRM-/SaaS-Beispiel mit Kunden-Metrics
        </button>
      </div>
      <p v-if="demoMessage" class="software-muted" role="status">{{ demoMessage }}</p>
      <p v-if="costs.length === 0" class="software-empty">
        Mit <strong>Einmalkosten</strong> oder <strong>SaaS / Betrieb</strong> starten.
      </p>
      <article v-for="cost in costs" :key="cost.id" class="software-entry">
        <div class="software-entry-heading">
          <strong>{{
            cost.kind === 'one-time'
              ? 'Einmaliger Aufwand'
              : cost.kind === 'saas'
                ? 'Laufende neue Kosten'
                : 'Vermeidbare Bestandskosten'
          }}</strong>
          <button
            type="button"
            class="software-remove"
            :aria-label="cost.name + ' entfernen'"
            @click="removeCost(cost.id)"
          >
            <Trash2 :size="17" aria-hidden="true" /> Entfernen
          </button>
        </div>
        <div class="software-fields">
          <label class="field"><span>Position</span><input v-model="cost.name" type="text" maxlength="120" /></label>
          <label class="field"
            ><span>Betrag in EUR</span> <input v-model.number="cost.amountEur" type="number" min="0" step="0.01"
          /></label>
          <label v-if="cost.kind !== 'one-time'" class="field"
            ><span>Betrag gilt pro</span>
            <select v-model="cost.period">
              <option value="monthly">Monat</option>
              <option value="annual">Jahr</option>
            </select>
          </label>
          <label class="field"
            ><span>{{ cost.kind === 'one-time' ? 'Kosten im Projektmonat' : 'Wirksam ab Projektmonat' }}</span>
            <input v-model.number="cost.startMonth" type="number" min="0" :max="horizon" step="1"
          /></label>
          <label v-if="cost.kind !== 'one-time'" class="field"
            ><span>Endmonat (optional)</span>
            <input
              :value="cost.endMonth ?? ''"
              @input="setOptionalEndMonth(cost, $event)"
              type="number"
              min="0"
              :max="horizon"
              placeholder="Bis zum Ende"
          /></label>
          <label v-if="cost.kind === 'avoided-legacy'" class="field"
            ><span>Wirkungsgruppe gegen Doppelerfassung</span>
            <input v-model="cost.effectGroup" type="text" maxlength="80"
          /></label>
        </div>
      </article>
    </section>

    <section class="quick-panel software-block" aria-labelledby="software-metrics-heading">
      <div class="software-heading">
        <div>
          <p class="eyebrow">2 · Customer Metrics</p>
          <h2 id="software-metrics-heading">Kundennutzen erfassen</h2>
        </div>
        <button type="button" class="button button-primary button-with-icon" @click="addMetric()">
          <Plus :size="16" aria-hidden="true" /> Metric hinzufügen
        </button>
      </div>
      <p class="software-muted">Eine Kennzahl pro Wirkung. Nur wirtschaftlich belegbare EUR-Effekte anrechnen.</p>
      <p v-if="metrics.length === 0" class="software-empty">
        <strong>Metric hinzufügen</strong> wählen. Als Einstieg reicht eine jährliche Einsparung in EUR.
      </p>
      <article v-for="(metric, index) in metrics" :key="metric.id" class="software-entry">
        <div class="software-entry-heading">
          <strong>Metric {{ index + 1 }} · {{ metric.name }}</strong>
          <button
            type="button"
            class="software-remove"
            :aria-label="metric.name + ' entfernen'"
            @click="removeMetric(metric.id)"
          >
            <Trash2 :size="17" aria-hidden="true" /> Entfernen
          </button>
        </div>
        <div class="software-fields">
          <label class="field"
            ><span>Bezeichnung / Kundenproblem</span><input v-model="metric.name" type="text" maxlength="140"
          /></label>
          <label class="field"
            ><span>Wie wird der Nutzen berechnet?</span>
            <select :value="metric.formula" @change="setFormula(metric, $event)">
              <option v-for="option in metricTypes" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
          <label v-if="metric.formula === 'direct' || metric.formula === 'risk'" class="field">
            <span>Jährlicher Nutzen (EUR)</span>
            <input v-model.number="metric.annualAmountEur" type="number" min="0" step="0.01" />
          </label>
          <template v-if="['process', 'time', 'conversion', 'quality'].includes(metric.formula)">
            <label class="field"
              ><span>Vorgänge pro Jahr</span>
              <input v-model.number="metric.annualVolume" type="number" min="0" step="1"
            /></label>
            <label class="field"
              ><span
                >Ist-Wert
                {{
                  metric.formula === 'time'
                    ? '(Minuten)'
                    : ['quality', 'conversion'].includes(metric.formula)
                      ? '(%)'
                      : '(EUR/Vorgang)'
                }}</span
              >
              <input v-model.number="metric.before" type="number" min="0" step="any"
            /></label>
            <label class="field"
              ><span
                >Ziel-Wert
                {{
                  metric.formula === 'time'
                    ? '(Minuten)'
                    : ['quality', 'conversion'].includes(metric.formula)
                      ? '(%)'
                      : '(EUR/Vorgang)'
                }}</span
              >
              <input v-model.number="metric.after" type="number" min="0" step="any"
            /></label>
            <label v-if="metric.formula === 'time'" class="field"
              ><span>Vollkostensatz (EUR/Stunde)</span>
              <input v-model.number="metric.hourlyCostEur" type="number" min="0" step="any"
            /></label>
            <label v-if="metric.formula === 'conversion' || metric.formula === 'quality'" class="field">
              <span>{{
                metric.formula === 'conversion'
                  ? 'Zusätzlicher Deckungsbeitrag je Abschluss (EUR)'
                  : 'Tatsächlich vermeidbare Kosten je Fehler (EUR)'
              }}</span>
              <input v-model.number="metric.valuePerEventEur" type="number" min="0" step="any" />
            </label>
          </template>
        </div>
        <div class="software-metric-footer">
          <label class="software-check"
            ><input
              v-model="metric.included"
              type="checkbox"
              :disabled="
                metric.treatment !== 'realized' || metric.formula === 'risk' || metric.formula === 'qualitative'
              "
            />
            In den Payback einrechnen
          </label>
          <div class="software-metric-value">
            <strong>{{
              annualMetricPotential(metric) === null
                ? 'Nicht monetarisiert'
                : formatEuro(annualMetricPotential(metric) ?? 0) + ' / Jahr'
            }}</strong>
            <span>{{
              metric.included && metric.treatment === 'realized' ? 'Zur Rechnung vorgesehen' : 'Nicht angerechnet'
            }}</span>
          </div>
        </div>

        <div v-if="metric.included && metric.treatment === 'realized'" class="software-evidence">
          <label class="field software-full"
            ><span>Wie wird der EUR-Nutzen tatsächlich realisiert?</span>
            <textarea
              v-model="metric.evidenceNote"
              rows="2"
              maxlength="600"
              placeholder="z. B. nachweislich entfallende Fremdleistung, künftig vermiedene Einstellung oder kundenseitig geprüfter Deckungsbeitrag"
            />
          </label>
        </div>
        <details class="software-more">
          <summary>
            <span class="software-more-label">Zeitplan &amp; Herkunft</span>
            <span class="software-more-hint"
              >Start Monat {{ metric.startMonth }} · {{ evidenceLabel(metric.evidence) }}</span
            >
          </summary>
          <div class="software-fields software-detail-fields">
            <label class="field"
              ><span>Wirtschaftliche Einordnung</span>
              <select
                v-model="metric.treatment"
                :disabled="metric.formula === 'risk' || metric.formula === 'qualitative'"
              >
                <option value="realized">Tatsächlich realisierbare EUR-Wirkung</option>
                <option value="capacity">Nur freigesetzte Kapazität</option>
                <option value="risk">Risikoerwartungswert, keine sichere Einsparung</option>
                <option value="nonfinancial">Nicht monetarisierte Kennzahl</option>
              </select>
            </label>
            <label class="field"
              ><span>Herkunft / Datenqualität</span>
              <select v-model="metric.evidence">
                <option value="hypothesis">Verkäuferannahme</option>
                <option value="reference">Referenzwert (M1-Hypothese)</option>
                <option value="customer-stated">Kundenaussage</option>
                <option value="customer-reviewed">Laut eigener Dokumentation kundenseitig geprüft</option>
              </select>
            </label>
            <label class="field"
              ><span>Wirkungsgruppe</span>
              <input v-model="metric.effectGroup" type="text" maxlength="80" />
              <small
                >Identische wirtschaftliche Ursachen in dieselbe Gruppe einordnen. Dann verhindert der Rechner
                Mehrfachanrechnung.</small
              >
            </label>
            <label class="field"
              ><span>Erster Nutzenmonat</span>
              <input v-model.number="metric.startMonth" type="number" min="1" :max="horizon" step="1"
            /></label>
            <label class="field"
              ><span>Ramp-up bis 100 % (Monate)</span>
              <input v-model.number="metric.rampMonths" type="number" min="1" :max="horizon" step="1"
            /></label>
            <label class="field"
              ><span>Letzter Nutzenmonat (optional)</span>
              <input
                :value="metric.endMonth ?? ''"
                @input="setOptionalEndMonth(metric, $event)"
                type="number"
                min="1"
                :max="horizon"
                placeholder="Bis zum Ende"
            /></label>
          </div>
        </details>
        <p class="software-muted">
          Datenstatus: {{ evidenceLabel(metric.evidence) }}.
          {{ metric.treatment === 'capacity' ? 'Zeitgewinn ist nicht automatisch Geldersparnis.' : '' }}
          {{ metric.treatment === 'risk' ? 'Risiko bleibt außerhalb der konservativen Basis.' : '' }}
        </p>
      </article>
    </section>

    <section class="quick-panel software-block" aria-labelledby="software-result-heading">
      <div class="software-heading">
        <div>
          <p class="eyebrow">3 · Berechnung und Ergebnis</p>
          <h2 id="software-result-heading">Wann rechnet sich das Projekt?</h2>
        </div>
        <label class="field"
          ><span>Betrachtungshorizont</span>
          <select v-model.number="horizon">
            <option :value="36">36 Monate</option>
            <option :value="60">60 Monate</option>
          </select>
        </label>
      </div>

      <div v-if="!result.success" role="alert" class="software-problems">
        <strong>Modell noch nicht rechenfähig. Bitte korrigieren:</strong>
        <ul>
          <li v-for="issue in result.issues" :key="issue">{{ issue }}</li>
        </ul>
      </div>
      <p v-else-if="costs.length === 0 && metrics.length === 0" class="software-empty" data-testid="project-empty">
        Sobald Kosten und Nutzen vorliegen, erscheint hier der zeitliche Verlauf. Bis dahin wird keine wirtschaftliche
        Aussage erzeugt.
      </p>
      <template v-else>
        <div class="software-kpis">
          <div>
            <span>Break-even (bis zum Ende anhaltend)</span>
            <strong data-testid="sustained-payback">{{
              plan?.sustainedBreakEvenMonth === null ? 'Nicht erreicht' : 'Monat ' + plan?.sustainedBreakEvenMonth
            }}</strong>
          </div>
          <div>
            <span>Gesamte neue Kosten im Betrachtungszeitraum</span>
            <strong>{{ formatEuro(businessCase?.totalCostEur ?? 0) }}</strong>
          </div>
          <div>
            <span>Kumulierter wirtschaftlicher Saldo</span>
            <strong data-testid="cumulative-balance">{{ formatEuro(plan?.cumulativeEur ?? 0) }}</strong>
          </div>
          <div>
            <span>ROI über {{ horizon }} Monate (undiskontiert)</span>
            <strong data-testid="roi-percent">{{
              businessCase?.roiPercent === null
                ? 'Nicht definiert'
                : (businessCase?.roiPercent ?? 0).toLocaleString('de-DE', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  }) + ' %'
            }}</strong>
          </div>
          <div>
            <span>Einbezogene Kunden-Metrics</span><strong>{{ plan?.countedMetrics.length ?? 0 }}</strong>
          </div>
        </div>
        <p class="software-muted">
          Wirtschaftliche Modellrechnung zum bisherigen Zustand. „Anhaltend“ gilt bis zum Ende des gewählten Zeitraums.
          Jahreskosten werden auf zwölf Monate verteilt, nicht als tatsächliche Zahlung abgebildet.
        </p>

        <section class="scenario-section" aria-labelledby="scenario-title" data-testid="scenario-section">
          <div class="scenario-section-heading">
            <div>
              <h3 id="scenario-title">Wie belastbar ist die Wirtschaftlichkeit?</h3>
              <p class="software-muted">Drei Annahmen-Varianten auf derselben Rechnung. Wählen Sie einen Fall, um seinen Verlauf in der Grafik zu sehen.</p>
            </div>
          </div>
          <div v-if="!scenarioRows" role="alert" class="software-problems" data-testid="scenario-invalid">
            Szenariowerte prüfen: Nutzen und Einmalkosten zwischen −100 % und +200 %, Verzögerung zwischen 0 und {{ horizon }} Monaten.
          </div>
          <template v-else>
            <div class="scenario-compare" role="group" aria-label="Szenario in der Verlaufsgrafik auswählen">
              <button
                v-for="row in scenarioRows"
                :key="row.id"
                type="button"
                class="scenario-choice"
                :class="{ 'scenario-choice-active': selectedScenario === row.id, 'scenario-choice-loss': row.summary.netValueEur < 0 }"
                :aria-pressed="selectedScenario === row.id"
                :data-testid="'scenario-option-' + row.id"
                @click="selectedScenario = row.id"
              >
                <span class="scenario-name">{{ row.label }}</span>
                <span class="scenario-main">{{ row.summary.sustainedBreakEvenMonth === null ? 'Keine Amortisation' : 'Amortisation: Monat ' + row.summary.sustainedBreakEvenMonth }}</span>
                <span class="scenario-end">Endsaldo: <strong>{{ formatEuro(row.summary.netValueEur) }}</strong></span>
                <span class="scenario-delta">Zum Basis-Endsaldo: {{ signedEuro(row.deltaBalanceEur) }}</span>
              </button>
            </div>
            <p class="software-muted scenario-selected" data-testid="scenario-selected">
              Verlauf: <strong>{{ activeScenario?.label }}</strong>.
              {{ activeScenario ? describeScenarioAssumptions(activeScenario.assumptions) : '' }}.
              Vergleich nach {{ horizon }} Monaten. Unbestätigte Kundennutzen bleiben Annahmen.
            </p>
            <details class="software-more scenario-parameters">
              <summary>Szenarioannahmen einzeln ändern</summary>
              <div class="scenario-parameter-grid">
                <fieldset v-for="kind in (['conservative', 'optimistic'] as const)" :key="kind" class="scenario-fieldset">
                  <legend>{{ kind === 'conservative' ? 'Konservativ' : 'Optimistisch' }}</legend>
                  <label class="field">
                    <span>Änderung des angerechneten Kundennutzens (%)</span>
                    <input v-model.number="scenarioSettings[kind].benefitPercent" :data-testid="'scenario-benefit-' + kind" type="number" step="1" min="-100" max="200" />
                  </label>
                  <label class="field">
                    <span>Änderung einmaliger Projektkosten (%)</span>
                    <input v-model.number="scenarioSettings[kind].oneTimeCostPercent" :data-testid="'scenario-cost-' + kind" type="number" step="1" min="-100" max="200" />
                  </label>
                  <label class="field">
                    <span>Verzögerung des Kundennutzens (Monate)</span>
                    <input v-model.number="scenarioSettings[kind].benefitDelayMonths" :data-testid="'scenario-delay-' + kind" type="number" step="1" min="0" :max="horizon" />
                  </label>
                </fieldset>
              </div>
            </details>
            <div class="scenario-detail" data-testid="scenario-details" v-if="activeScenario">
              <span>Neue Gesamtkosten: <strong>{{ formatEuro(activeScenario.summary.totalCostEur) }}</strong></span>
              <span>Angerechneter Nutzen: <strong>{{ formatEuro(activeScenario.summary.benefitEur) }}</strong></span>
              <span>Tiefster Saldo: <strong>{{ formatEuro(activeScenario.summary.lowestBalanceEur) }} (M{{ activeScenario.summary.lowestMonth }})</strong></span>
              <span>ROI im Zeitraum: <strong>{{ roiLabel(activeScenario.summary.roiPercent) }}</strong></span>
            </div>
          </template>
          <p class="software-muted">
            Die Prozentänderung betrifft nur ausdrücklich monetarisierte Kundenwirkungen; wegfallende Altsystemkosten bleiben beim hinterlegten Termin und Betrag.
            Einmalige Kosten ändern sich, laufende Lizenz- und Betriebskosten nicht. Eine Verzögerung verschiebt Nutzenbeginn, Ramp-up und ggf. Nutzenende,
            nicht Verträge oder Projektlaufzeit. Kein Cashflow und keine Liquiditätsprognose.
          </p>
        </section>
        <figure class="software-figure">
          <SoftwareBalanceChart
            ref="chartRef"
            :months="activePlan!.months"
            :horizon="horizon"
            :break-even="activePlan!.sustainedBreakEvenMonth"
          />
          <figcaption>
            Unterhalb der Nulllinie übersteigen die neuen Kosten noch die angesetzten Vorteile. Oberhalb ist der
            kumulierte Saldo positiv. Es handelt sich um eine Modellrechnung, nicht um eine Liquiditätsplanung.
            {{ activeScenario?.summary.unverified ? activeScenario.summary.unverified + ' Nutzenposition(en) sind noch unbestätigt.' : '' }}
          </figcaption>
        </figure>
        <div class="software-actions">
          <button class="button button-secondary button-with-icon" type="button" @click="exportSvg">
            <ArrowDownToLine :size="16" aria-hidden="true" /> SVG exportieren
          </button>
          <button class="button button-secondary button-with-icon" type="button" @click="exportPng">
            <ArrowDownToLine :size="16" aria-hidden="true" /> PNG exportieren
          </button>
        </div>
        <p role="status">{{ exportStatus }}</p>
        <p class="software-table-hint">Monatswerte · auf schmalen Bildschirmen seitlich scrollen.</p>
        <div class="software-table-wrap" tabindex="0" role="region" aria-label="Monatswerte, horizontal scrollbar">
          <table class="software-table">
            <caption>
              Barrierefreie Monatsübersicht für {{ activeScenario?.label ?? 'Basis' }}, Werte gerundet auf EUR
            </caption>
            <thead>
              <tr>
                <th scope="col">Projektmonat</th>
                <th scope="col">Projektkosten</th>
                <th scope="col">Nutzen</th>
                <th scope="col">Kumuliert</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="month in checkpoints" :key="month.month">
                <th scope="row">{{ month.month }}</th>
                <td>{{ formatEuro(month.newCostEur) }}</td>
                <td>{{ formatEuro(month.totalBenefitEur) }}</td>
                <td>{{ formatEuro(month.cumulativeEur) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="software-insight">
          <strong>Transparenz der Annahmen</strong>
          <p>
            {{ plan?.unresolvedAssumptions ?? 0 }} angerechnete Metrics sind nicht als kundenseitig geprüft
            gekennzeichnet. {{ plan?.nonMonetized.length ?? 0 }} weitere Metrics stehen außerhalb der monetären
            Basisrechnung.
          </p>
          <ul v-if="plan?.nonMonetized.length">
            <li v-for="metric in plan.nonMonetized" :key="metric.id">{{ metric.name }}: {{ metric.reason }}</li>
          </ul>
        </div>
        <section aria-labelledby="business-case-report-heading" class="software-report">
          <div class="software-report-head">
            <div>
              <p class="eyebrow">4 · Kunden- und Finance-Bericht</p>
              <h3 id="business-case-report-heading">Zwei Berichte, eine Berechnungsgrundlage</h3>
              <p class="software-muted">
                Kompakter Kundenbericht mit Entscheidungsbotschaft oder vollständiger Finance-Anhang mit Monatswerten.
                Beide entstehen lokal im Browser. Kunde, Projekt und Verfasser sind Pflichtangaben; der Kundenbericht
                benötigt zusätzlich Ausgangssituation und Ziel.
              </p>
            </div>
          </div>
          <div class="software-fields software-report-fields">
            <label class="field"
              ><span>Kunde / Unternehmen</span>
              <input v-model="reportCustomer" type="text" maxlength="120" placeholder="z. B. Muster GmbH" />
            </label>
            <label class="field"
              ><span>Projektbezeichnung</span>
              <input v-model="reportProject" type="text" maxlength="120" />
            </label>
            <label class="field"
              ><span>Erstellt von</span>
              <input v-model="reportAuthor" type="text" maxlength="120" />
            </label>
          </div>
          <details class="software-more software-report-context">
            <summary>Ausgangslage und Zielbild (Pflicht für den Kundenbericht)</summary>
            <div class="software-report-story">
              <label class="field"
                ><span>Ausgangslage / Business Pain</span>
                <textarea
                  v-model="reportPain"
                  rows="3"
                  maxlength="240"
                  placeholder="Was kostet oder blockiert den Kunden heute?"
                />
              </label>
              <label class="field"
                ><span>Erwartetes Zielbild</span>
                <textarea
                  v-model="reportGoal"
                  rows="3"
                  maxlength="240"
                  placeholder="Welche Veränderung wird mit der Software verfolgt?"
                />
              </label>
            </div>
          </details>
          <div class="software-report-actions">
            <button type="button" class="button button-primary button-with-icon" @click="downloadReport('customer')">
              <ArrowDownToLine :size="16" aria-hidden="true" /> Kundenbericht (PDF) herunterladen
            </button>
            <button type="button" class="button button-with-icon" @click="downloadReport('finance')">
              <ArrowDownToLine :size="16" aria-hidden="true" /> Finance-Anhang (PDF) herunterladen
            </button>
            <span class="software-muted"
              >Kundenbericht: 3 Seiten mit Ergebnissen und Freigabefragen · Finance: Nachweise und Monatswerte</span
            >
          </div>
          <p role="status">{{ reportStatus }}</p>
        </section>
        <section aria-label="Kundenfähige Zusammenfassung" class="software-summary">
          <div class="software-heading">
            <h3>Management Summary · zum Weitergeben</h3>
            <button type="button" class="button button-primary button-with-icon" @click="copySummary">
              <ClipboardCopy :size="16" aria-hidden="true" /> Zusammenfassung kopieren
            </button>
          </div>
          <p>{{ summary }}</p>
          <p role="status">{{ copyStatus }}</p>
        </section>
      </template>
    </section>
  </div>
</template>

<style scoped>
.scenario-section { margin-top: 1.35rem; padding: 1.1rem; border: 1px solid #cbd5e1; border-radius: 12px; background: #f8fafc; }
.scenario-section h3 { margin: 0 0 .35rem; font-size: 1.15rem; }
.scenario-compare { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .65rem; margin: .9rem 0; }
.scenario-choice { min-width: 0; text-align: left; border: 1.5px solid #cbd5e1; background: #fff; border-radius: 10px; padding: .85rem; color: #17253d; display: flex; flex-direction: column; gap: .3rem; cursor: pointer; font: inherit; }
.scenario-choice:focus-visible { outline: 3px solid #2563eb; outline-offset: 2px; }
.scenario-choice-active { border-color: #1d4ed8; box-shadow: inset 0 0 0 1px #1d4ed8; }
.scenario-choice-loss .scenario-end strong { color: #9f2424; }
.scenario-name { font-weight: 700; font-size: .88rem; }
.scenario-main { font-size: 1rem; font-weight: 750; }
.scenario-end { font-size: .94rem; overflow-wrap: anywhere; }
.scenario-delta { font-size: .78rem; color: #475569; overflow-wrap: anywhere; }
.scenario-selected { margin-top: .65rem; }
.scenario-parameters { margin: .85rem 0; }
.scenario-parameter-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .9rem; margin: .8rem 0; }
.scenario-fieldset { min-width: 0; padding: .85rem; border: 1px solid #cbd5e1; border-radius: 9px; display: grid; gap: .6rem; }
.scenario-fieldset legend { padding: 0 .35rem; font-weight: 700; }
.scenario-fieldset input { width: 100%; min-width: 0; }
.scenario-detail { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: .6rem 1rem; margin: .8rem 0; font-size: .87rem; }
.scenario-detail span { overflow-wrap: anywhere; }
@media (max-width: 760px) { .scenario-compare, .scenario-parameter-grid, .scenario-detail { grid-template-columns: 1fr; } .scenario-section { padding: .85rem; } }

.software-panel {
  display: grid;
  gap: var(--space-6);
}
.software-block {
  display: grid;
  gap: var(--space-4);
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
  box-shadow: var(--shadow-panel);
  padding: var(--space-5);
}
.software-heading,
.software-entry-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
}
.software-heading h2,
.software-heading h3 {
  margin: 0;
}
.software-muted {
  color: var(--color-text-muted);
  font-size: 0.87rem;
  line-height: 1.6;
  margin: 0;
}
.software-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.software-actions .button {
  gap: var(--space-2);
}
.software-entry {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  padding: var(--space-4);
  display: grid;
  gap: var(--space-4);
  background: var(--color-bg);
}
.software-remove {
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.84rem;
}
.software-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}
.software-fields .field {
  min-width: 0;
}
.software-fields .field > span {
  font-size: 0.85rem;
}
.software-fields textarea {
  width: 100%;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-control);
  padding: var(--space-2);
  resize: vertical;
  background: var(--color-surface);
}
.software-fields select,
.software-fields input {
  width: 100%;
  min-width: 0;
}
.software-full {
  grid-column: 1/-1;
}
.software-metric-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}
.software-check {
  display: flex;
  align-items: start;
  gap: var(--space-2);
  max-width: 410px;
}
.software-check input {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}
.software-metric-value {
  display: grid;
  text-align: right;
}
.software-metric-value span {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}
.software-empty {
  padding: var(--space-4);
  background: var(--color-surface-muted);
  border-radius: var(--radius-control);
  color: var(--color-text-muted);
}
.software-problems {
  border: 1px solid var(--color-risk-border);
  background: var(--color-risk-soft);
  color: var(--color-risk-text);
  border-radius: var(--radius-control);
  padding: var(--space-4);
  overflow-wrap: anywhere;
}
.software-problems ul {
  margin-bottom: 0;
}
.software-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-3);
}
.software-kpis > div {
  background: var(--color-surface-muted);
  border-radius: var(--radius-control);
  padding: var(--space-3);
  display: grid;
  align-content: start;
  gap: var(--space-2);
  min-width: 0;
}
.software-kpis span {
  color: var(--color-text-muted);
  font-size: 0.83rem;
  line-height: 1.4;
}
.software-kpis strong {
  font-size: 1.15rem;
  overflow-wrap: anywhere;
}
.software-figure {
  margin: 0;
  min-width: 0;
}
.software-figure svg {
  display: block;
  width: 100%;
  height: auto;
  max-height: 320px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}
.software-figure figcaption {
  font-size: 0.83rem;
  color: var(--color-text-muted);
  padding-top: var(--space-2);
}
.software-table-wrap {
  max-width: 100%;
  overflow-x: auto;
}
.software-table-hint {
  margin: 0;
  font-size: 0.83rem;
  color: var(--color-text-muted);
}
.software-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
  font-variant-numeric: tabular-nums;
}
.software-table caption {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
.software-table th,
.software-table td {
  padding: var(--space-2);
  text-align: right;
  border-bottom: 1px solid var(--color-border);
}
.software-table th:first-child {
  text-align: left;
}
.software-insight {
  border-left: 3px solid var(--color-accent);
  padding-left: var(--space-4);
}
.software-summary {
  padding: var(--space-4);
  background: var(--color-surface-muted);
  border-radius: var(--radius-control);
  overflow-wrap: anywhere;
}
.software-summary p {
  line-height: 1.7;
}
.software-summary h3 {
  font-size: 1rem;
}
@media (max-width: 850px) {
  .software-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .software-kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 560px) {
  .software-fields,
  .software-kpis {
    grid-template-columns: minmax(0, 1fr);
  }
  .software-actions .button,
  .software-summary .button {
    width: 100%;
  }
  .software-metric-value {
    text-align: left;
  }
  .software-entry {
    padding: var(--space-3);
  }
  .software-block {
    padding: var(--space-4);
  }
}

/* Payback UX: gleiche Feldhöhen und vertikale Bezugslinien statt wild versetzter Eingaben. */
.software-panel {
  gap: var(--space-5);
}
.software-block {
  gap: var(--space-4);
}
.software-heading {
  align-items: center;
}
.software-heading > div {
  min-width: 0;
  flex: 1 1 320px;
}
.software-heading .eyebrow {
  margin-bottom: var(--space-2);
}
.software-heading h2 {
  line-height: 1.3;
}
.software-cost-actions .button {
  flex: 1 1 auto;
  justify-content: center;
}
.software-start-example {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: 0.86rem;
}
.software-example-link {
  padding: 0;
  background: transparent;
  border: 0;
  color: var(--color-accent-strong);
  text-decoration: underline;
  text-underline-offset: 3px;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}
.software-entry {
  background: var(--color-surface);
}
.software-entry-heading {
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-divider);
  align-items: center;
}
.software-entry-heading strong {
  min-width: 0;
  overflow-wrap: anywhere;
  line-height: 1.35;
}
.software-remove {
  cursor: pointer;
  min-height: 36px;
  border-radius: var(--radius-control);
  padding: 0 var(--space-2);
}
.software-remove:hover {
  background: var(--color-surface-muted);
}
.software-fields {
  align-items: start;
  column-gap: var(--space-4);
  row-gap: var(--space-4);
}
.software-fields .field,
.software-evidence .field {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  min-width: 0;
}
.software-fields .field > span {
  display: block;
  min-height: 2.5em;
  line-height: 1.25;
  font-weight: 650;
}
.software-fields input,
.software-fields select,
.software-evidence textarea {
  box-sizing: border-box;
  min-height: 44px;
  width: 100%;
  font-size: 0.95rem;
  border-radius: var(--radius-control);
}
.software-fields input:focus-visible,
.software-fields select:focus-visible,
.software-evidence textarea:focus-visible,
.software-remove:focus-visible,
.software-example-link:focus-visible,
.software-more summary:focus-visible,
.software-check input:focus-visible,
.software-table-wrap:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}
.software-metric-footer {
  background: var(--color-surface-muted);
  border-radius: var(--radius-control);
  padding: var(--space-3) var(--space-4);
  align-items: center;
}
.software-metric-value strong {
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.software-evidence {
  display: grid;
  gap: var(--space-2);
}
.software-evidence textarea {
  padding: var(--space-3);
}
.software-more {
  border-top: 1px solid var(--color-divider);
  padding-top: var(--space-3);
}
.software-more summary {
  list-style: none;
  cursor: pointer;
  font-size: 0.87rem;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-2);
  font-weight: 650;
  border-radius: var(--radius-control);
  padding: var(--space-2);
}
.software-more summary::-webkit-details-marker {
  display: none;
}
.software-more-label {
  text-align: left;
}
.software-more-hint {
  text-align: right;
}
.software-more summary::before {
  content: '▸';
  margin: 0;
}
.software-more[open] summary::before {
  content: '▾';
}
.software-more-hint {
  color: var(--color-text-muted);
  font-weight: 400;
  font-size: 0.8rem;
}
.software-detail-fields {
  margin-top: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface-muted);
  border-radius: var(--radius-control);
}
.software-detail-fields .field > span {
  min-height: 2.5em;
}
.software-kpis {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
.software-kpis > div:first-child {
  grid-column: 1 / -1;
  border: 1px solid var(--color-border);
  padding: var(--space-4);
  background: var(--color-surface);
}
.software-kpis > div:first-child strong {
  font-size: clamp(1.7rem, 3.2vw, 2.3rem);
  line-height: 1.2;
}
.software-table-wrap {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
}
.software-table th,
.software-table td {
  padding: var(--space-3);
}
.software-table thead {
  background: var(--color-surface-muted);
}
.software-table-hint {
  font-size: 0.83rem;
}
.software-summary .software-heading {
  align-items: center;
}
@media (max-width: 850px) {
  .software-fields .field > span {
    min-height: 2.5em;
  }
}
@media (max-width: 560px) {
  .software-heading {
    align-items: flex-start;
  }
  .software-entry-heading {
    align-items: flex-start;
  }
  .software-fields .field > span,
  .software-detail-fields .field > span {
    min-height: 0;
  }
  .software-cost-actions .button {
    flex-basis: 100%;
  }
  .software-kpis {
    grid-template-columns: minmax(0, 1fr);
  }
  .software-kpis > div:first-child {
    grid-column: 1;
  }
  .software-metric-footer {
    padding: var(--space-3);
    align-items: stretch;
  }
  .software-metric-value {
    text-align: left;
  }
  .software-entry-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
  }
  .software-entry-heading .software-remove {
    white-space: nowrap;
  }
  .software-more summary {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .software-more-hint {
    grid-column: 2;
    width: auto;
    margin: 0;
    text-align: left;
  }
  .software-table-hint {
    line-height: 1.4;
  }
}
@media (prefers-reduced-motion: reduce) {
  .software-panel * {
    transition-duration: 0.01ms !important;
  }
}

.software-report {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
}
.software-report-head h3 {
  margin: var(--space-1) 0 var(--space-2);
}
.software-report-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.software-report-actions .button {
  gap: var(--space-2);
  min-height: 44px;
}
@media (max-width: 560px) {
  .software-report {
    padding: var(--space-4);
  }
  .software-report-actions .button {
    width: 100%;
  }
}

.software-report-story {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-3);
}
.software-report-story .field {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
  font-size: 0.87rem;
  font-weight: 650;
}
.software-report-story textarea {
  width: 100%;
  min-height: 88px;
  resize: vertical;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-control);
  padding: var(--space-3);
}
@media (max-width: 650px) {
  .software-report-story {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
