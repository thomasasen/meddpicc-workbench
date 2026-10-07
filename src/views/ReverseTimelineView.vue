<script setup lang="ts">
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CalendarDays,
  Download,
  FileImage,
  Plus,
  RotateCcw,
  Trash2,
} from '@lucide/vue'
import { computed, ref } from 'vue'

import {
  calculateReverseTimeline,
  type ReverseTimelineStepInput,
  type TimelineArea,
  type TimelineDurationUnit,
  type TimelineOwner,
} from '../domain/reverseTimeline'
import {
  buildCustomerTimelineSvg,
  downloadTimelinePng,
  downloadTimelineSvg,
} from '../services/timelineExport'

type EditableStep = ReverseTimelineStepInput

const ownerLabels: Record<TimelineOwner, string> = {
  customer: 'Kunde',
  seller: 'Anbieter',
  shared: 'Gemeinsam',
}

const areaLabels: Record<TimelineArea, string> = {
  'decision-process': 'Decision Process',
  'paper-process': 'Paper Process',
  implementation: 'Implementierung',
}

const durationUnitLabels: Record<TimelineDurationUnit, string> = {
  'calendar-days': 'Kalendertage',
  'business-days': 'Arbeitstage',
}

function localTodayIso(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function starterSteps(): EditableStep[] {
  return [
    {
      id: 'implementation',
      label: 'Implementierung / Rollout',
      duration: 60,
      durationUnit: 'business-days',
      owner: 'shared',
      area: 'implementation',
    },
    {
      id: 'contract',
      label: 'Vertrag & Unterschrift',
      duration: 5,
      durationUnit: 'business-days',
      owner: 'shared',
      area: 'paper-process',
    },
    {
      id: 'legal',
      label: 'Legal / Datenschutz',
      duration: 15,
      durationUnit: 'business-days',
      owner: 'customer',
      area: 'paper-process',
    },
    {
      id: 'procurement',
      label: 'Einkauf / Procurement',
      duration: 10,
      durationUnit: 'business-days',
      owner: 'customer',
      area: 'paper-process',
    },
    {
      id: 'final-decision',
      label: 'Finale Entscheidung',
      duration: 5,
      durationUnit: 'business-days',
      owner: 'customer',
      area: 'decision-process',
    },
  ]
}

const customerName = ref('')
const planTitle = ref('Go-Live-Plan')
const referenceDate = ref(localTodayIso())
const targetGoLiveDate = ref('')
const steps = ref<EditableStep[]>(starterSteps())
const exportMessage = ref('')
let stepCounter = 0

const calculation = computed(() =>
  calculateReverseTimeline({
    targetGoLiveDate: targetGoLiveDate.value,
    referenceDate: referenceDate.value,
    steps: steps.value,
  }),
)

const plan = computed(() => (calculation.value.success ? calculation.value.plan : null))
const issues = computed(() => (calculation.value.success ? [] : calculation.value.issues))

function addStep() {
  stepCounter += 1
  steps.value.push({
    id: `custom-${Date.now()}-${stepCounter}`,
    label: 'Neuer Schritt',
    duration: 5,
    durationUnit: 'business-days',
    owner: 'shared',
    area: 'decision-process',
  })
}

function removeStep(index: number) {
  if (steps.value.length <= 1) return
  steps.value.splice(index, 1)
}

function moveStep(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= steps.value.length) return
  const [step] = steps.value.splice(index, 1)
  steps.value.splice(target, 0, step)
}

function resetStarterSteps() {
  steps.value = starterSteps()
}

function formatDate(isoDate: string): string {
  if (!isoDate) return '–'
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year}`
}

function fileBaseName(): string {
  const raw = customerName.value.trim() || planTitle.value.trim() || 'go-live-plan'
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'go-live-plan'
}

function svgForExport(): string | null {
  if (!plan.value) return null
  return buildCustomerTimelineSvg(plan.value, {
    title: planTitle.value,
    customerName: customerName.value,
  })
}

function exportSvg() {
  const svg = svgForExport()
  if (!svg) return
  downloadTimelineSvg(svg, `${fileBaseName()}-timeline.svg`)
  exportMessage.value = 'SVG wurde für die Weiterverwendung in Präsentationen erzeugt.'
}

async function exportPng() {
  const svg = svgForExport()
  if (!svg) return

  try {
    await downloadTimelinePng(svg, `${fileBaseName()}-timeline.png`)
    exportMessage.value = 'PNG wurde für die Weiterverwendung in Präsentationen erzeugt.'
  } catch (error) {
    exportMessage.value = error instanceof Error ? error.message : 'PNG-Export ist fehlgeschlagen.'
  }
}

function segmentFlex(span: number): string {
  return String(Math.max(span, 2))
}

function statusText(): string {
  if (!plan.value) return ''
  if (plan.value.status === 'target-before-reference') {
    return 'Das Target Go-Live liegt vor dem Planungsdatum.'
  }
  if (plan.value.status === 'compression-required') {
    return `Der späteste errechnete Start liegt ${Math.abs(plan.value.calendarDaysToLatestStart)} Kalendertage vor dem Planungsdatum. Der Plan benötigt Kompression, Parallelisierung oder einen späteren Go-Live.`
  }
  return `Bis zum spätesten errechneten Start verbleiben ${plan.value.calendarDaysToLatestStart} Kalendertage.`
}
</script>

<template>
  <div class="site-shell reverse-tool-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="Zurück zur MEDDPICC Toolbox">
          <span class="brand-mark">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Toolbox</strong>
            <span>Decision Process</span>
          </span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/">
          <ArrowLeft :size="17" aria-hidden="true" />
          Alle Microtools
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="reverse-tool-main">
      <section class="container tool-intro" aria-labelledby="reverse-title">
        <div>
          <div class="tool-intro-meta">
            <span class="tool-kind tool-kind--customer">Kundenfähig</span>
            <span>Decision Process · Paper Process</span>
          </div>
          <h1 id="reverse-title">Go-Live-Rückwärtsplanung</h1>
          <p class="intro-text">
            Plane gemeinsam mit dem Kunden vom gewünschten Go-Live rückwärts. Jeder Schritt hat eine Dauer,
            Verantwortlichkeit und MEDDPICC-Einordnung. So wird sichtbar, wann Entscheidungen, Procurement, Legal und
            Umsetzung spätestens beginnen müssen.
          </p>
        </div>
        <aside class="tool-source-note">
          <CalendarDays :size="22" aria-hidden="true" />
          <p>
            Die Berechnung ist rein deterministisch. Arbeitstage berücksichtigen Montag bis Freitag; Feiertage werden
            in v0.1 bewusst nicht automatisch eingerechnet.
          </p>
        </aside>
      </section>

      <section class="container reverse-config" aria-labelledby="plan-input-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">1 · Eingaben</p>
            <h2 id="plan-input-title">Planungsrahmen</h2>
          </div>
        </div>

        <div class="reverse-context-grid">
          <label class="field">
            <span>Kunde <small>optional</small></span>
            <input v-model="customerName" type="text" maxlength="200" placeholder="z. B. Beispielwerke GmbH" />
          </label>
          <label class="field">
            <span>Titel</span>
            <input v-model="planTitle" type="text" maxlength="200" />
          </label>
          <label class="field">
            <span>Planungsdatum</span>
            <input v-model="referenceDate" type="date" required />
            <small>Referenz für die Vorlaufprüfung</small>
          </label>
          <label class="field">
            <span>Target Go-Live</span>
            <input v-model="targetGoLiveDate" type="date" required />
            <small>Von diesem Kundenziel wird rückwärts gerechnet</small>
          </label>
        </div>
      </section>

      <section class="container reverse-steps-section" aria-labelledby="steps-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">2 · Prozess</p>
            <h2 id="steps-title">Schritte vom Go-Live rückwärts</h2>
            <p class="section-note">
              Der oberste Schritt liegt direkt vor dem Go-Live. Darunter folgen die jeweils früher notwendigen Schritte.
            </p>
          </div>
          <div class="reverse-step-actions">
            <button class="button button-secondary button-with-icon" type="button" @click="resetStarterSteps">
              <RotateCcw :size="16" aria-hidden="true" />
              Vorlage zurücksetzen
            </button>
            <button class="button button-primary button-with-icon" type="button" @click="addStep">
              <Plus :size="16" aria-hidden="true" />
              Schritt hinzufügen
            </button>
          </div>
        </div>

        <div class="reverse-step-list">
          <article v-for="(step, index) in steps" :key="step.id" class="reverse-step-card">
            <div class="reverse-step-position" :aria-label="`Position ${index + 1}`">{{ index + 1 }}</div>

            <div class="reverse-step-fields">
              <label class="field reverse-step-name">
                <span>Schritt</span>
                <input v-model="step.label" type="text" maxlength="160" />
              </label>
              <label class="field">
                <span>Dauer</span>
                <input v-model.number="step.duration" type="number" min="0" max="1000" step="1" inputmode="numeric" />
              </label>
              <label class="field">
                <span>Einheit</span>
                <select v-model="step.durationUnit">
                  <option value="business-days">Arbeitstage</option>
                  <option value="calendar-days">Kalendertage</option>
                </select>
              </label>
              <label class="field">
                <span>Verantwortlich</span>
                <select v-model="step.owner">
                  <option value="customer">Kunde</option>
                  <option value="seller">Anbieter</option>
                  <option value="shared">Gemeinsam</option>
                </select>
              </label>
              <label class="field">
                <span>Bereich</span>
                <select v-model="step.area">
                  <option value="decision-process">Decision Process</option>
                  <option value="paper-process">Paper Process</option>
                  <option value="implementation">Implementierung</option>
                </select>
              </label>
            </div>

            <div class="reverse-step-controls" aria-label="Schritt sortieren oder entfernen">
              <button class="icon-action" type="button" :disabled="index === 0" :aria-label="`${step.label} nach oben`" @click="moveStep(index, -1)">
                <ArrowUp :size="17" aria-hidden="true" />
              </button>
              <button class="icon-action" type="button" :disabled="index === steps.length - 1" :aria-label="`${step.label} nach unten`" @click="moveStep(index, 1)">
                <ArrowDown :size="17" aria-hidden="true" />
              </button>
              <button class="icon-action icon-action--danger" type="button" :disabled="steps.length <= 1" :aria-label="`${step.label} entfernen`" @click="removeStep(index)">
                <Trash2 :size="17" aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="container reverse-result-section" aria-labelledby="result-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">3 · Ergebnis</p>
            <h2 id="result-title">Kundenfähige Timeline</h2>
          </div>
          <div v-if="plan" class="reverse-export-actions">
            <button class="button button-secondary button-with-icon" type="button" @click="exportSvg">
              <Download :size="16" aria-hidden="true" />
              SVG
            </button>
            <button class="button button-primary button-with-icon" type="button" @click="exportPng">
              <FileImage :size="16" aria-hidden="true" />
              PNG
            </button>
          </div>
        </div>

        <div v-if="!targetGoLiveDate" class="tool-empty-state">
          <CalendarDays :size="28" aria-hidden="true" />
          <strong>Target Go-Live eintragen</strong>
          <p>Danach wird die Timeline sofort aus den angegebenen Dauern rückwärts berechnet.</p>
        </div>

        <div v-else-if="issues.length" class="project-message project-message--error" role="alert">
          <div>
            <strong>Die Timeline kann noch nicht berechnet werden.</strong>
            <ul>
              <li v-for="issue in issues" :key="issue">{{ issue }}</li>
            </ul>
          </div>
        </div>

        <template v-else-if="plan">
          <div class="reverse-summary-grid">
            <div>
              <span>Spätester Start</span>
              <strong>{{ formatDate(plan.latestStartDate) }}</strong>
            </div>
            <div>
              <span>Target Go-Live</span>
              <strong>{{ formatDate(plan.targetGoLiveDate) }}</strong>
            </div>
            <div :class="`reverse-plan-status reverse-plan-status--${plan.status}`">
              <span>Vorlaufprüfung</span>
              <strong>{{ statusText() }}</strong>
            </div>
          </div>

          <div class="customer-timeline" aria-label="Visuelle Go-Live-Timeline">
            <div class="customer-timeline-heading">
              <div>
                <strong>{{ planTitle || 'Go-Live-Plan' }}</strong>
                <span v-if="customerName">{{ customerName }}</span>
              </div>
              <span>Go-Live {{ formatDate(plan.targetGoLiveDate) }}</span>
            </div>

            <div class="timeline-axis" aria-hidden="true">
              <span>{{ formatDate(plan.latestStartDate) }}</span>
              <span>Go-Live {{ formatDate(plan.targetGoLiveDate) }}</span>
            </div>

            <div class="timeline-bars" aria-hidden="true">
              <div
                v-for="segment in plan.chronologicalSegments"
                :key="segment.id"
                class="timeline-bar"
                :class="`timeline-bar--${segment.area}`"
                :style="{ flexGrow: segmentFlex(segment.calendarSpanDays) }"
                :title="`${segment.label}: ${formatDate(segment.startDate)} bis ${formatDate(segment.endDate)}`"
              >
                <span>{{ segment.label }}</span>
              </div>
            </div>

            <ol class="timeline-detail-list">
              <li v-for="segment in plan.chronologicalSegments" :key="segment.id">
                <div>
                  <strong>{{ segment.label }}</strong>
                  <span>{{ areaLabels[segment.area] }} · {{ ownerLabels[segment.owner] }}</span>
                </div>
                <div class="timeline-detail-dates">
                  <strong>{{ formatDate(segment.startDate) }} → {{ formatDate(segment.endDate) }}</strong>
                  <span>{{ segment.duration }} {{ durationUnitLabels[segment.durationUnit] }}</span>
                </div>
              </li>
            </ol>
          </div>

          <p v-if="exportMessage" class="export-message" role="status">{{ exportMessage }}</p>

          <p class="timeline-method-note">
            Methodik-Hinweis: Die Timeline bildet Dauer und Reihenfolge der eingegebenen Schritte ab. Feiertage,
            kundenspezifische Sperrzeiten und parallele Abhängigkeiten müssen in v0.1 über eigene Schritte bzw. angepasste
            Dauern berücksichtigt werden.
          </p>
        </template>
      </section>
    </main>
  </div>
</template>
