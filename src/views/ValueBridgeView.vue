<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  ChartColumnIncreasing,
  CircleAlert,
  CircleDashed,
  ClipboardCopy,
  Download,
  FileChartColumn,
  Lightbulb,
  Plus,
  RotateCcw,
  Target,
  Trash2,
  Workflow,
} from '@lucide/vue'
import {
  blankBridgeMetric,
  blankValueBridge,
  bridgeEvidenceLabels,
  bridgeKindLabels,
  evaluateValueBridge,
  valueBridgeDemos,
  type BridgeMetric,
  type ValueBridgeInput,
} from '../domain/valueBridge'
import { consumeValueBridgeHandoff } from '../domain/valueBridgeHandoff'
import { buildValueBridgePdf } from '../report/valueBridgePdf'
import '../styles/valueBridge.css'

const draft = ref<ValueBridgeInput>(blankValueBridge())
const step = ref<1 | 2 | 3>(1)
const customerView = ref(false)
const showFinance = ref(false)
const message = ref('')
const isDemo = ref(false)
let counter = 1
const result = computed(() => evaluateValueBridge(draft.value))
const money = (value: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)

function addMetric(): void {
  counter += 1
  draft.value.metrics.push(blankBridgeMetric('metric-' + counter))
}
function removeMetric(id: string): void {
  draft.value.metrics = draft.value.metrics.filter((m) => m.id !== id)
}
function changeKind(metric: BridgeMetric): void {
  // Eine neue Wirkungsart darf niemals automatisch finanziell angerechnet werden.
  // Der importierte Betrag bleibt zur erneuten fachlichen Einordnung editierbar.
  metric.included = false
}
function setMetricAmount(metric: BridgeMetric, key: 'annualPotentialEur' | 'annualRealizedEur', event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  metric[key] = raw === '' ? null : Number(raw)
}
function setCaseAmount(key: 'investmentEur' | 'saasMonthlyEur', event: Event): void {
  const raw = (event.target as HTMLInputElement).value
  draft.value[key] = raw === '' ? null : Number(raw)
}
function loadDemo(name: string): void {
  const demo = valueBridgeDemos[name]
  if (!demo) return
  draft.value = structuredClone(demo)
  isDemo.value = true
  showFinance.value = name !== 'capacity'
  step.value = 3
  customerView.value = false
  message.value = 'Fiktives Beispiel geladen, keine echten Kundendaten.'
}
function reset(): void {
  draft.value = blankValueBridge()
  step.value = 1
  showFinance.value = false
  customerView.value = false
  isDemo.value = false
  message.value = ''
}
async function copySummary(): Promise<void> {
  try {
    await navigator.clipboard.writeText(result.value.summary)
    message.value = 'Zusammenfassung kopiert.'
  } catch {
    message.value = 'Kopieren nicht möglich. Bitte Text manuell markieren.'
  }
}
async function exportPdf(): Promise<void> {
  try {
    const bytes = await buildValueBridgePdf(draft.value)
    const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'value-bridge.pdf'
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    message.value = 'PDF mit Datenherkunft und offenen Annahmen erzeugt.'
  } catch {
    message.value = 'PDF-Export fehlgeschlagen.'
  }
}

onMounted(() => {
  try {
    const imported = consumeValueBridgeHandoff(window.sessionStorage)
    if (imported) {
      draft.value = imported
      step.value = 3
      message.value = 'Daten ausdrücklich übernommen. Keine importierte Metric ist für die EUR-Rechnung aktiviert.'
      if (
        imported.metrics.some((metric) => metric.origin === 'software-business-case') &&
        (imported.investmentEur === null || imported.saasMonthlyEur === null)
      ) {
        message.value +=
          ' Komplexe Kostenpositionen wurden nicht als vereinfachte Beträge übernommen. Bitte im ursprünglichen Business Case prüfen.'
      }
    }
  } catch {
    message.value = 'Die lokale Übergabe war nicht verfügbar.'
  }
})
</script>

<template>
  <div class="site-shell vb-shell">
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

    <main id="main-content" class="container vb-main">
      <section class="vb-intro">
        <div class="tool-intro-meta vb-intro-meta">
          <span class="tool-kind tool-kind--customer"
            ><FileChartColumn :size="15" aria-hidden="true" /> Kundenfähiges Ergebnis</span
          >
          <span>Value &amp; Metrics · Argumentation</span>
        </div>
        <h1>Vom Kundenproblem zur Investitionsgrundlage</h1>
        <p class="intro-text">
          Verknüpfe Pain, gewünschte Veränderung, Metrics und geschäftlichen Nutzen. Auch ohne vollständige EUR-Rechnung
          entsteht ein nutzbarer Gesprächsleitfaden.
        </p>
        <div class="vb-demos" aria-label="Fiktive Beispiele">
          <span>Fiktive Beispiele:</span>
          <button type="button" class="button button-secondary" @click="loadDemo('service')">CRM / Service</button>
          <button type="button" class="button button-secondary" @click="loadDemo('sales')">
            Vertrieb / Doppelzählung
          </button>
          <button type="button" class="button button-secondary" @click="loadDemo('capacity')">
            Kapazität / Qualität
          </button>
          <button type="button" class="button button-quiet button-with-icon" @click="reset">
            <RotateCcw :size="16" aria-hidden="true" /> Leeren
          </button>
        </div>
        <p v-if="message" class="vb-notice" role="status">{{ message }}</p>
        <p v-if="isDemo" class="vb-demo-note">Demodaten sind vollständig erfunden und nicht kundenseitig validiert.</p>
      </section>

      <nav class="vb-steps" aria-label="Value Bridge erstellen">
        <button
          v-for="(item, index) in [
            { label: '1 · Pain', icon: CircleAlert },
            { label: '2 · Ziel', icon: Target },
            { label: '3 · Metrics & Wert', icon: ChartColumnIncreasing },
          ]"
          :key="item.label"
          type="button"
          :aria-current="step === index + 1 ? 'step' : undefined"
          :class="{ active: step === index + 1 }"
          @click="step = (index + 1) as 1 | 2 | 3"
        >
          <component :is="item.icon" :size="17" aria-hidden="true" /> {{ item.label }}
        </button>
      </nav>

      <div class="vb-layout">
        <section class="vb-panel vb-input" aria-labelledby="vb-input-heading">
          <p class="eyebrow">Eingabe · Schritt {{ step }} von 3</p>
          <h2 id="vb-input-heading">
            {{
              step === 1
                ? 'Was ist das Problem?'
                : step === 2
                  ? 'Welche Veränderung hilft?'
                  : 'Woran wird Wirkung messbar?'
            }}
          </h2>
          <template v-if="step === 1">
            <label class="vb-field"
              ><span>Unternehmen (optional)</span>
              <input v-model="draft.customer" maxlength="140" placeholder="Kunde oder Projekt" />
            </label>
            <label class="vb-field"
              ><span>Aktuelle Situation</span>
              <textarea v-model="draft.situation" rows="2" maxlength="800" placeholder="Was passiert heute?" />
            </label>
            <label class="vb-field"
              ><span>Konkretes Kundenproblem (Pain)</span>
              <textarea
                v-model="draft.pain"
                rows="3"
                maxlength="900"
                placeholder="Welcher Ablauf verursacht die Schwierigkeit?"
              />
            </label>
            <label class="vb-field"
              ><span>Geschäftliche Konsequenz</span>
              <textarea
                v-model="draft.consequence"
                rows="3"
                maxlength="900"
                placeholder="Wen oder was beeinträchtigt das und warum ist es relevant?"
              />
            </label>
          </template>

          <template v-else-if="step === 2">
            <label class="vb-field"
              ><span>Gewünschtes Geschäftsergebnis</span>
              <textarea
                v-model="draft.outcome"
                rows="3"
                maxlength="900"
                placeholder="Was soll für den Kunden besser werden?"
              />
            </label>
            <label class="vb-field"
              ><span>Wie ermöglicht die Lösung die Verbesserung?</span>
              <textarea
                v-model="draft.change"
                rows="3"
                maxlength="900"
                placeholder="Konkreter Wirkungsmechanismus, nicht Produktwerbung"
              />
            </label>
            <label class="vb-field"
              ><span>Welche Voraussetzungen bestehen?</span>
              <textarea
                v-model="draft.prerequisites"
                rows="3"
                maxlength="900"
                placeholder="Daten, Prozesse, Adoption, Freigaben"
              />
            </label>
          </template>

          <template v-else>
            <p class="vb-hint">
              Jede Metric beschreibt eine Veränderung. Freie Zeit, theoretische Umsatzwerte und Risiken zählen nicht
              automatisch als Einsparung.
            </p>
            <article v-for="(metric, index) in draft.metrics" :key="metric.id" class="vb-metric-entry">
              <div class="vb-entry-head">
                <h3>Metric {{ index + 1 }}</h3>
                <button
                  v-if="draft.metrics.length > 1"
                  type="button"
                  class="button button-quiet button-with-icon"
                  :aria-label="'Metric ' + (index + 1) + ' entfernen'"
                  @click="removeMetric(metric.id)"
                >
                  <Trash2 :size="16" aria-hidden="true" /> Entfernen
                </button>
              </div>
              <label class="vb-field"
                ><span>Was wird gemessen?</span>
                <input v-model="metric.name" maxlength="180" placeholder="z. B. Kosten externer Nachbearbeitung" />
              </label>
              <div class="vb-fields-two">
                <label class="vb-field"
                  ><span>Ausgangswert</span><input v-model="metric.before" maxlength="100" placeholder="z. B. 6.000"
                /></label>
                <label class="vb-field"
                  ><span>Zielwert</span><input v-model="metric.after" maxlength="100" placeholder="z. B. 3.000"
                /></label>
              </div>
              <label class="vb-field"
                ><span>Einheit</span>
                <input v-model="metric.unit" maxlength="60" placeholder="z. B. EUR/Monat oder Minuten/Vorgang" />
              </label>
              <label class="vb-field"
                ><span>Art der geschäftlichen Wirkung</span>
                <select v-model="metric.kind" @change="changeKind(metric)">
                  <option v-for="(label, kind) in bridgeKindLabels" :key="kind" :value="kind">{{ label }}</option>
                </select>
              </label>
              <label class="vb-field"
                ><span>Herkunft / Prüfstand</span>
                <select v-model="metric.evidence">
                  <option v-for="(label, evidence) in bridgeEvidenceLabels" :key="evidence" :value="evidence">
                    {{ label }}
                  </option>
                </select>
              </label>
              <label class="vb-field"
                ><span>Datenquelle und Annahmen</span>
                <textarea
                  v-model="metric.source"
                  rows="2"
                  maxlength="1000"
                  placeholder="Wer hat was anhand welcher Daten gesagt oder geprüft?"
                />
              </label>
              <details class="vb-details">
                <summary>Wirtschaftliche Details (optional)</summary>
                <div class="vb-detail-content">
                  <label class="vb-field"
                    ><span>Theoretisches Potenzial in EUR/Jahr (optional)</span>
                    <input
                      :value="metric.annualPotentialEur ?? ''"
                      @input="setMetricAmount(metric, 'annualPotentialEur', $event)"
                      type="number"
                      min="0"
                      max="1000000000000"
                      step="any"
                      placeholder="Nicht ermittelt"
                    />
                  </label>
                  <template v-if="metric.kind === 'saving' || metric.kind === 'margin'">
                    <label class="vb-field"
                      ><span>Wie wird der Jahreswert aus Ausgangs- und Zielwert ermittelt?</span>
                      <textarea
                        v-model="metric.calculation"
                        rows="2"
                        maxlength="1000"
                        placeholder="z. B. (6.000 - 3.000) EUR/Monat × 12 = 36.000 EUR/Jahr"
                      />
                    </label>
                    <label class="vb-field"
                      ><span>Wirtschaftlich realisierbarer Betrag EUR/Jahr</span>
                      <input
                        :value="metric.annualRealizedEur ?? ''"
                        @input="setMetricAmount(metric, 'annualRealizedEur', $event)"
                        type="number"
                        min="0"
                        max="1000000000000"
                        step="any"
                        placeholder="Noch unbewiesen"
                      />
                    </label>
                    <label class="vb-field"
                      ><span>Wie entsteht der Betrag tatsächlich?</span>
                      <textarea
                        v-model="metric.realization"
                        rows="2"
                        maxlength="800"
                        placeholder="z. B. Externer Vertragsbetrag entfällt, zusätzlicher Deckungsbeitrag nach Kosten"
                      />
                    </label>
                    <label class="vb-field"
                      ><span>Wirkungsgruppe (Doppelzählungen vermeiden)</span>
                      <input v-model="metric.effectGroup" maxlength="120" placeholder="z. B. externes-servicebudget" />
                    </label>
                    <label class="vb-check">
                      <input v-model="metric.included" type="checkbox" />
                      <span
                        >Diese EUR-Wirkung ausdrücklich in die Modellrechnung aufnehmen (keine Kundenbestätigung)</span
                      >
                    </label>
                  </template>
                  <div class="vb-fields-two">
                    <label class="vb-field"
                      ><span>Nutzenbeginn, Monat</span>
                      <input v-model.number="metric.startMonth" type="number" min="1" max="60" step="1" />
                    </label>
                    <label class="vb-field"
                      ><span>Hochlauf, Monate</span>
                      <input v-model.number="metric.rampMonths" type="number" min="1" max="60" step="1" />
                    </label>
                  </div>
                </div>
              </details>
              <p v-if="metric.origin !== 'manual'" class="vb-origin">
                Übernommen aus {{ metric.origin }}. Herkunft unverändert, finanzielle Anrechnung bleibt optional.
              </p>
            </article>
            <button
              type="button"
              class="button button-secondary button-with-icon"
              :disabled="draft.metrics.length >= 15"
              @click="addMetric"
            >
              <Plus :size="16" aria-hidden="true" /> Weitere Metric
            </button>
            <details
              class="vb-details"
              :open="showFinance"
              @toggle="showFinance = ($event.target as HTMLDetailsElement).open"
            >
              <summary>Projektkosten und Gesamtwirtschaftlichkeit (optional)</summary>
              <div class="vb-detail-content">
                <label class="vb-field"
                  ><span>Betrachtungszeitraum</span>
                  <select v-model.number="draft.horizonMonths">
                    <option :value="36">36 Monate</option>
                    <option :value="60">60 Monate</option>
                  </select>
                </label>
                <label class="vb-field"
                  ><span>Einmalige Projektkosten, EUR</span>
                  <input
                    :value="draft.investmentEur ?? ''"
                    @input="setCaseAmount('investmentEur', $event)"
                    type="number"
                    min="0"
                    max="1000000000000"
                    step="any"
                    placeholder="Noch offen"
                  />
                </label>
                <label class="vb-field"
                  ><span>Zusätzliche laufende Kosten, EUR/Monat</span>
                  <input
                    :value="draft.saasMonthlyEur ?? ''"
                    @input="setCaseAmount('saasMonthlyEur', $event)"
                    type="number"
                    min="0"
                    max="1000000000000"
                    step="any"
                    placeholder="Noch offen"
                  />
                </label>
                <p class="vb-hint">
                  Der wirtschaftliche Saldo und der Payback nutzen die vorhandene Software-Business-Case-Engine.
                  Zusätzliche Kosten- und Abschaltungsmodelle bitte dort prüfen.
                </p>
              </div>
            </details>
          </template>
          <div class="vb-step-actions">
            <button
              v-if="step > 1"
              class="button button-secondary"
              type="button"
              @click="step = (step - 1) as 1 | 2 | 3"
            >
              Zurück
            </button>
            <button v-if="step < 3" class="button button-primary" type="button" @click="step = (step + 1) as 1 | 2 | 3">
              Weiter
            </button>
          </div>
        </section>

        <section class="vb-panel vb-output" aria-labelledby="vb-output-heading">
          <div class="vb-output-top">
            <div>
              <p class="eyebrow vb-section-eyebrow">
                <span class="vb-section-round"><FileChartColumn :size="17" aria-hidden="true" /></span> Ergebnis · Value
                Bridge
              </p>
              <h2 id="vb-output-heading">Wirkungszusammenhang</h2>
            </div>
            <label class="vb-view-select"
              ><span>Ansicht</span>
              <select v-model="customerView" aria-label="Ergebnisansicht">
                <option :value="false">Intern</option>
                <option :value="true">Kundenfähig</option>
              </select>
            </label>
          </div>
          <p class="vb-hint">
            Die Verbindung stellt eine zu prüfende Argumentation dar, keine bestätigte Investitionsempfehlung.
          </p>
          <div class="vb-story" aria-label="Value Bridge: vom Problem zum messbaren Geschäftswert">
            <div class="vb-story-context">
              <span class="vb-story-context-label"><Workflow :size="16" aria-hidden="true" /> Heute beim Kunden</span>
              <p>{{ draft.situation || 'Die Ausgangslage ist noch zu klären.' }}</p>
            </div>
            <ol class="vb-story-steps">
              <li class="vb-story-step vb-story-step--pain">
                <span class="vb-story-icon"><CircleAlert :size="20" aria-hidden="true" /></span>
                <div class="vb-story-copy">
                  <span class="vb-story-kicker">01 · Kundenproblem</span>
                  <h3>Was ist das Problem?</h3>
                  <p class="vb-story-main">{{ draft.pain || 'Das konkrete Problem ist noch offen.' }}</p>
                </div>
              </li>
              <li class="vb-story-step vb-story-step--consequence">
                <span class="vb-story-icon"><CircleAlert :size="20" aria-hidden="true" /></span>
                <div class="vb-story-copy">
                  <span class="vb-story-kicker">02 · Geschäftliche Konsequenz</span>
                  <h3>Welche Auswirkung hat das Problem?</h3>
                  <p class="vb-story-main">{{ draft.consequence || 'Die geschäftliche Folge ist noch nicht geklärt.' }}</p>
                </div>
              </li>
              <li class="vb-story-step vb-story-step--goal">
                <span class="vb-story-icon"><Target :size="20" aria-hidden="true" /></span>
                <div class="vb-story-copy">
                  <span class="vb-story-kicker">03 · Gewünschtes Ergebnis</span>
                  <h3>Was soll sich verbessern?</h3>
                  <p class="vb-story-main">{{ draft.outcome || 'Das gewünschte Ergebnis ist noch offen.' }}</p>
                </div>
              </li>
              <li class="vb-story-step vb-story-step--change">
                <span class="vb-story-icon"><Workflow :size="20" aria-hidden="true" /></span>
                <div class="vb-story-copy">
                  <span class="vb-story-kicker">04 · Erforderliche Veränderung</span>
                  <h3>Was muss sich dafür ändern?</h3>
                  <p class="vb-story-main">{{ draft.change || 'Die notwendige Veränderung ist noch offen.' }}</p>
                </div>
              </li>
              <li class="vb-story-step vb-story-step--metric">
                <span class="vb-story-icon"><ChartColumnIncreasing :size="20" aria-hidden="true" /></span>
                <div class="vb-story-copy">
                  <span class="vb-story-kicker">05 · Metrics</span>
                  <h3>Woran erkennen wir den Unterschied?</h3>
                  <div class="vb-story-indicators">
                    <div v-for="metric in draft.metrics" :key="metric.id" class="vb-story-indicator">
                      <strong>{{ metric.name || 'Messgröße noch offen' }}</strong>
                      <div class="vb-story-comparison">
                        <span>{{ metric.before || '?' }}</span>
                        <ArrowRight :size="18" aria-hidden="true" />
                        <span>{{ metric.after || '?' }}</span>
                        <small>{{ metric.unit }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
            <div class="vb-link vb-link--value">
              <span class="vb-value-symbol"><FileChartColumn :size="22" aria-hidden="true" /></span>
              <div class="vb-value-content">
                <span class="vb-link-label">06 · Wirtschaftliche Wirkung</span>
                <strong v-if="result.countedAnnualEur > 0">{{ money(result.countedAnnualEur) }} pro Jahr</strong>
                <strong v-else>EUR-Realisierung noch offen</strong>
                <p v-if="result.financial">
                  <span
                    >Saldo nach {{ draft.horizonMonths }} Monaten:
                    <b>{{ money(result.financial.netValueEur) }}</b></span
                  >
                  <span
                    >Anhaltender Payback:
                    <b>{{
                      result.financial.sustainedBreakEvenMonth === null
                        ? 'nicht erreicht'
                        : 'Monat ' + result.financial.sustainedBreakEvenMonth
                    }}</b>
                  </span>
                </p>
                <p v-else>Keine vollständige Modellrechnung. Nicht angerechnete Wirkungen bleiben sichtbar.</p>
                <span
                  v-if="draft.metrics.some((metric) => metric.included && metric.evidence !== 'customer-reviewed')"
                  class="vb-value-status"
                  ><CircleDashed :size="15" aria-hidden="true" /> Enthält nicht gemeinsam geprüfte Annahmen</span
                >
                <span v-else-if="result.countedAnnualEur === 0" class="vb-value-status">
                  <Lightbulb :size="15" aria-hidden="true" /> Erst Wirkung validieren, dann finanzieren
                </span>
              </div>
            </div>
          </div>
          <h3 class="vb-heading-icon">
            <ChartColumnIncreasing :size="19" aria-hidden="true" /> Nachweise und Herleitung
          </h3>
          <div v-for="metric in draft.metrics" :key="metric.id" class="vb-out-metric">
            <strong>{{ metric.name || 'Metric offen' }}</strong>
            <p class="vb-out-transition">
              <span>{{ metric.before || '?' }}</span
              ><ArrowRight :size="16" aria-hidden="true" /><span>{{ metric.after || '?' }}</span
              ><small>{{ metric.unit }}</small>
            </p>
            <p v-if="metric.calculation">Herleitung: {{ metric.calculation }}</p>
            <p class="vb-evidence-line">
              <CircleDashed :size="16" aria-hidden="true" /> {{ bridgeKindLabels[metric.kind] }} ·
              {{ bridgeEvidenceLabels[metric.evidence] }}
            </p>
            <p>Quelle: {{ metric.source || 'Noch nicht dokumentiert' }}</p>
            <p v-if="metric.included">
              Wirtschaftlich angesetzt:
              {{ metric.annualRealizedEur === null ? 'offen' : money(metric.annualRealizedEur) + '/Jahr' }} ·
              {{ metric.realization || 'Realisierungsmechanismus offen' }}
            </p>
            <p v-else>Keine EUR-Anrechnung</p>
          </div>
          <p v-if="result.issues.length" role="alert" class="vb-errors">
            Der Finanzwert ist nicht freigegeben: {{ result.issues.join(' ') }}
          </p>
          <template v-if="!customerView">
            <h3 class="vb-heading-icon"><Lightbulb :size="19" aria-hidden="true" /> Offene Validierung</h3>
            <ul v-if="result.questions.length" class="vb-questions">
              <li v-for="question in result.questions" :key="question">{{ question }}</li>
            </ul>
            <p v-else>
              Die erfassten Regeln ergeben keine weiteren Prüffragen. Fachliche Kundenbestätigung bleibt erforderlich.
            </p>
          </template>
          <p v-else class="vb-hint">
            Alle Angaben basieren auf den ausgewiesenen Datenquellen und Modellannahmen. Kundenseitig geprüfte Werte
            sind nicht extern auditiert.
          </p>
          <div class="vb-actions">
            <button type="button" class="button button-secondary button-with-icon" @click="copySummary">
              <ClipboardCopy :size="16" aria-hidden="true" /> Zusammenfassung kopieren
            </button>
            <button type="button" class="button button-primary button-with-icon" @click="exportPdf">
              <Download :size="16" aria-hidden="true" /> PDF exportieren
            </button>
          </div>
        </section>
      </div>

      <details class="vb-sources">
        <summary>Quellen und fachliche Einordnung</summary>
        <p>
          Methodische Grundlage: Andy Whyte, <em>MEDDICC</em> (Metrics, M1/M2 und Implicate the Pain); Darius
          Lahoutifard, <em>Always Be Qualifying</em> (Metrics, Identify Pain und ROI Pitch). Die konkrete Value Bridge
          und ihre Rechenregeln sind eigenständige Produktentscheidungen, keine Methode der Buchautoren.
        </p>
      </details>
    </main>
  </div>
</template>
