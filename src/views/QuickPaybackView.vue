<script setup lang="ts">
import { ArrowLeft, Calculator, ClipboardCopy, RotateCcw } from '@lucide/vue'
import { computed, ref } from 'vue'
import SoftwarePaybackPanel from '../components/SoftwarePaybackPanel.vue'

import {
  buildQuickPaybackSummary,
  calculateQuickPayback,
  formatEuro,
  formatMonths,
  type QuickPaybackInput,
} from '../domain/quickPayback'

const calculationMode = ref<'quick' | 'project'>('quick')
const upfrontInvestmentEur = ref('')
const annualRealizableBenefitEur = ref('')
const annualIncrementalOperatingCostEur = ref('0')
const copyMessage = ref('')

const inputs = computed<QuickPaybackInput>(() => ({
  upfrontInvestmentEur: upfrontInvestmentEur.value,
  annualRealizableBenefitEur: annualRealizableBenefitEur.value,
  annualIncrementalOperatingCostEur: annualIncrementalOperatingCostEur.value,
}))
const calculation = computed(() => calculateQuickPayback(inputs.value))
const model = computed(() => {
  const value = calculation.value
  return value.kind === 'empty' || value.kind === 'invalid' ? null : value
})
const message = computed(() => (model.value ? buildQuickPaybackSummary(model.value) : ''))
const isDemo = computed(
  () =>
    upfrontInvestmentEur.value === '120.000' &&
    annualRealizableBenefitEur.value === '240.000' &&
    annualIncrementalOperatingCostEur.value === '60.000',
)

function errorFor(field: keyof QuickPaybackInput): string | undefined {
  return calculation.value.kind === 'invalid' ? calculation.value.issues[field] : undefined
}

function reset() {
  upfrontInvestmentEur.value = ''
  annualRealizableBenefitEur.value = ''
  annualIncrementalOperatingCostEur.value = '0'
  copyMessage.value = ''
}

function loadDemo() {
  upfrontInvestmentEur.value = '120.000'
  annualRealizableBenefitEur.value = '240.000'
  annualIncrementalOperatingCostEur.value = '60.000'
  copyMessage.value = ''
}

async function copySummary() {
  copyMessage.value = ''
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard nicht verfügbar')
    await navigator.clipboard.writeText(message.value)
    copyMessage.value = 'Zusammenfassung kopiert.'
  } catch {
    copyMessage.value = 'Kopieren nicht möglich. Bitte die Zusammenfassung markieren und manuell kopieren.'
  }
}
</script>

<template>
  <div class="site-shell quick-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="Zurück zur MEDDPICC Toolbox">
          <span class="brand-mark">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Toolbox</strong>
            <span>Value &amp; Metrics</span>
          </span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/">
          <ArrowLeft :size="17" aria-hidden="true" />
          Alle Microtools
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="quick-main">
      <section class="container quick-hero" aria-labelledby="quick-title">
        <div class="tool-intro-meta">
          <span class="tool-kind tool-kind--customer">Kundenfähig</span>
          <span>Value &amp; Metrics · Modellrechnung</span>
        </div>
        <h1 id="quick-title">In wie vielen Monaten rechnet sich die Investition?</h1>
        <p class="intro-text">
          {{ calculationMode === 'quick'
            ? 'Drei EUR-Werte genügen für eine einfache Payback-Schätzung ab regelmäßigem Nutzenbeginn.'
            : 'Modelliere Softwareprojekt, SaaS-Kosten, Status quo und beliebig viele kundenspezifische Metrics im monatlichen Verlauf.' }}
          Die Rechnung ersetzt keinen vom Kunden validierten Business Case.
        </p>
      </section>

      <nav class="container quick-mode-choice" aria-label="Berechnungsmodus">
        <button type="button" class="button" :class="calculationMode === 'quick' ? 'button-primary' : 'button-secondary'"
          :aria-pressed="calculationMode === 'quick'" @click="calculationMode = 'quick'">
          Schnellberechnung
        </button>
        <button type="button" class="button" :class="calculationMode === 'project' ? 'button-primary' : 'button-secondary'"
          :aria-pressed="calculationMode === 'project'" @click="calculationMode = 'project'">
          Softwareprojekt &amp; Kunden-Metrics
        </button>
      </nav>
      <template v-if="calculationMode === 'quick'">
      <div class="container quick-grid">
        <section class="quick-panel quick-form" aria-labelledby="quick-input-heading">
          <div class="quick-panel-heading">
            <div>
              <p class="eyebrow">1 · Eingaben</p>
              <h2 id="quick-input-heading">Wirtschaftliche Annahmen</h2>
            </div>
            <Calculator :size="22" aria-hidden="true" />
          </div>

          <p class="quick-format-help" id="quick-format-help">
            Beträge in EUR, ohne Währungssymbol. Deutsche Schreibweise: 12345,67 oder 12.345,67.
          </p>

          <label class="field quick-field" for="quick-upfront">
            <span>Einmalige Anfangsinvestition (EUR)</span>
            <input
              id="quick-upfront"
              v-model="upfrontInvestmentEur"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              placeholder="z. B. 120.000"
              :aria-invalid="Boolean(errorFor('upfrontInvestmentEur'))"
              aria-describedby="quick-upfront-help quick-upfront-error quick-format-help"
              @input="copyMessage = ''"
            />
            <small id="quick-upfront-help">
              Einmalige Lösungskosten, Einrichtung, Implementierung und indirekte Einmalkosten. Nicht erneut jährlich
              zählen.
            </small>
            <small v-if="errorFor('upfrontInvestmentEur')" id="quick-upfront-error" class="quick-error" role="alert">
              {{ errorFor('upfrontInvestmentEur') }}
            </small>
          </label>

          <label class="field quick-field" for="quick-benefit">
            <span>Jährlicher realisierbarer Bruttonutzen (EUR/Jahr)</span>
            <input
              id="quick-benefit"
              v-model="annualRealizableBenefitEur"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              placeholder="z. B. 240.000"
              :aria-invalid="Boolean(errorFor('annualRealizableBenefitEur'))"
              aria-describedby="quick-benefit-help quick-benefit-error quick-format-help"
              @input="copyMessage = ''"
            />
            <small id="quick-benefit-help">
              Nur begründete Kostenersparnis, vermiedene Kosten oder zusätzlicher Deckungsbeitrag. Zeitgewinn ist nicht
              automatisch Geldersparnis; Mehrumsatz ist nicht Gewinn. Keine Effekte doppelt zählen.
            </small>
            <small
              v-if="errorFor('annualRealizableBenefitEur')"
              id="quick-benefit-error"
              class="quick-error"
              role="alert"
            >
              {{ errorFor('annualRealizableBenefitEur') }}
            </small>
          </label>

          <label class="field quick-field" for="quick-operating">
            <span>Jährliche zusätzliche laufende Kosten (EUR/Jahr)</span>
            <input
              id="quick-operating"
              v-model="annualIncrementalOperatingCostEur"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              :aria-invalid="Boolean(errorFor('annualIncrementalOperatingCostEur'))"
              aria-describedby="quick-operating-help quick-operating-error quick-format-help"
              @input="copyMessage = ''"
            />
            <small id="quick-operating-help">
              Zum Beispiel zusätzliche Lizenz-, Betriebs- oder Supportkosten. 0 bedeutet ausdrücklich keine angesetzten
              Mehrkosten. Bereits netto erfassten Nutzen nicht nochmals um dieselben Kosten kürzen.
            </small>
            <small
              v-if="errorFor('annualIncrementalOperatingCostEur')"
              id="quick-operating-error"
              class="quick-error"
              role="alert"
            >
              {{ errorFor('annualIncrementalOperatingCostEur') }}
            </small>
          </label>

          <div class="quick-actions">
            <button class="button button-secondary" type="button" @click="loadDemo">Fiktives Beispiel einsetzen</button>
            <button class="button button-quiet button-with-icon" type="button" @click="reset">
              <RotateCcw :size="16" aria-hidden="true" />
              Zurücksetzen
            </button>
          </div>
          <p v-if="isDemo" class="quick-demo-note">Fiktives Beispiel. Keine Kunden- oder Referenzzahlen.</p>
        </section>

        <section class="quick-panel quick-result" aria-labelledby="quick-result-heading">
          <p class="eyebrow">2 · Ergebnis</p>
          <h2 id="quick-result-heading">Einfacher Payback</h2>
          <div v-if="calculation.kind === 'empty'" class="quick-empty" role="status">
            Gib Anfangsinvestition und jährlichen Bruttonutzen ein. Die zusätzlichen laufenden Kosten sind bereits
            sichtbar mit 0 EUR vorbelegt.
          </div>
          <div v-else-if="calculation.kind === 'invalid'" class="quick-empty" role="status">
            Bitte korrigiere die markierten Beträge. Bis dahin wird kein Ergebnis berechnet.
          </div>
          <div v-else-if="model" class="quick-calculated" aria-live="polite" aria-atomic="true">
            <template v-if="model.kind === 'payback' && model.months !== null">
              <p class="quick-duration">{{ formatMonths(model.months) }} <span>Monate</span></p>
              <p class="quick-result-description">Einfacher, undiskontierter Payback ab regelmäßigem Nutzenbeginn.</p>
            </template>
            <template v-else-if="model.kind === 'zero-investment'">
              <p class="quick-duration">0,0 <span>Monate</span></p>
              <p class="quick-result-description">
                Rechnerischer Sonderfall ohne angesetzte Anfangsinvestition, keine Zusage für eine kostenlose Lösung.
              </p>
            </template>
            <template v-else-if="model.kind === 'no-payback'">
              <p class="quick-negative">Unter diesen Annahmen kein einfacher Payback erreichbar.</p>
              <p>Die jährlichen Zusatzkosten erreichen oder übersteigen den realisierbaren Bruttonutzen.</p>
            </template>
            <template v-else>
              <p class="quick-negative">Keine aussagekräftige positive Amortisation.</p>
              <p>Ohne Anfangsinvestition und positiven Nettozufluss ergibt sich kein positiver Finanznutzen.</p>
            </template>

            <dl class="quick-metrics">
              <div>
                <dt>Jährlicher Nettonutzen</dt>
                <dd>{{ formatEuro(model.annualNetBenefitEur) }} <small>/ Jahr</small></dd>
              </div>
              <div>
                <dt>Monatlicher Nettonutzen</dt>
                <dd>{{ formatEuro(model.monthlyNetBenefitEur, 4) }} <small>/ Monat</small></dd>
              </div>
              <div>
                <dt>Einmalige Anfangsinvestition</dt>
                <dd>{{ formatEuro(model.inputs.upfrontInvestmentEur) }}</dd>
              </div>
            </dl>

            <div class="quick-formula">
              <h3>Rechenweg</h3>
              <p>
                Jahresnettonutzen = {{ formatEuro(model.inputs.annualRealizableBenefitEur) }} −
                {{ formatEuro(model.inputs.annualIncrementalOperatingCostEur) }} =
                {{ formatEuro(model.annualNetBenefitEur) }}
              </p>
              <p v-if="model.kind === 'payback'">
                Monate = {{ formatEuro(model.inputs.upfrontInvestmentEur) }} ÷ ({{
                  formatEuro(model.annualNetBenefitEur)
                }}
                / 12)
              </p>
              <p v-else>Eine Division für die Payback-Dauer ist hier nicht sinnvoll.</p>
            </div>
          </div>

          <p class="quick-model-note">
            <strong>Modellgrenze:</strong> linear und undiskontiert; ab Beginn des angenommenen regelmäßigen
            Nutzenzuflusses, nicht ab Vertrag, Auszahlung oder Projektstart. Keine Anlaufphase oder variablen Cashflows.
          </p>
        </section>
      </div>

      <section v-if="model" class="container quick-panel quick-share" aria-labelledby="quick-share-heading">
        <div class="quick-share-title">
          <div>
            <p class="eyebrow">3 · Weitergeben</p>
            <h2 id="quick-share-heading">Kundenfähige Zusammenfassung</h2>
          </div>
          <button class="button button-primary button-with-icon" type="button" @click="copySummary">
            <ClipboardCopy :size="17" aria-hidden="true" />
            Zusammenfassung kopieren
          </button>
        </div>
        <p class="quick-copy-text">{{ message }}</p>
        <p class="quick-copy-status" role="status">{{ copyMessage }}</p>
      </section>

      </template>
      <SoftwarePaybackPanel v-else class="container" />

      <section class="container quick-related" aria-label="Passende Wissenshilfen">
        <h2>Was vor dem Kundengespräch zu prüfen ist</h2>
        <p>Welche Ausgangszahlen und Einsparungen sind belastbar, wer trägt den Business Pain und wer entscheidet?</p>
        <div class="quick-links">
          <RouterLink to="/knowledge/metrics">Metrics nachschlagen</RouterLink>
          <RouterLink to="/knowledge/pain-implication">Pain / Implication nachschlagen</RouterLink>
          <RouterLink to="/knowledge/economic-buyer">Economic Buyer nachschlagen</RouterLink>
        </div>
      </section>

      <section class="container quick-sources" aria-label="Quellen und fachliche Grenzen">
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="quick-sources-content">
            <p>
              <strong>Darius Lahoutifard:</strong> <em>Always Be Qualifying</em>, Chapter Nine, „ROI vs. Payback Period“
              und „The Process to Pitch the Payback Period“. Payback wird in Zeit statt als ROI-Prozentwert ausgedrückt;
              Metrics müssen wirtschaftlich übersetzt und Kosten berücksichtigt werden.
            </p>
            <p>
              <strong>Andy Whyte:</strong> <em>MEDDICC</em>, „METRICS“ und „Metrics 2 (M2's) – Return on Investment“,
              „ECONOMIC BUYER“ sowie „Economic Decision Criteria“. Kundenspezifisch validierte Wertannahmen und weitere
              Entscheidungskriterien sind notwendig.
            </p>
            <p>
              <strong>Eigene Modellentscheidung:</strong> Im Quick-Modus gilt ein gleichmäßiger Jahresnettonutzen.
              Der Projektmodus simuliert dagegen nachvollziehbare Monatswerte für Einmalkosten, SaaS, Bestandssysteme,
              Nutzenbeginn und Ramp-up. Jahreskosten werden zur wirtschaftlichen Betrachtung auf zwölf Monate verteilt;
              echte Vorauszahlungen, Liquidität, Steuern, Inflation, Finanzierung, Kapitalkosten, NPV und IRR werden
              nicht modelliert. Datenherkunft und kontrollierte Doppelzählung sind eigene Produktregeln, keine
              vermeintliche Autorenfreigabe.
            </p>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>

<style scoped>
.quick-shell .skip-link {
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(100%);
}

.quick-shell .skip-link:focus {
  width: auto;
  height: auto;
  overflow: visible;
  clip-path: none;
}

.quick-mode-choice {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}
.quick-mode-choice .button[aria-pressed='true'] { font-weight: 780; }
@media (max-width: 560px) {
  .quick-mode-choice .button { width: 100%; }
}
.quick-main {
  padding: var(--space-8) 0 var(--space-12);
}

.quick-hero {
  max-width: 940px;
  margin-bottom: var(--space-8);
}

.quick-hero h1 {
  max-width: 850px;
}

.quick-hero .intro-text {
  max-width: 790px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-5);
  align-items: start;
}

.quick-panel {
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
  box-shadow: var(--shadow-panel);
  padding: var(--space-6);
}

.quick-panel-heading,
.quick-share-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
}

.quick-panel-heading svg {
  color: var(--color-accent);
}

.quick-panel h2,
.quick-related h2 {
  margin-top: 0;
}

.quick-format-help,
.quick-field small,
.quick-demo-note,
.quick-result-description,
.quick-model-note,
.quick-copy-status {
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.quick-format-help {
  margin-bottom: var(--space-5);
}

.quick-field {
  margin-bottom: var(--space-5);
}

.quick-field > span {
  font-size: 0.93rem;
}

.quick-field input {
  min-height: 46px;
  background: var(--color-surface);
  font-size: 1rem;
}

.quick-field small {
  display: block;
  line-height: 1.5;
}

.quick-field input[aria-invalid='true'] {
  border-color: var(--color-risk);
}

.quick-field .quick-error {
  color: var(--color-risk-text);
  font-weight: 650;
}

.quick-actions,
.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.quick-demo-note {
  margin-bottom: 0;
}

.quick-result {
  background: var(--color-surface);
}

.quick-empty {
  margin: var(--space-6) 0;
  border-radius: var(--radius-control);
  background: var(--color-surface-muted);
  padding: var(--space-5);
}

.quick-duration {
  margin: var(--space-3) 0 var(--space-2);
  font-size: clamp(2.8rem, 5vw, 4.6rem);
  font-weight: 780;
  line-height: 1.1;
  letter-spacing: -0.045em;
  font-variant-numeric: tabular-nums;
}

.quick-duration span {
  font-size: 0.36em;
  font-weight: 650;
  letter-spacing: 0;
}

.quick-negative {
  margin-top: var(--space-5);
  font-size: 1.35rem;
  font-weight: 750;
  line-height: 1.35;
}

.quick-metrics {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-6) 0;
}

.quick-metrics > div {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
  border-bottom: 1px solid var(--color-divider);
  padding-bottom: var(--space-3);
}

.quick-metrics dt {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.quick-metrics dd {
  margin: 0;
  font-weight: 750;
  overflow-wrap: anywhere;
}

.quick-metrics dd small {
  color: var(--color-text-muted);
  font-weight: 500;
}

.quick-formula {
  min-width: 0;
  border-radius: var(--radius-control);
  background: var(--color-surface-muted);
  padding: var(--space-4);
}

.quick-formula h3 {
  margin: 0 0 var(--space-2);
  font-size: 1rem;
}

.quick-formula p,
.quick-copy-text,
.quick-sources-content p {
  overflow-wrap: anywhere;
}

.quick-formula p {
  margin: 0 0 var(--space-2);
  font-size: 0.9rem;
}

.quick-formula p:last-child {
  margin-bottom: 0;
}

.quick-model-note {
  margin: var(--space-5) 0 0;
  border-left: 3px solid var(--color-accent);
  padding-left: var(--space-3);
  line-height: 1.55;
}

.quick-share {
  margin-top: var(--space-6);
}

.quick-copy-text {
  max-width: 1000px;
  margin: var(--space-5) 0 0;
  line-height: 1.7;
}

.quick-copy-status {
  min-height: 1.3em;
  margin-bottom: 0;
}

.quick-related {
  margin-top: var(--space-8);
}

.quick-related h2 {
  margin-bottom: var(--space-2);
}

.quick-links a {
  color: var(--color-accent-strong);
  font-weight: 650;
}

.quick-sources {
  margin-top: var(--space-8);
}

.quick-sources details {
  padding: var(--space-4);
}

.quick-sources-content {
  margin-top: var(--space-3);
  border-top: 1px solid var(--color-divider);
}

@media (max-width: 880px) {
  .quick-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 600px) {
  .quick-main {
    padding-top: var(--space-6);
  }

  .quick-panel {
    padding: var(--space-4);
  }

  .quick-share-title {
    flex-direction: column;
  }

  .quick-share-title button,
  .quick-actions button {
    width: 100%;
  }

  .quick-duration {
    font-size: 3rem;
  }
}
</style>
