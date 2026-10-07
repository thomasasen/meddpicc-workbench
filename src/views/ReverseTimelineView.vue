<script setup lang="ts">
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Download,
  FileImage,
  GripVertical,
  Plus,
  RotateCcw,
  Trash2,
} from '@lucide/vue'
import { computed, ref } from 'vue'

import CustomerTimelineChart from '../components/CustomerTimelineChart.vue'
import {
  calculateReverseTimeline,
  type ReverseTimelineStepInput,
  type TimelineArea,
  type TimelineDurationUnit,
  type TimelineOwner,
} from '../domain/reverseTimeline'
import { buildCustomerTimelineSvg, downloadTimelinePng, downloadTimelineSvg } from '../services/timelineExport'

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
const draggingStepId = ref<string | null>(null)
const reorderAnnouncement = ref('')
let activePointerId: number | null = null
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

function reorderStep(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || toIndex >= steps.value.length) return

  const [step] = steps.value.splice(fromIndex, 1)
  steps.value.splice(toIndex, 0, step)
  reorderAnnouncement.value = `${step.label} ist jetzt Position ${toIndex + 1}.`
}

function moveStep(index: number, direction: -1 | 1) {
  reorderStep(index, index + direction)
}

function stepIndexAtPoint(y: number): number {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('.reverse-step-card'))
  let closestIndex = -1
  let closestDistance = Number.POSITIVE_INFINITY

  for (const card of cards) {
    if (!card.dataset.stepId) continue

    const rect = card.getBoundingClientRect()
    const distance = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0
    if (distance >= closestDistance) continue

    const index = steps.value.findIndex((step) => step.id === card.dataset.stepId)
    if (index < 0) continue

    closestIndex = index
    closestDistance = distance
  }

  return closestIndex
}

function startStepDrag(event: PointerEvent, index: number) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  const step = steps.value[index]
  draggingStepId.value = step.id
  activePointerId = event.pointerId

  try {
    ;(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId)
  } catch {
    // Synthetic test events may not create an active browser pointer. Reordering still works without capture.
  }
}

function moveDraggedStep(event: PointerEvent) {
  if (!draggingStepId.value || event.pointerId !== activePointerId) return

  event.preventDefault()
  const fromIndex = steps.value.findIndex((step) => step.id === draggingStepId.value)
  const toIndex = stepIndexAtPoint(event.clientY)
  if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) reorderStep(fromIndex, toIndex)
}

function finishStepDrag(event: PointerEvent) {
  if (event.pointerId !== activePointerId) return

  const target = event.currentTarget as HTMLElement
  try {
    if (target.hasPointerCapture?.(event.pointerId)) target.releasePointerCapture(event.pointerId)
  } catch {
    // Pointer capture may already be gone after cancellation or a synthetic event.
  }
  draggingStepId.value = null
  activePointerId = null
}

function handleDragKey(event: KeyboardEvent, index: number) {
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveStep(index, -1)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveStep(index, 1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    reorderStep(index, 0)
  } else if (event.key === 'End') {
    event.preventDefault()
    reorderStep(index, steps.value.length - 1)
  }
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
  return (
    raw
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'go-live-plan'
  )
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
            Die Berechnung ist rein deterministisch. Arbeitstage berücksichtigen Montag bis Freitag; Feiertage werden in
            v0.1 bewusst nicht automatisch eingerechnet.
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
            <p id="reverse-step-order-help" class="section-note">
              Ziehe die Schritte am Griff in die gewünschte Reihenfolge. Der oberste Schritt liegt direkt vor dem
              Go-Live; darunter folgen die jeweils früher notwendigen Schritte.
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

        <p class="sr-only" aria-live="polite">{{ reorderAnnouncement }}</p>

        <div class="reverse-step-list" aria-describedby="reverse-step-order-help">
          <article
            v-for="(step, index) in steps"
            :key="step.id"
            class="reverse-step-card"
            :class="{ 'reverse-step-card--dragging': draggingStepId === step.id }"
            :data-step-id="step.id"
          >
            <div class="reverse-step-leading">
              <button
                class="reverse-drag-handle"
                type="button"
                :aria-label="`${step.label} verschieben. Ziehen oder Pfeiltasten verwenden.`"
                title="Ziehen zum Sortieren · Pfeiltasten für Tastatur"
                @pointerdown="startStepDrag($event, index)"
                @pointermove="moveDraggedStep"
                @pointerup="finishStepDrag"
                @pointercancel="finishStepDrag"
                @keydown="handleDragKey($event, index)"
              >
                <GripVertical :size="18" aria-hidden="true" />
              </button>
              <div class="reverse-step-position" :aria-label="`Position ${index + 1}`">{{ index + 1 }}</div>
            </div>

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

            <div class="reverse-step-controls" aria-label="Schritt entfernen">
              <button
                class="icon-action icon-action--danger"
                type="button"
                :disabled="steps.length <= 1"
                :aria-label="`${step.label} entfernen`"
                @click="removeStep(index)"
              >
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
          <div class="customer-timeline" aria-label="Visuelle Go-Live-Timeline">
            <CustomerTimelineChart :plan="plan" :title="planTitle" :customer-name="customerName" />

            <details class="timeline-details">
              <summary>
                <span>
                  <strong>Prozessdetails anzeigen</strong>
                  <small>Exakte Zeiträume, Bereiche und Verantwortlichkeiten</small>
                </span>
                <ChevronDown class="timeline-details-chevron" :size="18" aria-hidden="true" />
              </summary>

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
            </details>
          </div>

          <p v-if="exportMessage" class="export-message" role="status">{{ exportMessage }}</p>

          <p class="timeline-method-note">
            Methodik-Hinweis: Die Timeline bildet Dauer und Reihenfolge der eingegebenen Schritte ab. Feiertage,
            kundenspezifische Sperrzeiten und parallele Abhängigkeiten müssen in v0.1 über eigene Schritte bzw.
            angepasste Dauern berücksichtigt werden.
          </p>
        </template>
      </section>
    </main>
  </div>
</template>
