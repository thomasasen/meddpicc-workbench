<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowRight,
  ArrowDownToLine,
  Calculator,
  ClipboardCopy,
  FileCheck2,
  Lightbulb,
  RotateCcw,
} from '@lucide/vue'
import {
  buildMetric,
  decimal,
  emptyMetricDraft,
  euro,
  evidenceLabels,
  mechanismLabels,
  metricDemos,
  metricSummary,
  metricTypeLabels,
  type MetricBuilderDraft,
  type RealizationMechanism,
} from '../domain/metricBuilder'
import { queueMetricHandoff } from '../domain/metricBuilderHandoff'
import { buildMetricBuilderPdf } from '../report/metricBuilderPdf'
import type { MetricFormula } from '../domain/softwarePayback'

const router = useRouter()
const draft = ref<MetricBuilderDraft>(emptyMetricDraft())
const step = ref<1 | 2 | 3>(1)
const message = ref('')
const demoName = ref('')
const result = computed(() => buildMetric(draft.value))
const summary = computed(() => metricSummary(draft.value, result.value))
const numericTypes: MetricFormula[] = ['direct', 'process', 'time', 'conversion', 'quality', 'risk']
const moneyTypes: MetricFormula[] = ['direct', 'process', 'time', 'conversion', 'quality']
const isNumeric = computed(() => numericTypes.includes(draft.value.formula))
const hasVolume = computed(() => !['direct', 'qualitative'].includes(draft.value.formula))
const hasPercent = computed(() => ['conversion', 'quality'].includes(draft.value.formula))
const availableMechanisms = computed((): RealizationMechanism[] => {
  if (draft.value.formula === 'risk' || draft.value.formula === 'qualitative') return ['unresolved']
  if (draft.value.formula === 'conversion') return ['unresolved', 'incremental-margin']
  if (draft.value.formula === 'quality') return ['unresolved', 'reduced-error-cost']
  return ['unresolved', 'avoidable-cost', 'avoided-hiring', 'avoided-external']
})
const numberLabel = computed(() => {
  if (draft.value.formula === 'direct') return 'Kosten in EUR je Zeitraum'
  if (draft.value.formula === 'process') return 'EUR je Vorgang'
  if (draft.value.formula === 'time') return 'Minuten je Vorgang'
  if (hasPercent.value) return 'Prozent (%)'
  return 'Risikohäufigkeit je Vorgang'
})
const realizationPossible = computed(() => moneyTypes.includes(draft.value.formula))
const totalQuestions = computed(() => result.value.questions.slice(0, 7))
const beforeScale = computed(() => {
  const before = draft.value.before
  const after = draft.value.after
  if (typeof before !== 'number' || typeof after !== 'number') return null
  if (!Number.isFinite(before) || !Number.isFinite(after) || before < 0 || after < 0) return null
  const max = Math.max(before, after)
  return {
    before: max === 0 ? 0 : before / max * 100,
    after: max === 0 ? 0 : after / max * 100,
  }
})

function chooseFormula(value: MetricFormula): void {
  draft.value.formula = value
  draft.value.mechanism = 'unresolved'
  draft.value.realizedAnnual = ''
  draft.value.realizationNote = ''
  message.value = ''
}

function reset(): void {
  draft.value = emptyMetricDraft()
  step.value = 1
  message.value = ''
  demoName.value = ''
}

function loadDemo(name: string): void {
  const example = metricDemos[name]
  if (!example) return
  draft.value = {
    ...emptyMetricDraft(),
    ...example,
    assumptionNote: 'Fiktives Schulungsbeispiel. Mengen, Werte und wirtschaftliche Wirkung sind nicht durch einen Kunden bestätigt.',
  }
  step.value = 2
  demoName.value = name
  message.value = 'Fiktives Beispiel geladen. Sämtliche Beträge und Annahmen sind erfunden.'
}

function forward(): void {
  if (step.value < 3) step.value = (step.value + 1) as 1 | 2 | 3
  message.value = ''
}

function back(): void {
  if (step.value > 1) step.value = (step.value - 1) as 1 | 2 | 3
  message.value = ''
}

async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(summary.value)
    message.value = 'Zusammenfassung kopiert.'
  } catch {
    message.value = 'Kopieren nicht möglich. Text bitte manuell markieren.'
  }
}

function download(bytes: Uint8Array, name: string): void {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function exportPdf(): Promise<void> {
  try {
    const bytes = await buildMetricBuilderPdf(draft.value)
    download(bytes, 'metric-steckbrief.pdf')
    message.value = 'Metric-Steckbrief erstellt. Fehlende Werte sind im Dokument gekennzeichnet.'
  } catch {
    message.value = 'PDF konnte nicht erzeugt werden.'
  }
}

async function transfer(): Promise<void> {
  if (!result.value.complete || !result.value.transfer.length) return
  try {
    queueMetricHandoff(result.value.transfer, window.sessionStorage)
    await router.push({ path: '/tools/quick-payback', query: { importMetric: '1' } })
  } catch {
    message.value = 'Lokale Übergabe nicht möglich. Bitte Browserspeicher für diese Sitzung erlauben.'
  }
}
</script>

<template>
  <div class="site-shell metric-shell">
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

    <main id="main-content" class="container metric-main">
      <section class="metric-intro">
        <div class="tool-intro-meta">
          <span class="tool-kind tool-kind--customer">Kundenfähiger Steckbrief</span>
          <span>Value &amp; Metrics · Modellrechnung</span>
        </div>
        <h1>Vom Kundenproblem zur belastbaren Metric</h1>
        <p class="intro-text">
          Entwickle eine messbare Verbesserung, prüfe ihre wirtschaftliche Wirkung und halte offene Annahmen fest.
          Freie Zeit ist nicht automatisch eine Kostenersparnis.
        </p>
      </section>

      <nav class="metric-steps" aria-label="Metric entwickeln">
        <button v-for="(label, index) in ['1 · Problem', '2 · Messung', '3 · Wirkung & Evidenz']"
          :key="label" type="button" class="metric-step"
          :class="{ 'metric-step--active': step === index + 1 }"
          :aria-current="step === index + 1 ? 'step' : undefined"
          @click="step = (index + 1) as 1 | 2 | 3">
          {{ label }}
        </button>
      </nav>

      <section v-if="step === 1" class="metric-panel" aria-labelledby="metric-problem-title">
        <p class="eyebrow">Schritt 1 · Discovery</p>
        <h2 id="metric-problem-title">Was soll sich beim Kunden verändern?</h2>
        <p>Beginne mit dem Problem. Noch keine Euro-Beträge behaupten.</p>
        <div class="metric-fields">
          <label class="field"><span>Welches konkrete Problem besteht?</span>
            <textarea v-model="draft.problem" rows="3" maxlength="240"
              placeholder="Unsere Servicemitarbeiter verbringen zu viel Zeit mit manueller Datenpflege." />
          </label>
          <label class="field"><span>Betroffener Geschäftsprozess</span>
            <input v-model="draft.process" type="text" maxlength="140" placeholder="z. B. Bearbeitung von Kundenanfragen" />
          </label>
          <label class="field"><span>Welche negativen Folgen entstehen?</span>
            <textarea v-model="draft.consequence" rows="2" maxlength="240" placeholder="z. B. längere Wartezeiten" />
          </label>
          <label class="field"><span>Welcher bessere Zustand wird angestrebt?</span>
            <textarea v-model="draft.outcome" rows="2" maxlength="240" placeholder="z. B. weniger Zeit je Vorgang" />
          </label>
        </div>
        <div class="metric-demo">
          <h3>Fiktive Beispiele als Einstieg</h3>
          <div class="metric-actions">
            <button type="button" class="button button-secondary" @click="loadDemo('crm')">CRM-Zeitgewinn</button>
            <button type="button" class="button button-secondary" @click="loadDemo('service')">Servicekosten</button>
            <button type="button" class="button button-secondary" @click="loadDemo('sales')">Conversion</button>
            <button type="button" class="button button-secondary" @click="loadDemo('quality')">Fehlerkosten</button>
            <button type="button" class="button button-secondary" @click="loadDemo('risk')">Risiko</button>
          </div>
          <p class="metric-muted">Alle Zahlen sind ausschließlich erfundene Schulungswerte, keine Referenzkunden-Ergebnisse.</p>
        </div>
      </section>

      <section v-if="step === 2" class="metric-panel" aria-labelledby="metric-measure-title">
        <p class="eyebrow">Schritt 2 · Before / After</p>
        <h2 id="metric-measure-title">Wie lässt sich die Veränderung messen?</h2>
        <div class="metric-fields">
          <label class="field"><span>Art der Metric</span>
            <select :value="draft.formula" @change="chooseFormula(($event.target as HTMLSelectElement).value as MetricFormula)">
              <option v-for="(label, formula) in metricTypeLabels" :key="formula" :value="formula">{{ label }}</option>
            </select>
          </label>
          <label v-if="isNumeric" class="field"><span>Zeitraum für Menge und Ausgangs-/Zielwerte</span>
            <select v-model="draft.period">
              <option value="annual">pro Jahr</option>
              <option value="monthly">pro Monat</option>
            </select>
          </label>
          <label v-if="hasVolume" class="field"><span>Betroffene Vorgänge pro {{ draft.period === 'monthly' ? 'Monat' : 'Jahr' }}</span>
            <input v-model.number="draft.volume" type="number" inputmode="numeric" min="0" max="1000000000000" step="1"
              placeholder="Anzahl" />
          </label>
          <template v-if="isNumeric">
            <label class="field"><span>Ausgangswert ({{ numberLabel }})</span>
              <input v-model.number="draft.before" type="number" inputmode="decimal" min="0"
                :max="hasPercent ? 100 : undefined" step="any" placeholder="Ist-Wert" />
            </label>
            <label class="field"><span>Zielwert ({{ numberLabel }})</span>
              <input v-model.number="draft.after" type="number" inputmode="decimal" min="0"
                :max="hasPercent ? 100 : undefined" step="any" placeholder="Ziel-Wert" />
            </label>
          </template>
          <template v-if="draft.formula === 'qualitative'">
            <label class="field"><span>Heutiger Zustand</span>
              <textarea v-model="draft.beforeText" rows="3" maxlength="200" />
            </label>
            <label class="field"><span>Angestrebter Zustand</span>
              <textarea v-model="draft.afterText" rows="3" maxlength="200" />
            </label>
          </template>
          <label v-if="draft.formula === 'time'" class="field"><span>Vollkostensatz in EUR je Stunde</span>
            <input v-model.number="draft.hourlyCost" type="number" inputmode="decimal" min="0" step="any" />
            <small>Ein Vollkostensatz bewertet zunächst Kapazität, nicht realisierte Einsparung.</small>
          </label>
          <label v-if="draft.formula === 'conversion' || draft.formula === 'quality'" class="field">
            <span>{{ draft.formula === 'conversion' ? 'Zusätzlicher Deckungsbeitrag je Abschluss (EUR)' : 'Vermeidbare Fehlerkosten je Fehler (EUR)' }}</span>
            <input v-model.number="draft.valuePerEvent" type="number" inputmode="decimal" min="0" step="any" />
            <small>Keine bloßen Umsatzerlöse oder unbelegten Pauschalbeträge ansetzen.</small>
          </label>
        </div>
        <div class="metric-inline-result" aria-live="polite">
          <strong>Rechnerischer Stand</strong>
          <p>{{ result.calculation || 'Zunächst Ausgangswert und erreichbares Ziel eingeben.' }}</p>
          <p v-if="result.potentialEur !== null">Potenzial: <strong>{{ euro(result.potentialEur) }} pro Jahr</strong>
            (noch keine realisierte Einsparung).</p>
          <p v-else>Kein verlässlicher finanzieller Potenzialwert ableitbar.</p>
        </div>
      </section>

      <section v-if="step === 3" class="metric-panel" aria-labelledby="metric-evidence-title">
        <p class="eyebrow">Schritt 3 · Realisierung &amp; Evidenz</p>
        <h2 id="metric-evidence-title">Was wird tatsächlich wirtschaftlich wirksam?</h2>
        <p>Zwischen operativer Verbesserung, rechnerischem Potenzial und realisiertem Nutzen unterscheiden.</p>
        <div class="metric-three-values" aria-label="Drei Ebenen der Metric">
          <div><span>Operative Veränderung</span>
            <strong>{{ result.operatingChange === null ? 'Offen' : decimal(result.operatingChange) }}</strong>
            <small>{{ result.beforeText || 'Ist-Wert offen' }} → {{ result.afterText || 'Zielwert offen' }}</small>
          </div>
          <div><span>Rechnerisches Potenzial</span>
            <strong>{{ result.potentialEur === null ? 'Nicht berechenbar' : euro(result.potentialEur) }}</strong>
            <small>pro Jahr, keine automatische Ersparnis</small>
          </div>
          <div><span>Wirtschaftlich realisierbar</span>
            <strong>{{ result.realizedEur === null ? 'Nicht nachgewiesen' : euro(result.realizedEur) }}</strong>
            <small>pro Jahr, nur mit angegebenem Mechanismus</small>
          </div>
        </div>

        <div class="metric-fields">
          <label v-if="realizationPossible" class="field"><span>Wie kann der Nutzen finanziell realisiert werden?</span>
            <select v-model="draft.mechanism">
              <option v-for="mechanism in availableMechanisms" :key="mechanism" :value="mechanism">
                {{ mechanismLabels[mechanism] }}
              </option>
            </select>
          </label>
          <template v-if="realizationPossible && draft.mechanism !== 'unresolved'">
            <label class="field"><span>Tatsächlich realisierbarer Betrag in EUR pro Jahr</span>
              <input v-model.number="draft.realizedAnnual" type="number" min="0" step="any" inputmode="decimal" />
              <small>Darf nicht höher sein als das berechnete Potenzial.</small>
            </label>
            <label class="field"><span>Welche konkrete Ausgabe entfällt oder welcher Deckungsbeitrag entsteht?</span>
              <textarea v-model="draft.realizationNote" rows="3" maxlength="240"
                placeholder="Konkrete Maßnahme und nachvollziehbare Datenbasis" />
            </label>
            <label class="field"><span>Wirkungsgruppe gegen Doppelzählung</span>
              <input v-model="draft.effectGroup" maxlength="80" placeholder="z. B. Service-extern" />
              <small>Gleiche Wirkung bei mehreren Metrics immer derselben Gruppe zuordnen.</small>
            </label>
          </template>
          <p v-if="!realizationPossible" class="metric-muted">
            Für Risiko- und qualitative Verbesserungen entsteht hier keine künstliche EUR-Bewertung.
          </p>
          <label class="field"><span>Herkunft und Prüfstand der Werte</span>
            <select v-model="draft.evidence">
              <option v-for="(label, evidence) in evidenceLabels" :key="evidence" :value="evidence">{{ label }}</option>
            </select>
            <small>„Mit dem Kunden geprüft“ nur selbst und bewusst wählen; der Rechner validiert keine Quelldaten.</small>
          </label>
          <label class="field"><span>Quellen, geprüfte Annahmen oder offene Datenbasis</span>
            <textarea v-model="draft.assumptionNote" rows="3" maxlength="360"
              placeholder="Wer hat wann welche Mengen, Werte und Zielannahmen genannt oder geprüft?" />
          </label>
          <div class="metric-timing">
            <label class="field"><span>Nutzenbeginn im Projektmonat</span>
              <input v-model.number="draft.startMonth" type="number" min="1" max="60" step="1" />
            </label>
            <label class="field"><span>Ramp-up in Monaten</span>
              <input v-model.number="draft.rampMonths" type="number" min="1" max="60" step="1" />
            </label>
          </div>
        </div>
      </section>

      <div class="metric-wizard-actions">
        <button type="button" class="button button-quiet button-with-icon" @click="reset">
          <RotateCcw :size="16" aria-hidden="true" /> Neu beginnen
        </button>
        <div class="metric-actions">
          <button v-if="step > 1" type="button" class="button button-secondary" @click="back">Zurück</button>
          <button v-if="step < 3" type="button" class="button button-primary button-with-icon" @click="forward">
            Weiter <ArrowRight :size="16" aria-hidden="true" />
          </button>
        </div>
      </div>
      <p v-if="demoName" class="metric-demo-banner">Fiktives Beispiel · nicht kundenseitig validiert.</p>
      <p v-if="message" class="metric-feedback" role="status">{{ message }}</p>

      <section class="metric-result metric-panel" aria-labelledby="metric-card-title">
        <p class="eyebrow">Metric Card · aktueller Stand</p>
        <h2 id="metric-card-title">{{ draft.process.trim() || 'Messbare Veränderung entwickeln' }}</h2>
        <p>{{ draft.problem.trim() || 'Beschreibe zunächst das konkrete Kundenproblem.' }}</p>

        <div class="metric-compare" aria-label="Vorher-Nachher-Vergleich">
          <div>
            <span>Heute</span><strong>{{ result.beforeText || 'Offen' }}</strong>
            <div v-if="beforeScale" class="metric-bar"><span :style="{ width: beforeScale.before + '%' }" /></div>
          </div>
          <div>
            <span>Ziel</span><strong>{{ result.afterText || 'Offen' }}</strong>
            <div v-if="beforeScale" class="metric-bar metric-bar--goal"><span :style="{ width: beforeScale.after + '%' }" /></div>
          </div>
        </div>
        <p class="metric-calculation"><strong>Rechenweg:</strong> {{ result.calculation || 'Noch keine vollständige Berechnung möglich.' }}</p>
        <dl class="metric-result-values">
          <div><dt>Rechnerisches Potenzial pro Jahr</dt>
            <dd>{{ result.potentialEur === null ? 'Nicht belegt' : euro(result.potentialEur) }}</dd></div>
          <div><dt>Wirtschaftlich realisierbarer Anteil pro Jahr</dt>
            <dd>{{ result.realizedEur === null ? 'Nicht nachgewiesen' : euro(result.realizedEur) }}</dd></div>
          <div><dt>Evidenz</dt><dd>{{ evidenceLabels[draft.evidence] }}</dd></div>
        </dl>
        <p v-if="!result.complete" class="metric-notice">
          Unvollständig: Es wird kein abgeschlossener finanzieller Business Case behauptet.
        </p>
        <div class="metric-discovery">
          <h3><Lightbulb :size="18" aria-hidden="true" /> Im Kundengespräch noch klären</h3>
          <ul v-if="totalQuestions.length">
            <li v-for="question in totalQuestions" :key="question">{{ question }}</li>
          </ul>
          <p v-else>Keine durch die Eingaben erkennbaren Discovery-Lücken. Die Zahlen bleiben anhand ihrer Quellen zu prüfen.</p>
          <ul v-if="result.issues.length" class="metric-errors">
            <li v-for="issue in result.issues" :key="issue">{{ issue }}</li>
          </ul>
        </div>
        <div class="metric-share">
          <h3>Ergebnis weiterverwenden</h3>
          <p class="metric-muted">
            PDF und Zusammenfassung zeigen Annahmen sowie offene Fragen. Die Übernahme fügt nur nicht angerechnete
            Metrics zum bestehenden Software-Payback hinzu; die spätere finanzielle Aktivierung bleibt manuell.
          </p>
          <div class="metric-actions">
            <button type="button" class="button button-secondary button-with-icon" @click="copy">
              <ClipboardCopy :size="16" aria-hidden="true" /> Zusammenfassung kopieren
            </button>
            <button type="button" class="button button-secondary button-with-icon" @click="exportPdf">
              <ArrowDownToLine :size="16" aria-hidden="true" /> Steckbrief als PDF
            </button>
            <button type="button" class="button button-primary button-with-icon"
              :disabled="!result.complete" @click="transfer">
              <FileCheck2 :size="16" aria-hidden="true" /> Metric in Software-Payback übernehmen
            </button>
          </div>
        </div>
      </section>

      <section class="metric-sources" aria-label="Quellen und fachliche Grenzen">
        <details>
          <summary>Quellen und fachliche Einordnung</summary>
          <p><strong>Andy Whyte:</strong> <em>MEDDICC</em>, Abschnitte „Metrics 1 (M1's) – Metrics Proof Points“,
            „Metrics 2 (M2's) – Return on Investment“, „Metrics and Clarity“ und „Metrics and Urgency“.
            Referenzergebnisse sind keine automatisch bestätigten kundenspezifischen Metrics.</p>
          <p><strong>Darius Lahoutifard:</strong> <em>Always Be Qualifying</em>, Kapitel 3 „Metrics“,
            insbesondere die Merkmale M-E-T-R-I-C, sowie Kapitel 9 „The ROI Pitch“.</p>
          <p><strong>Eigene Produktregeln:</strong> Drei Stufen der Nutzenrealisierung, explizite Evidenz,
            Pflichtbegründung für finanzielle Ansätze, keine automatische Monetarisierung von Risiko,
            Kapazität oder qualitativen Verbesserungen und lokale Übergabe an den Payback.
            Das ist keine von den Autoren vorgeschriebene Formel.</p>
        </details>
        <RouterLink class="metric-knowledge" to="/knowledge/metrics"><Calculator :size="16" aria-hidden="true" /> Metrics-Wissen nachschlagen</RouterLink>
      </section>
    </main>
  </div>
</template>

<style scoped>
.metric-main { padding: var(--space-8) 0 var(--space-12); max-width: 1024px; }
.metric-main, .metric-panel, .metric-fields, .metric-compare > div { min-width: 0; }
.metric-intro { margin-bottom: var(--space-6); }
.metric-intro h1 { max-width: 800px; }
.metric-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-2); margin-bottom: var(--space-5); }
.metric-step { font: inherit; font-weight: 700; text-align: left; padding: 13px 15px; border: 1px solid var(--color-border-strong); background: var(--color-surface); border-radius: var(--radius-control); color: var(--color-text); cursor: pointer; }
.metric-step--active { border: 2px solid var(--color-accent); background: var(--color-surface-muted); padding: 12px 14px; }
.metric-step:focus-visible, .metric-actions button:focus-visible { outline: 3px solid var(--color-accent); outline-offset: 2px; }
.metric-panel { border: 1px solid var(--color-border); background: var(--color-surface); border-radius: var(--radius-panel); box-shadow: var(--shadow-panel); padding: var(--space-6); overflow-wrap: anywhere; }
.metric-panel h2 { margin-top: 0; }
.metric-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); margin-top: var(--space-6); }
.metric-fields > .field { margin: 0; min-width: 0; }
.metric-fields input, .metric-fields select, .metric-fields textarea { width: 100%; min-width: 0; box-sizing: border-box; }
.metric-fields small { color: var(--color-text-muted); line-height: 1.4; }
.metric-timing { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); }
.metric-demo { border-top: 1px solid var(--color-divider); margin-top: var(--space-6); padding-top: var(--space-4); }
.metric-demo h3 { margin-top: 0; font-size: 1rem; }
.metric-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); min-width: 0; }
.metric-actions > button { max-width: 100%; white-space: normal; text-align: left; }
.metric-muted { color: var(--color-text-muted); font-size: .92rem; }
.metric-wizard-actions { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-4); margin: var(--space-4) 0 var(--space-7); }
.metric-inline-result { margin-top: var(--space-6); border-left: 3px solid var(--color-accent); padding: var(--space-4); background: var(--color-surface-muted); }
.metric-inline-result p:last-child { margin-bottom: 0; }
.metric-three-values { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--space-3); }
.metric-three-values > div { min-width: 0; background: var(--color-surface-muted); border: 1px solid var(--color-border); border-radius: var(--radius-control); padding: var(--space-4); overflow-wrap: anywhere; }
.metric-three-values span, .metric-three-values small { display: block; color: var(--color-text-muted); font-size: .86rem; }
.metric-three-values strong { display: block; margin: .65rem 0; font-size: clamp(1rem, 2vw, 1.42rem); font-variant-numeric: tabular-nums; }
.metric-demo-banner, .metric-feedback { padding: var(--space-3) 0; font-size: .91rem; }
.metric-demo-banner { color: var(--color-text-muted); }
.metric-result { margin-top: var(--space-7); }
.metric-compare { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); margin: var(--space-5) 0; }
.metric-compare > div { padding: var(--space-4); border: 1px solid var(--color-border); background: var(--color-surface-muted); border-radius: var(--radius-control); }
.metric-compare span, .metric-compare strong { display: block; }
.metric-compare span { color: var(--color-text-muted); font-size: .88rem; }
.metric-compare strong { margin: var(--space-2) 0; }
.metric-bar { background: var(--color-border); border-radius: 4px; height: 8px; overflow: hidden; }
.metric-bar span { display: block; background: var(--color-accent); height: 100%; }
.metric-bar--goal span { background: #47837a; }
.metric-calculation { overflow-wrap: anywhere; }
.metric-result-values { margin: var(--space-5) 0; }
.metric-result-values > div { display: flex; flex-wrap: wrap; gap: var(--space-3); justify-content: space-between; align-items: baseline; padding: var(--space-3) 0; border-bottom: 1px solid var(--color-divider); }
.metric-result-values dt { color: var(--color-text-muted); }
.metric-result-values dd { margin: 0; font-weight: 750; font-variant-numeric: tabular-nums; }
.metric-notice { border-left: 3px solid #b45309; background: var(--color-surface-muted); padding: var(--space-3); }
.metric-discovery { margin-top: var(--space-6); }
.metric-discovery h3 { display: flex; align-items: center; gap: var(--space-2); }
.metric-discovery li { margin-bottom: var(--space-2); }
.metric-errors { color: var(--color-risk-text); }
.metric-share { border-top: 1px solid var(--color-divider); padding-top: var(--space-5); margin-top: var(--space-6); }
.metric-share h3 { margin-top: 0; }
.metric-sources { margin-top: var(--space-7); }
.metric-sources details { padding: var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-control); }
.metric-sources summary { cursor: pointer; font-weight: 650; }
.metric-knowledge { display: inline-flex; gap: var(--space-2); align-items: center; margin-top: var(--space-5); }
@media (max-width: 700px) {
  .metric-main { padding-top: var(--space-5); }
  .metric-panel { padding: var(--space-4); }
  .metric-fields, .metric-three-values, .metric-timing { grid-template-columns: minmax(0, 1fr); }
  .metric-steps { grid-template-columns: minmax(0, 1fr); }
  .metric-step { padding: 10px 12px; }
  .metric-step--active { padding: 9px 11px; }
  .metric-compare { grid-template-columns: minmax(0, 1fr); }
}
</style>
