<script setup lang="ts">
import { ArrowDown, ArrowLeft, ArrowUp, Download, Plus, Printer, RotateCcw, Trash2 } from '@lucide/vue'
import { computed, ref } from 'vue'

import {
  calculateReverseTimeline,
  type ReverseTimelineResult,
  type ReverseTimelineStepInput,
} from '../domain/reverseTimeline'
import { downloadSvgElement, downloadSvgElementAsPng, safeExportFileName } from '../services/visualExport'

type EditableStep = ReverseTimelineStepInput

const exampleSteps = (): EditableStep[] => [
  { id: 'implementation', title: 'Implementierung', owner: 'Projektteam', durationBusinessDays: 65 },
  { id: 'contract', title: 'Vertrag & Signatur', owner: 'Legal / Einkauf', durationBusinessDays: 5 },
  {
    id: 'legal',
    title: 'Legal, Datenschutz & Security',
    owner: 'Legal / DSB / IT-Security',
    durationBusinessDays: 15,
  },
  { id: 'procurement', title: 'Procurement / Bestellung', owner: 'Einkauf', durationBusinessDays: 10 },
  { id: 'decision', title: 'Finale Entscheidung', owner: 'Buying Committee', durationBusinessDays: 5 },
]

const planTitle = ref('Gemeinsamer Go-Live-Plan')
const customerName = ref('Beispielkunde')
const targetGoLiveDate = ref('2027-07-01')
const steps = ref<EditableStep[]>(exampleSteps())
const nextCustomStep = ref(1)
const timelineSvg = ref<SVGSVGElement | null>(null)
const exportError = ref('')

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return dateFormatter.format(new Date(Date.UTC(year, month - 1, day)))
}

const validationMessage = computed(() => {
  if (!targetGoLiveDate.value) return 'Bitte ein Ziel-Go-Live angeben.'
  if (steps.value.length === 0) return 'Bitte mindestens einen Schritt anlegen.'
  if (steps.value.some((step) => !step.title.trim())) return 'Jeder Schritt benötigt einen Titel.'
  if (
    steps.value.some((step) => !Number.isInteger(step.durationBusinessDays) || Number(step.durationBusinessDays) < 1)
  ) {
    return 'Jeder Schritt benötigt mindestens einen ganzen Arbeitstag.'
  }
  return ''
})

const timeline = computed<ReverseTimelineResult | null>(() => {
  if (validationMessage.value) return null

  try {
    return calculateReverseTimeline({
      targetGoLiveDate: targetGoLiveDate.value,
      steps: steps.value,
    })
  } catch {
    return null
  }
})

const svgHeight = computed(() => 190 + (timeline.value?.steps.length ?? 0) * 76)

function dateMs(value: string): number {
  return Date.parse(value + 'T00:00:00Z')
}

function plotX(value: string): number {
  if (!timeline.value) return 330
  const first = dateMs(timeline.value.latestStartDate)
  const last = dateMs(timeline.value.targetGoLiveDate)
  const span = Math.max(1, last - first)
  return 330 + ((dateMs(value) - first) / span) * 820
}

function barWidth(start: string, end: string): number {
  return Math.max(6, plotX(end) - plotX(start))
}

function truncate(value: string, max = 42): string {
  return value.length > max ? value.slice(0, max - 1) + '…' : value
}

function addStep() {
  steps.value.push({
    id: 'custom_' + nextCustomStep.value++,
    title: 'Neuer Schritt',
    owner: '',
    durationBusinessDays: 5,
  })
}

function removeStep(index: number) {
  steps.value.splice(index, 1)
}

function moveStep(index: number, offset: number) {
  const target = index + offset
  if (target < 0 || target >= steps.value.length) return
  const copy = [...steps.value]
  ;[copy[index], copy[target]] = [copy[target], copy[index]]
  steps.value = copy
}

function resetExample() {
  planTitle.value = 'Gemeinsamer Go-Live-Plan'
  customerName.value = 'Beispielkunde'
  targetGoLiveDate.value = '2027-07-01'
  steps.value = exampleSteps()
  exportError.value = ''
}

function exportBaseName(): string {
  return safeExportFileName((customerName.value || 'kunde') + '-' + (planTitle.value || 'go-live-plan'))
}

function exportSvg() {
  if (!timelineSvg.value) return
  downloadSvgElement(timelineSvg.value, exportBaseName() + '.svg')
}

async function exportPng() {
  if (!timelineSvg.value) return
  exportError.value = ''

  try {
    await downloadSvgElementAsPng(timelineSvg.value, exportBaseName() + '.png')
  } catch (error) {
    exportError.value = error instanceof Error ? error.message : 'PNG konnte nicht erzeugt werden.'
  }
}

function printPlan() {
  window.print()
}
</script>

<template>
  <div class="toolbox-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="toolbox-header no-print">
      <div class="container toolbox-header-inner">
        <RouterLink class="toolbox-brand" to="/">
          <span class="toolbox-brand-mark" aria-hidden="true">M</span>
          <span>
            <strong>MEDDPICC Toolbox</strong>
            <small>Decision Process</small>
          </span>
        </RouterLink>
        <RouterLink class="back-link" to="/">
          <ArrowLeft :size="17" aria-hidden="true" />
          Alle Werkzeuge
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="container tool-page">
      <section class="tool-intro no-print">
        <p class="eyebrow">Decision Process · kundenfähig</p>
        <h1>Go-Live-Rückwärtsplanung</h1>
        <p>
          Vom gewünschten Go-Live rückwärts planen. So werden späteste Startpunkte für Entscheidung, Procurement, Legal,
          Signatur und Implementierung sichtbar, bevor der Zeitplan unrealistisch wird.
        </p>
      </section>

      <div class="tool-layout">
        <section class="tool-editor no-print" aria-labelledby="input-title">
          <div class="panel-heading">
            <div>
              <p class="panel-kicker">Eingaben</p>
              <h2 id="input-title">Nur das, was diese Planung braucht</h2>
            </div>
            <button class="button button-quiet button-with-icon" type="button" @click="resetExample">
              <RotateCcw :size="16" aria-hidden="true" />
              Beispiel
            </button>
          </div>

          <div class="basic-input-grid">
            <label>
              <span>Titel</span>
              <input v-model="planTitle" type="text" maxlength="120" />
            </label>
            <label>
              <span>Kunde / Projekt <small>optional</small></span>
              <input v-model="customerName" type="text" maxlength="120" />
            </label>
            <label>
              <span>Ziel-Go-Live</span>
              <input v-model="targetGoLiveDate" type="date" required />
            </label>
          </div>

          <div class="steps-heading">
            <div>
              <h3>Schritte rückwärts vom Go-Live</h3>
              <p>Schritt 1 liegt direkt vor dem Go-Live. Danach folgen die jeweils früheren Voraussetzungen.</p>
            </div>
            <button class="button button-secondary button-with-icon" type="button" @click="addStep">
              <Plus :size="16" aria-hidden="true" />
              Schritt
            </button>
          </div>

          <ol class="step-editor-list">
            <li v-for="(step, index) in steps" :key="step.id" class="step-editor-row">
              <span class="step-number">{{ index + 1 }}</span>

              <label class="step-title-field">
                <span>Titel</span>
                <input v-model="step.title" type="text" maxlength="100" />
              </label>

              <label>
                <span>Owner <small>optional</small></span>
                <input v-model="step.owner" type="text" maxlength="100" />
              </label>

              <label class="duration-field">
                <span>Arbeitstage</span>
                <input v-model.number="step.durationBusinessDays" type="number" min="1" max="500" step="1" />
              </label>

              <div class="step-actions" aria-label="Schritt anordnen oder entfernen">
                <button
                  class="icon-button"
                  type="button"
                  :disabled="index === 0"
                  :aria-label="step.title + ' näher zum Go-Live verschieben'"
                  @click="moveStep(index, -1)"
                >
                  <ArrowUp :size="16" aria-hidden="true" />
                </button>
                <button
                  class="icon-button"
                  type="button"
                  :disabled="index === steps.length - 1"
                  :aria-label="step.title + ' weiter vom Go-Live entfernen'"
                  @click="moveStep(index, 1)"
                >
                  <ArrowDown :size="16" aria-hidden="true" />
                </button>
                <button
                  class="icon-button icon-button--danger"
                  type="button"
                  :aria-label="step.title + ' entfernen'"
                  @click="removeStep(index)"
                >
                  <Trash2 :size="16" aria-hidden="true" />
                </button>
              </div>
            </li>
          </ol>

          <p v-if="validationMessage" class="validation-message" role="status">{{ validationMessage }}</p>

          <p class="method-note">
            Rechenbasis v0.1: Montag bis Freitag gelten als Arbeitstage. Feiertage und kundenspezifische Betriebsferien
            sind noch nicht berücksichtigt.
          </p>
        </section>

        <section class="customer-output" aria-labelledby="result-title">
          <div class="output-toolbar no-print">
            <div>
              <p class="panel-kicker">Kundenfähiger Output</p>
              <h2 id="result-title">Go-Live-Plan</h2>
            </div>
            <div class="export-actions">
              <button
                class="button button-secondary button-with-icon"
                type="button"
                :disabled="!timeline"
                @click="exportSvg"
              >
                <Download :size="16" aria-hidden="true" />
                SVG
              </button>
              <button
                class="button button-secondary button-with-icon"
                type="button"
                :disabled="!timeline"
                @click="exportPng"
              >
                <Download :size="16" aria-hidden="true" />
                PNG
              </button>
              <button
                class="button button-secondary button-with-icon"
                type="button"
                :disabled="!timeline"
                @click="printPlan"
              >
                <Printer :size="16" aria-hidden="true" />
                PDF / Drucken
              </button>
            </div>
          </div>

          <div v-if="timeline" class="timeline-summary">
            <div>
              <span>Spätester Start</span>
              <strong data-testid="latest-start">{{ formatDate(timeline.latestStartDate) }}</strong>
            </div>
            <div>
              <span>Ziel-Go-Live</span>
              <strong>{{ formatDate(timeline.targetGoLiveDate) }}</strong>
            </div>
            <div>
              <span>Geplante Arbeitstage</span>
              <strong>{{ timeline.totalBusinessDays }}</strong>
            </div>
          </div>

          <div v-if="timeline" class="timeline-visual-scroll">
            <svg
              ref="timelineSvg"
              class="timeline-svg"
              :viewBox="'0 0 1200 ' + svgHeight"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="timeline-svg-title timeline-svg-desc"
            >
              <title id="timeline-svg-title">{{ planTitle || 'Go-Live-Plan' }}</title>
              <desc id="timeline-svg-desc">
                Rückwärts geplante Timeline vom spätesten Start bis zum Ziel-Go-Live mit Arbeitstagen und Ownern.
              </desc>

              <rect x="0" y="0" width="1200" :height="svgHeight" fill="#ffffff" rx="16" />
              <text x="28" y="42" fill="#172033" font-size="26" font-weight="700">
                {{ truncate(planTitle || 'Go-Live-Plan', 62) }}
              </text>
              <text x="28" y="70" fill="#5f6b7a" font-size="15">
                {{ truncate(customerName || 'Gemeinsame Planung', 70) }}
              </text>
              <text x="1172" y="42" text-anchor="end" fill="#172033" font-size="16" font-weight="700">
                Go-Live {{ formatDate(timeline.targetGoLiveDate) }}
              </text>
              <text x="1172" y="70" text-anchor="end" fill="#5f6b7a" font-size="13">rückwärts geplant</text>

              <line x1="330" y1="112" x2="1150" y2="112" stroke="#d7dee7" stroke-width="2" />
              <line
                x1="1150"
                y1="101"
                x2="1150"
                :y2="122 + timeline.steps.length * 76"
                stroke="#2563eb"
                stroke-width="2"
              />
              <text x="330" y="101" fill="#5f6b7a" font-size="12">{{ formatDate(timeline.latestStartDate) }}</text>
              <text x="1150" y="101" text-anchor="end" fill="#2563eb" font-size="12" font-weight="700">GO-LIVE</text>

              <g v-for="(step, index) in timeline.steps" :key="step.id">
                <line
                  x1="28"
                  :y1="146 + index * 76"
                  x2="1150"
                  :y2="146 + index * 76"
                  stroke="#eef1f5"
                  stroke-width="1"
                />
                <text x="28" :y="172 + index * 76" fill="#172033" font-size="15" font-weight="700">
                  {{ truncate(step.title, 38) }}
                </text>
                <text x="28" :y="193 + index * 76" fill="#5f6b7a" font-size="12">
                  {{ step.durationBusinessDays }} AT · {{ formatDate(step.startDate) }} – {{ formatDate(step.endDate) }}
                </text>
                <text v-if="step.owner" x="28" :y="211 + index * 76" fill="#5f6b7a" font-size="11">
                  Owner: {{ truncate(step.owner, 44) }}
                </text>

                <rect
                  :x="plotX(step.startDate)"
                  :y="159 + index * 76"
                  :width="barWidth(step.startDate, step.endDate)"
                  height="26"
                  rx="5"
                  fill="#2563eb"
                />
                <circle :cx="plotX(step.startDate)" :cy="172 + index * 76" r="4" fill="#172033" />
                <circle :cx="plotX(step.endDate)" :cy="172 + index * 76" r="4" fill="#172033" />
              </g>

              <text x="28" :y="svgHeight - 30" fill="#5f6b7a" font-size="11">
                Arbeitstage = Montag–Freitag. Feiertage/Betriebsferien sind in v0.1 nicht berücksichtigt.
              </text>
              <text x="1172" :y="svgHeight - 30" text-anchor="end" fill="#5f6b7a" font-size="11">MEDDPICC Toolbox</text>
            </svg>
          </div>

          <div v-else class="output-empty">
            <strong>Noch keine belastbare Planung.</strong>
            <span>{{ validationMessage || 'Bitte die Eingaben prüfen.' }}</span>
          </div>

          <ul v-if="timeline" class="timeline-warnings">
            <li v-for="warning in timeline.warnings" :key="warning">{{ warning }}</li>
          </ul>

          <p v-if="exportError" class="validation-message" role="alert">{{ exportError }}</p>
        </section>
      </div>
    </main>
  </div>
</template>
