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

const costs = ref<SoftwareCost[]>([])
const metrics = ref<CustomerMetric[]>([])
const horizon = ref<36 | 60>(36)
const copyStatus = ref('')
const exportStatus = ref('')
const svgRef = ref<SVGSVGElement | null>(null)
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
  const example = exampleSoftwareProject()
  costs.value = example.costs
  metrics.value = example.metrics
  horizon.value = example.horizonMonths
  copyStatus.value = ''
  exportStatus.value = ''
}
function clear() {
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

const chartLeft = 90
const chartWidth = 766
const yBounds = computed(() => {
  if (!plan.value) return { low: -1, high: 1 }
  const values = plan.value.months.map((m) => m.cumulativeEur)
  const low = Math.min(0, ...values)
  const high = Math.max(0, ...values)
  if (high - low < 1) return { low: low - 1, high: high + 1 }
  const padding = (high - low) * 0.09
  return { low: low - padding, high: high + padding }
})
const xFor = (month: number) => chartLeft + (month / horizon.value) * chartWidth
const yFor = (value: number) => 220 - ((value - yBounds.value.low) / (yBounds.value.high - yBounds.value.low)) * 180
const points = computed(() =>
  plan.value
    ? plan.value.months.map((m) => xFor(m.month).toFixed(2) + ',' + yFor(m.cumulativeEur).toFixed(2)).join(' ')
    : '',
)
const zeroY = computed(() => yFor(0))
const checkpoints = computed(() =>
  plan.value
    ? [0, 6, 12, 18, 24, 36, 60].filter((m) => m <= horizon.value).map((month) => plan.value!.months[month]!)
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
  const svg = svgRef.value
  if (!svg) throw new Error('Grafik nicht vorhanden')
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', '1200')
  clone.setAttribute('height', '440')
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
      canvas.height = 440
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
        <button type="button" class="software-example-link" @click="loadExample">
          Fiktives Softwareprojekt einsetzen
        </button>
      </div>
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
            ><span>Berechnungsbaustein</span>
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
            ><span>Wie wird die wirtschaftliche Wirkung realisiert? / Datenquelle</span>
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
            <span class="software-more-label">Zeitraum &amp; Daten prüfen</span>
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
            <span>Erste Nullpunktüberschreitung</span>
            <strong>{{
              plan?.firstBreakEvenMonth === null ? 'Nicht erreicht' : 'Monat ' + plan?.firstBreakEvenMonth
            }}</strong>
          </div>
          <div>
            <span>Kumulierter wirtschaftlicher Saldo</span>
            <strong data-testid="cumulative-balance">{{ formatEuro(plan?.cumulativeEur ?? 0) }}</strong>
          </div>
          <div>
            <span>Einbezogene Kunden-Metrics</span><strong>{{ plan?.countedMetrics.length ?? 0 }}</strong>
          </div>
        </div>
        <p class="software-muted">
          Wirtschaftliche Modellrechnung zum bisherigen Zustand. „Anhaltend“ gilt bis zum Ende des gewählten Zeitraums.
          Jahreskosten werden auf zwölf Monate verteilt, nicht als tatsächliche Zahlung abgebildet.
        </p>
        <figure class="software-figure">
          <svg ref="svgRef" viewBox="0 0 900 340" role="img" aria-labelledby="software-chart-title software-chart-desc">
            <title id="software-chart-title">Kumulierter wirtschaftlicher Saldo je Projektmonat</title>
            <desc id="software-chart-desc">
              Linie des kumulierten EUR-Saldos von Projektmonat 0 bis {{ horizon }}. Die nachfolgende Tabelle enthält
              die zugänglichen Zahlenwerte.
            </desc>
            <rect x="0" y="0" width="900" height="340" fill="#ffffff" />
            <text x="90" y="25" font-size="15" font-weight="700" fill="#172033">
              Softwareprojekt · Kumulierter Saldo (EUR)
            </text>
            <line
              :x1="chartLeft"
              :x2="chartLeft + chartWidth"
              :y1="zeroY"
              :y2="zeroY"
              stroke="#9aa8b8"
              stroke-width="1.5"
              stroke-dasharray="6 5"
            />
            <line :x1="chartLeft" :x2="chartLeft" y1="40" y2="220" stroke="#9aa8b8" />
            <polyline
              v-if="points"
              :points="points"
              fill="none"
              stroke="#2563eb"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <text x="86" :y="Math.max(49, zeroY - 7)" text-anchor="end" font-size="13" fill="#4b5563">0 €</text>
            <text
              v-for="month in [0, 12, 24, 36, 48, 60].filter((m) => m <= horizon)"
              :key="month"
              :x="xFor(month)"
              y="249"
              text-anchor="middle"
              font-size="13"
              fill="#374151"
            >
              {{ month }}
            </text>
            <text x="450" y="274" text-anchor="middle" font-size="13" fill="#374151">Projektmonat</text>
            <text x="90" y="302" font-size="14" font-weight="700" fill="#172033">
              {{
                plan?.sustainedBreakEvenMonth === null
                  ? 'Amortisation bis Monat ' + horizon + ' nicht erreicht'
                  : 'Amortisation bis Betrachtungsende: Projektmonat ' + plan?.sustainedBreakEvenMonth
              }}
            </text>
            <text x="90" y="326" font-size="13" fill="#374151">
              {{ 'Kumulierter wirtschaftlicher Saldo: ' + formatEuro(plan?.cumulativeEur ?? 0) + ' · Schätzung' }}
            </text>
          </svg>
          <figcaption>
            Der Verlauf basiert ausschließlich auf den sichtbaren Kosten und angerechneten Kunden-Metrics.
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
              Barrierefreie Monatsübersicht, Werte gerundet auf EUR
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
  text-align: left;
  padding-bottom: var(--space-3);
  color: var(--color-text-muted);
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
  list-style-position: inside;
  cursor: pointer;
  font-size: 0.87rem;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
  font-weight: 650;
  border-radius: var(--radius-control);
  padding: var(--space-2);
}
.software-more summary::before {
  content: '▸';
  margin-right: var(--space-2);
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
  .software-more-hint {
    width: 100%;
    margin-left: 20px;
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
</style>
