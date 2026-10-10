<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, Download, RotateCcw } from '@lucide/vue'
import {
  calculateCostOfDelay,
  costOfDelayDemos,
  emptyCostOfDelayInput,
  type CostOfDelayInput,
  type DelayScenario,
} from '../domain/costOfDelay'
import { consumeCostOfDelayHandoff } from '../domain/costOfDelayHandoff'
import { queueDelayToBridge } from '../domain/valueBridgeHandoff'
import { useRouter } from 'vue-router'
import { buildCostOfDelayPdf } from '../report/costOfDelayPdf'
import '../styles/costOfDelay.css'

const router = useRouter()
const draft = ref<CostOfDelayInput>(emptyCostOfDelayInput())
const step = ref<1 | 2 | 3>(1)
const chosenDelay = ref(6)
const benefitEntryPeriod = ref<'annual' | 'monthly'>('annual')
const customDelay = ref<number | null>(null)
const example = ref('')
const notice = ref('')
const result = computed(() =>
  calculateCostOfDelay(draft.value, [3, 6, 12, ...(customDelay.value === null ? [] : [customDelay.value])]),
)
const scenarios = computed(() => (result.value.success ? result.value.scenarios : []))
const selected = computed<DelayScenario | null>(
  () => scenarios.value.find((s) => s.delayMonths === chosenDelay.value) ?? scenarios.value[0] ?? null,
)
const hasModel = computed(() => result.value.success && result.value.scenarios.length > 0)
const issues = computed(() => (result.value.success ? [] : result.value.issues))
const questions = computed(() => result.value.questions)
const money = (value: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value)

type AmountKey = 'annualBenefitEur' | 'legacyMonthlyEur' | 'projectOnceEur' | 'extraCostPerMonthEur'
function setAmount(key: AmountKey, event: Event) {
  const value = (event.target as HTMLInputElement).value
  const factor =
    key === 'annualBenefitEur' && draft.value.benefitKind === 'recurring' && benefitEntryPeriod.value === 'monthly'
      ? 12
      : 1
  draft.value[key] = value.trim() === '' ? null : Number(value) * factor
}
function setEndMonth(event: Event) {
  const value = (event.target as HTMLInputElement).value
  draft.value.benefitEndMonth = value.trim() === '' ? null : Number(value)
}
function setCustomDelay(event: Event) {
  const value = (event.target as HTMLInputElement).value
  customDelay.value = value.trim() === '' ? null : Number(value)
  if (customDelay.value !== null) chosenDelay.value = customDelay.value
}
function loadExample(key: string) {
  if (!costOfDelayDemos[key]) return
  draft.value = { ...costOfDelayDemos[key] }
  example.value = key
  step.value = 1
  notice.value = 'Fiktives Schulungsbeispiel geladen: keine echten Kundenwerte oder überprüften Referenzen.'
}
function reset() {
  draft.value = emptyCostOfDelayInput()
  customDelay.value = null
  chosenDelay.value = 6
  benefitEntryPeriod.value = 'annual'
  step.value = 1
  example.value = ''
  notice.value = ''
}
const chartMaximum = computed(() => {
  if (!selected.value) return 0
  return Math.max(1, ...selected.value.months.flatMap((row) => [row.baseCumulativeEur, row.delayedCumulativeEur]))
})
const compactEuro = (value: number): string =>
  new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 1 }).format(value) + ' €'
function chartPoints(field: 'baseCumulativeEur' | 'delayedCumulativeEur'): string {
  if (!selected.value) return ''
  const arr = selected.value.months
  const max = chartMaximum.value
  return arr
    .map((row) => {
      const x = 36 + (row.month / draft.value.horizonMonths) * 626
      const y = 196 - (row[field] / max) * 155
      return x.toFixed(2) + ',' + y.toFixed(2)
    })
    .join(' ')
}
function download(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
async function exportPdf() {
  if (!selected.value || !result.value.success) return
  try {
    download(await buildCostOfDelayPdf(draft.value, result.value, selected.value), 'cost-of-delay-steckbrief.pdf')
    notice.value = 'PDF mit aktuellen Modellannahmen erstellt.'
  } catch {
    notice.value = 'Der PDF-Export ist fehlgeschlagen.'
  }
}
onMounted(() => {
  try {
    const imported = consumeCostOfDelayHandoff(window.sessionStorage)
    if (imported) {
      draft.value = imported
      notice.value =
        'Metric Builder: wirtschaftlicher Jahreswert übernommen. Evidenzstatus unverändert; Kosten noch offen.'
    }
  } catch {
    notice.value = 'Die lokale Metric-Übergabe war nicht verfügbar.'
  }
})
async function transferToBridge(): Promise<void> {
  try {
    queueDelayToBridge(draft.value, window.sessionStorage)
    await router.push('/tools/value-bridge')
  } catch {
    notice.value = 'Value-Bridge-Übergabe nicht möglich.'
  }
}
import ToolStepNavigation from '../components/ToolStepNavigation.vue'
</script>

<template>
  <div class="site-shell cod-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="Zurück zur MEDDPICC Toolbox">
          <span class="brand-mark">M</span>
          <span class="brand-copy"><strong>MEDDPICC Toolbox</strong><span>Value &amp; Metrics</span></span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/">
          <ArrowLeft :size="17" aria-hidden="true" /> Alle Microtools
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="container cod-main">
      <section class="cod-intro">
        <div class="tool-intro-meta">
          <span class="tool-kind tool-kind--customer">Kundenfähiger Steckbrief</span>
          <span>Value &amp; Metrics · Szenariovergleich</span>
        </div>
        <h1>Was kostet es wirtschaftlich, später zu starten?</h1>
        <p class="intro-text">
          Vergleiche Nutzenverläufe über denselben Kalenderzeitraum. Die Differenz ist nicht automatisch ein endgültiger
          Vermögensschaden. Zeitgewinn wird nur mit nachgewiesener finanzieller Wirkung bewertet.
        </p>
        <div class="cod-examples" aria-label="Fiktive Beispiele">
          <span>Beispiele (fiktiv):</span>
          <button type="button" class="button button-secondary" @click="loadExample('service')">CRM / Service</button>
          <button type="button" class="button button-secondary" @click="loadExample('sales')">Vertrieb</button>
          <button type="button" class="button button-secondary" @click="loadExample('capacity')">Kapazität</button>
        </div>
        <p v-if="notice" role="status" class="cod-notice">{{ notice }}</p>
      </section>

      <ToolStepNavigation
        v-model="step"
        label="Cost of Delay berechnen"
        :steps="['1 · Ausgangspunkt', '2 · Verzögerung', '3 · Konsequenz']"
      />

      <section v-if="step === 1" class="cod-panel" aria-labelledby="cod-input-title">
        <p class="eyebrow">Schritt 1 · Kundenwirkung</p>
        <h2 id="cod-input-title">Welche Verbesserung wäre wann wirksam?</h2>
        <p class="cod-muted">Nur wirtschaftlich tatsächlich realisierbare Effekte ergeben einen EUR-Vergleich.</p>
        <div class="cod-fields">
          <label class="cod-field"
            ><span>Bezeichnung der Metric</span>
            <input v-model="draft.title" maxlength="140" placeholder="z. B. Vermiedene externe Servicekosten" />
          </label>
          <label class="cod-field"
            ><span>Aktuelles Kundenproblem und Konsequenz</span>
            <textarea v-model="draft.problem" rows="2" maxlength="350" placeholder="Was besteht heute fort?" />
          </label>
          <label class="cod-field"
            ><span>Nachvollziehbare Verbesserung</span>
            <textarea v-model="draft.outcome" rows="2" maxlength="350" placeholder="Was ändert sich konkret?" />
          </label>
          <label class="cod-field"
            ><span>Wirtschaftliche Einordnung</span>
            <select v-model="draft.financialTreatment">
              <option value="unconfirmed">Finanzielle Wirkung noch ungeklärt</option>
              <option value="capacity">Nur Kapazitätsgewinn, keine belegte EUR-Ersparnis</option>
              <option value="realized">Tatsächlich wirtschaftlich realisierbarer Nutzen (Modellannahme)</option>
            </select>
          </label>
          <template v-if="draft.financialTreatment === 'realized'">
            <label class="cod-field"
              ><span>{{
                draft.benefitKind === 'one-time'
                  ? 'Einmaliger Betrag in EUR'
                  : 'Realisierbarer Nutzen in EUR/' + (benefitEntryPeriod === 'monthly' ? 'Monat' : 'Jahr')
              }}</span>
              <input
                :value="
                  draft.annualBenefitEur === null
                    ? ''
                    : draft.benefitKind === 'recurring' && benefitEntryPeriod === 'monthly'
                      ? draft.annualBenefitEur / 12
                      : draft.annualBenefitEur
                "
                type="number"
                inputmode="decimal"
                min="0"
                max="1000000000000"
                step="any"
                placeholder="Noch offen"
                @input="setAmount('annualBenefitEur', $event)"
              />
            </label>
            <label v-if="draft.benefitKind === 'recurring'" class="cod-field">
              <span>Eingabezeitraum für realisierten Nutzen</span>
              <select v-model="benefitEntryPeriod">
                <option value="annual">EUR pro Jahr</option>
                <option value="monthly">EUR pro Monat (intern auf Jahreswert umgerechnet)</option>
              </select>
            </label>
            <label class="cod-field"
              ><span>Art der wirtschaftlichen Wirkung</span>
              <select v-model="draft.benefitKind">
                <option value="recurring">Wiederkehrend (Jahreswirkung)</option>
                <option value="one-time">Einmalig</option>
              </select>
            </label>
            <label class="cod-field"
              ><span>Wirkungsgruppe (Doppelzählungsschutz)</span>
              <input v-model="draft.effectGroup" maxlength="90" placeholder="z. B. service-extern" />
            </label>
          </template>
          <div class="cod-field-row">
            <label class="cod-field"
              ><span>Nutzenbeginn (Monat)</span>
              <input v-model.number="draft.benefitStartMonth" type="number" min="1" max="120" step="1" />
            </label>
            <label class="cod-field"
              ><span>Ramp-up (Monate)</span>
              <input
                v-model.number="draft.rampMonths"
                type="number"
                min="1"
                max="120"
                step="1"
                :disabled="draft.benefitKind === 'one-time'"
              />
            </label>
          </div>
          <label class="cod-field"
            ><span>Herkunft und Prüfstand der Annahmen</span>
            <select v-model="draft.evidence">
              <option value="hypothesis">Hypothese / Annahme</option>
              <option value="reference">Externe Referenz (M1)</option>
              <option value="customer-stated">Kundenaussage, nicht überprüft</option>
              <option value="customer-reviewed">Mit dem Kunden geprüft (Selbstangabe)</option>
            </select>
          </label>
          <label class="cod-field"
            ><span>Datenquelle und tatsächlicher Realisierungsmechanismus</span>
            <textarea
              v-model="draft.source"
              rows="3"
              maxlength="600"
              placeholder="Vertragsposition, Rechnung, Kundenaussage oder offene Annahme"
            />
          </label>
        </div>
      </section>

      <section v-if="step === 2" class="cod-panel" aria-labelledby="cod-delay-title">
        <p class="eyebrow">Schritt 2 · Zeitliche Alternativen</p>
        <h2 id="cod-delay-title">Was verschiebt sich wirklich?</h2>
        <p class="cod-muted">
          Basis und verzögertes Szenario betrachten dieselben Monate. Eine Projektverschiebung verschiebt Verträge und
          Zahlungen nicht automatisch.
        </p>
        <div class="cod-fields">
          <label class="cod-field"
            ><span>Gemeinsamer Betrachtungshorizont</span>
            <select v-model.number="draft.horizonMonths">
              <option :value="36">36 Monate ab Modellmonat 0</option>
              <option :value="60">60 Monate ab Modellmonat 0</option>
            </select>
          </label>
          <label class="cod-field"
            ><span>Eigene Verzögerung in Monaten (optional)</span>
            <input
              :value="customDelay ?? ''"
              type="number"
              min="0"
              max="120"
              step="1"
              placeholder="Standard: 0 / 3 / 6 / 12"
              @input="setCustomDelay"
            />
          </label>
          <details class="cod-details">
            <summary>Hat die Wirkung ein festes Ende?</summary>
            <div class="cod-fields">
              <label class="cod-field"
                ><span>Letzter Monat mit Nutzen (optional)</span>
                <input
                  :value="draft.benefitEndMonth ?? ''"
                  type="number"
                  min="1"
                  max="120"
                  step="1"
                  placeholder="Ohne festes Ende"
                  @input="setEndMonth"
                />
              </label>
              <label class="cod-field"
                ><span>Wie verändert sich der Endtermin?</span>
                <select v-model="draft.expiry">
                  <option value="follows-start">Wirkungsdauer folgt dem verschobenen Start</option>
                  <option value="fixed">Fester Endtermin, nicht nachholbare Zeiträume (Annahme)</option>
                </select>
              </label>
            </div>
          </details>
          <details class="cod-details">
            <summary>Altsystem, Projektkosten und Zusatzkosten berücksichtigen</summary>
            <p class="cod-muted">
              Für einen Nettovergleich müssen alle drei Kostenfelder explizit ausgefüllt sein. Trage 0 ein, wenn die
              jeweilige Position geprüft und tatsächlich null ist.
            </p>
            <div class="cod-fields">
              <label class="cod-field"
                ><span>Entfallender Altvertrag in EUR/Monat</span>
                <input
                  :value="draft.legacyMonthlyEur ?? ''"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Offen"
                  @input="setAmount('legacyMonthlyEur', $event)"
                />
              </label>
              <label class="cod-field"
                ><span>Abschaltung ohne Verzögerung (Monat)</span>
                <input v-model.number="draft.legacyStartMonth" type="number" min="1" max="120" step="1" />
              </label>
              <label class="cod-field"
                ><span>Wirkungsgruppe des Altvertrags</span>
                <input v-model="draft.legacyEffectGroup" placeholder="z. B. altlizenz" maxlength="90" />
              </label>
              <label class="cod-check"
                ><input v-model="draft.legacyMovesWithProject" type="checkbox" />
                <span>Die Abschaltung verschiebt sich mit dem Projekt.</span></label
              >
              <label class="cod-field"
                ><span>Einmalige Projektkosten (EUR)</span>
                <input
                  :value="draft.projectOnceEur ?? ''"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Offen"
                  @input="setAmount('projectOnceEur', $event)"
                />
              </label>
              <label class="cod-field"
                ><span>Projektkostentermin (Monat)</span>
                <input v-model.number="draft.projectCostMonth" type="number" min="0" max="120" step="1" />
              </label>
              <label class="cod-check"
                ><input v-model="draft.projectCostsMove" type="checkbox" />
                <span>Diese Projektkosten verschieben sich ebenfalls.</span></label
              >
              <label class="cod-field"
                ><span>Belegte Zusatzkosten je Verzögerungsmonat (EUR)</span>
                <input
                  :value="draft.extraCostPerMonthEur ?? ''"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Offen"
                  @input="setAmount('extraCostPerMonthEur', $event)"
                />
              </label>
              <label class="cod-field"
                ><span>Datenquelle der Zusatzkosten</span>
                <textarea
                  v-model="draft.extraCostSource"
                  rows="2"
                  maxlength="360"
                  placeholder="z. B. befristeter Dienstleistervertrag"
                />
              </label>
            </div>
          </details>
        </div>
      </section>

      <section v-if="step === 3" class="cod-panel cod-results" aria-labelledby="cod-results-title">
        <p class="eyebrow">Schritt 3 · Economic Buyer</p>
        <h2 id="cod-results-title">Wirtschaftliche Konsequenz verstehen</h2>
        <p class="cod-muted">
          Die Differenz zeigt ausschließlich das jeweilige Modellfenster, nicht automatisch einen endgültigen Schaden
          oder tatsächlichen Cashflow.
        </p>
        <div v-if="issues.length" class="cod-warning" role="alert">
          <strong>Eine belastbare Berechnung ist noch nicht möglich.</strong>
          <ul>
            <li v-for="issue in issues" :key="issue">{{ issue }}</li>
          </ul>
        </div>
        <div v-else-if="!hasModel" class="cod-warning">
          <strong>Noch kein EUR-Verzögerungsschaden ableitbar.</strong>
          <p>
            Kapazitätsgewinne oder ungeklärte finanzielle Effekte bleiben ohne Geldbetrag. Prüfe zuerst den
            wirtschaftlichen Realisierungsmechanismus.
          </p>
        </div>
        <template v-else-if="selected">
          <p v-if="result.success && result.unverified" class="cod-warning">
            Unbestätigte Szenarioannahme. Die Zahlen sind keine mit dem Kunden validierten M2-Metrics.
          </p>
          <div class="cod-scenarios" aria-label="Verzögerungsszenario wählen">
            <button
              v-for="scenario in scenarios"
              :key="scenario.delayMonths"
              type="button"
              class="cod-scenario"
              :class="{ 'cod-scenario--active': selected.delayMonths === scenario.delayMonths }"
              :aria-pressed="selected.delayMonths === scenario.delayMonths"
              @click="chosenDelay = scenario.delayMonths"
            >
              <span>{{
                scenario.delayMonths === 0 ? 'Ohne Verzögerung' : '+' + scenario.delayMonths + ' Monate'
              }}</span>
              <strong>{{ money(scenario.benefitDifferenceEur) }}</strong>
              <small>Differenz Kundennutzen</small>
            </button>
          </div>
          <div class="cod-kpis">
            <div>
              <span>Nutzen ohne Verschiebung</span><strong>{{ money(selected.baseBenefitEur) }}</strong>
            </div>
            <div>
              <span>Nutzen bei +{{ selected.delayMonths }} Monaten</span>
              <strong>{{ money(selected.delayedBenefitEur) }}</strong>
            </div>
            <div class="cod-kpi-emphasis">
              <span>Differenz im Horizont</span> <strong>{{ money(selected.benefitDifferenceEur) }}</strong>
            </div>
          </div>
          <section class="cod-chart" aria-labelledby="cod-chart-title">
            <h3 id="cod-chart-title">Kumulierter Kundennutzen im gleichen Zeitraum</h3>
            <div class="cod-legend">
              <span><i class="cod-legend-base"></i> Ohne Verschiebung</span>
              <span><i class="cod-legend-delay"></i> Mit Verschiebung</span>
            </div>
            <div class="cod-chart-viewport" tabindex="0" role="region" aria-label="Diagramm der kumulierten Nutzenverläufe, horizontal scrollbar">
            <svg
              viewBox="0 0 700 238"
              role="img"
              :aria-label="'Kumulierter Nutzen mit und ohne ' + selected.delayMonths + ' Monate Verschiebung'"
            >
              <line x1="36" y1="196" x2="662" y2="196" stroke="#8d9bab" stroke-width="1" />
              <line x1="36" y1="28" x2="36" y2="196" stroke="#8d9bab" stroke-width="1" />
              <polyline :points="chartPoints('baseCumulativeEur')" fill="none" stroke="#2256a5" stroke-width="3" />
              <polyline
                :points="chartPoints('delayedCumulativeEur')"
                fill="none"
                stroke="#c07932"
                stroke-width="3"
                stroke-dasharray="7 4"
              />
              <text x="36" y="222" font-size="12" fill="currentColor">Monat 0</text>
              <text x="662" y="222" text-anchor="end" font-size="12" fill="currentColor">
                Monat {{ draft.horizonMonths }}
              </text>
              <text x="44" y="19" font-size="12" fill="currentColor">Kumulierter Nutzen (EUR)</text>
              <text x="44" y="39" font-size="12" fill="currentColor">{{ compactEuro(chartMaximum) }}</text>
              <text x="44" y="190" font-size="12" fill="currentColor">0 €</text>
            </svg>
            </div>
            <p class="cod-chart-scroll-hint">Auf kleinen Bildschirmen: Diagramm seitlich scrollen. Die genauen Werte stehen im Monatsvergleich.</p>
            <p class="cod-muted">
              Die Kurven verwenden tatsächliche Monatswerte einschließlich Nutzenstart und Ramp-up. Exakte EUR-Werte
              stehen in der Tabelle.
            </p>
          </section>
          <section class="cod-breakdown" aria-labelledby="cod-breakdown-title">
            <h3 id="cod-breakdown-title">Was steckt hinter der Differenz?</h3>
            <dl>
              <div>
                <dt>Differenz monetarisierter Kundennutzen</dt>
                <dd>{{ money(selected.benefitDifferenceEur) }}</dd>
              </div>
              <div>
                <dt>Später vermiedene Altsystemkosten</dt>
                <dd>{{ draft.legacyMonthlyEur === null ? 'Noch offen' : money(selected.legacyDifferenceEur) }}</dd>
              </div>
              <div>
                <dt>Zusätzliche Verzögerungskosten</dt>
                <dd>
                  {{ selected.additionalDelayCostEur === null ? 'Noch offen' : money(selected.additionalDelayCostEur) }}
                </dd>
              </div>
              <div>
                <dt>Projektkosten im Horizont nur später fällig</dt>
                <dd>
                  {{ selected.deferredProjectCostEur === null ? 'Noch offen' : money(selected.deferredProjectCostEur) }}
                </dd>
              </div>
              <div class="cod-breakdown-total">
                <dt>Netto-Modellunterschied</dt>
                <dd>
                  {{ selected.netDifferenceEur === null ? 'Nicht berechenbar' : money(selected.netDifferenceEur) }}
                </dd>
              </div>
            </dl>
            <p>
              <strong>Nur zeitlich verschoben?</strong>
              {{
                selected.irreversibleBenefitEur === null
                  ? 'Ein endgültiger Verlust ist nicht nachgewiesen. Die Differenz entsteht im gewählten Kalenderhorizont.'
                  : 'Bei dem angenommenen festen Wirkungsende wären ' +
                    money(selected.irreversibleBenefitEur) +
                    ' nicht nachholbar. Dies muss der Kunde bestätigen.'
              }}
            </p>
          </section>
          <details class="cod-details">
            <summary>Vollständigen Monatsvergleich anzeigen</summary>
            <div
              class="cod-table-scroll"
              tabindex="0"
              role="region"
              aria-label="Monatlicher Nutzenvergleich, horizontal scrollbar"
            >
              <table>
                <thead>
                  <tr>
                    <th scope="col">Monat</th>
                    <th scope="col">Basis / Monat</th>
                    <th scope="col">Verschoben / Monat</th>
                    <th scope="col">Kumuliert Basis</th>
                    <th scope="col">Kumuliert verschoben</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="month in selected.months" :key="month.month">
                    <th scope="row">{{ month.month }}</th>
                    <td>{{ money(month.baseBenefitEur) }}</td>
                    <td>{{ money(month.delayedBenefitEur) }}</td>
                    <td>{{ money(month.baseCumulativeEur) }}</td>
                    <td>{{ money(month.delayedCumulativeEur) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
          <div class="cod-export">
            <button type="button" class="button button-secondary" @click="transferToBridge">
              In Value Bridge übernehmen
            </button>
            <button type="button" class="button button-primary button-with-icon" @click="exportPdf">
              <Download :size="17" aria-hidden="true" /> Kunden-Steckbrief als PDF
            </button>
            <p>Ausgangslage, Szenarien, Rechenweg, Herkunft, offene Fragen. Keine internen Qualifizierungsscores.</p>
          </div>
        </template>

        <section class="cod-questions" aria-labelledby="cod-questions-title">
          <h3 id="cod-questions-title">Offene Fragen für das Kundengespräch</h3>
          <ul>
            <li v-for="question in questions" :key="question">{{ question }}</li>
          </ul>
        </section>
      </section>

      <div class="cod-nav">
        <button type="button" class="button button-quiet button-with-icon" @click="reset">
          <RotateCcw :size="16" aria-hidden="true" /> Neu beginnen
        </button>
        <div>
          <button v-if="step > 1" type="button" class="button button-secondary" @click="step = (step - 1) as 1 | 2 | 3">
            Zurück
          </button>
          <button
            v-if="step < 3"
            type="button"
            class="button button-primary button-with-icon"
            @click="step = (step + 1) as 1 | 2 | 3"
          >
            Weiter <ArrowRight :size="16" aria-hidden="true" />
          </button>
        </div>
      </div>

      <section class="cod-sources">
        <details>
          <summary>Quellen und fachliche Einordnung</summary>
          <p>
            <strong>Andy Whyte, MEDDICC:</strong> Abschnitt „Metrics“ (M1 / M2) und „Identify / Indicate / Implicate
            Pain“. Messbare Ergebnisse und kundenbezogene Validierung sind relevant für wirtschaftliche Priorität.
          </p>
          <p>
            <strong>Darius Lahoutifard, Always Be Qualifying:</strong> Kapitel 3 „Metrics“, Kapitel 4 „Economic Buyer“,
            Kapitel 7 „Identify Pain“ und Kapitel 9 „The ROI Pitch“. Wirtschaftliche Wirkung und nachvollziehbare
            Entscheidungsdringlichkeit sind zentral.
          </p>
          <p>
            Die Monatsengine, Verschiebungsregeln und Unterscheidung zwischen Horizontdifferenz und unwiederbringlichem
            Verlust sind eigene Modellierungsentscheidungen, keine Formeln der Autoren.
          </p>
        </details>
      </section>
    </main>
  </div>
</template>
