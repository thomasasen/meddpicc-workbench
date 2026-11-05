<script setup lang="ts">
import ToolRecoveryBar from '../components/ToolRecoveryBar.vue'
import { useToolRecovery } from '../composables/useToolRecovery'
import { isReverseTimelineRecovery, type ReverseTimelineRecovery } from '../services/toolRecoveryValidators'
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Download,
  FileImage,
  GripVertical,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
} from '@lucide/vue'
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'

import CustomerTimelineChart from '../components/CustomerTimelineChart.vue'
import {
  calculateReverseTimeline,
  type ReverseTimelineStepInput,
  type TimelineArea,
  type TimelineDurationUnit,
  type TimelineOwner,
} from '../domain/reverseTimeline'
import { buildCustomerTimelineSvg, downloadTimelinePng, downloadTimelineSvg } from '../services/timelineExport'
import { loadBrandForReport } from '../services/brandProfileStore'

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
const planTitle = ref('Go-Live-Timeline')
const referenceDate = ref(localTodayIso())
const targetGoLiveDate = ref('')
const compellingEvent = ref('')
const steps = ref<EditableStep[]>(starterSteps())
const exportMessage = ref('')
const exportBusy = ref(false)
const draggingStepId = ref<string | null>(null)
const dragTargetIndex = ref<number | null>(null)
const dragOffsetY = ref(0)
const reorderAnnouncement = ref('')
let stepCounter = 0

interface DragSession {
  pointerId: number
  originY: number
  originIndex: number
  baseOffsetY: number
  height: number
  gap: number
  centers: number[]
  handle: HTMLElement
}

let dragSession: DragSession | null = null

function stepCards(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.reverse-step-card'))
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function cardPositions(): Map<string, number> {
  return new Map(
    stepCards()
      .filter((card) => card.dataset.stepId)
      .map((card) => [card.dataset.stepId as string, card.getBoundingClientRect().top]),
  )
}

/** The release starts at each card's actual on-screen position, not its layout target. */
function settleDroppedCards(previous: Map<string, number>): void {
  if (prefersReducedMotion()) return

  void nextTick(() => {
    for (const card of stepCards()) {
      const oldTop = previous.get(card.dataset.stepId ?? '')
      if (oldTop === undefined || typeof card.animate !== 'function') continue

      const difference = oldTop - card.getBoundingClientRect().top
      if (Math.abs(difference) < 1) continue

      const animation = card.animate(
        [{ transform: `translate3d(0, ${difference}px, 0)` }, { transform: 'translate3d(0, 0, 0)' }],
        {
          duration: 260,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        },
      )
      animation.onfinish = () => animation.cancel()
    }
  })
}

const calculation = computed(() =>
  calculateReverseTimeline({
    targetGoLiveDate: targetGoLiveDate.value,
    referenceDate: referenceDate.value,
    compellingEvent: compellingEvent.value,
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
    ownerDetail: '',
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

/** Only the active card follows the pointer. Neighboring cards preview the insertion slot. */
function isPreviewShifted(index: number): boolean {
  if (!dragSession || dragTargetIndex.value === null) return false

  const origin = dragSession.originIndex
  const target = dragTargetIndex.value
  return origin < target ? index > origin && index <= target : index >= target && index < origin
}

function stepDragStyle(stepId: string, index: number): Record<string, string> | undefined {
  if (!dragSession || !draggingStepId.value) return undefined

  if (stepId === draggingStepId.value) {
    return { '--drag-offset-y': `${dragOffsetY.value}px` }
  }
  if (!isPreviewShifted(index)) return undefined

  const direction = dragSession.originIndex < (dragTargetIndex.value ?? 0) ? -1 : 1
  const distance = direction * (dragSession.height + dragSession.gap)
  return { '--neighbor-offset-y': `${distance}px` }
}

function startStepDrag(event: PointerEvent, index: number): void {
  if (dragSession || (event.pointerType === 'mouse' && event.button !== 0)) return

  const handle = event.currentTarget as HTMLElement
  const card = handle.closest<HTMLElement>('.reverse-step-card')
  if (!card) return

  // Interrupt a still-settling card without snapping it back to its layout position.
  const beforeCancel = card.getBoundingClientRect().top
  for (const animation of card.getAnimations()) animation.cancel()
  const baseOffsetY = beforeCancel - card.getBoundingClientRect().top
  const cards = stepCards()
  const rect = card.getBoundingClientRect()
  const gap = Number.parseFloat(getComputedStyle(card.parentElement as HTMLElement).rowGap) || 0

  dragSession = {
    pointerId: event.pointerId,
    originY: event.clientY,
    originIndex: index,
    baseOffsetY,
    height: rect.height,
    gap,
    centers: cards.map((item) => {
      const bounds = item.getBoundingClientRect()
      return bounds.top + bounds.height / 2
    }),
    handle,
  }
  draggingStepId.value = steps.value[index].id
  dragTargetIndex.value = index
  dragOffsetY.value = baseOffsetY

  try {
    handle.setPointerCapture(event.pointerId)
  } catch {
    // Synthetic pointer events in Playwright may not create an active native pointer.
  }
}

function moveDraggedStep(event: PointerEvent): void {
  const session = dragSession
  if (!session || session.pointerId !== event.pointerId) return

  if (event.cancelable) event.preventDefault()
  dragOffsetY.value = session.baseOffsetY + event.clientY - session.originY

  let nearest = session.originIndex
  let nearestDistance = Number.POSITIVE_INFINITY
  session.centers.forEach((center, index) => {
    const distance = Math.abs(event.clientY - center)
    if (distance < nearestDistance) {
      nearest = index
      nearestDistance = distance
    }
  })
  dragTargetIndex.value = nearest
}

function finishStepDrag(event: PointerEvent): void {
  const session = dragSession
  if (!session || session.pointerId !== event.pointerId) return

  const previous = cardPositions()
  const target = dragTargetIndex.value
  if (event.type === 'pointerup' && target !== null) {
    reorderStep(session.originIndex, target)
  }

  try {
    if (session.handle.hasPointerCapture(event.pointerId)) session.handle.releasePointerCapture(event.pointerId)
  } catch {
    // Capture may already have ended after cancellation.
  }

  dragSession = null
  draggingStepId.value = null
  dragTargetIndex.value = null
  dragOffsetY.value = 0
  settleDroppedCards(previous)
}

onBeforeUnmount(() => {
  if (dragSession) {
    try {
      if (dragSession.handle.hasPointerCapture(dragSession.pointerId)) {
        dragSession.handle.releasePointerCapture(dragSession.pointerId)
      }
    } catch {
      // A detached element may have lost capture already.
    }
  }
  dragSession = null
})

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

function ownerDisplay(step: ReverseTimelineStepInput): string {
  const detail = step.ownerDetail?.trim()
  return detail ? `${ownerLabels[step.owner]} · ${detail}` : ownerLabels[step.owner]
}

function formatDate(isoDate: string): string {
  if (!isoDate) return '–'
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year}`
}

function fileBaseName(): string {
  const raw = customerName.value.trim() || planTitle.value.trim() || 'go-live-timeline'
  return (
    raw
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'go-live-timeline'
  )
}

async function exportTimeline(kind: 'svg' | 'png'): Promise<void> {
  if (exportBusy.value || !plan.value) return
  exportBusy.value = true
  exportMessage.value = ''
  try {
    const { profile, warning } = await loadBrandForReport()
    const svg = buildCustomerTimelineSvg(plan.value, {
      title: planTitle.value,
      customerName: customerName.value,
      brand: profile,
    })
    if (kind === 'svg') {
      downloadTimelineSvg(svg, `${fileBaseName()}-timeline.svg`)
    } else {
      await downloadTimelinePng(svg, `${fileBaseName()}-timeline.png`)
    }
    exportMessage.value =
      (kind === 'svg' ? 'SVG' : 'PNG') +
      ' wurde für die Weiterverwendung in Präsentationen erzeugt.' +
      (warning ? ' ' + warning : '')
  } catch (error) {
    exportMessage.value = error instanceof Error ? error.message : 'Export ist fehlgeschlagen.'
  } finally {
    exportBusy.value = false
  }
}
const recovery = useToolRecovery<ReverseTimelineRecovery>({
  toolId: 'reverse-timeline',
  read: () => ({
    customerName: customerName.value,
    planTitle: planTitle.value,
    referenceDate: referenceDate.value,
    targetGoLiveDate: targetGoLiveDate.value,
    compellingEvent: compellingEvent.value,
    steps: steps.value,
  }),
  restore: (value) => {
    customerName.value = value.customerName
    planTitle.value = value.planTitle
    referenceDate.value = value.referenceDate
    targetGoLiveDate.value = value.targetGoLiveDate
    compellingEvent.value = value.compellingEvent
    steps.value = value.steps
  },
  validate: isReverseTimelineRecovery,
  isMeaningful: (value) =>
    Boolean(
      value.customerName.trim() ||
      value.targetGoLiveDate ||
      value.compellingEvent.trim() ||
      value.planTitle !== 'Go-Live-Timeline' ||
      value.referenceDate !== localTodayIso() ||
      JSON.stringify(value.steps) !== JSON.stringify(starterSteps()),
    ),
})
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

      <ToolRecoveryBar :recovery="recovery" class="container" />

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
          <label class="field reverse-compelling-event">
            <span>Warum dieses Datum? <small>optional</small></span>
            <input
              v-model="compellingEvent"
              type="text"
              maxlength="240"
              placeholder="z. B. Altvertrag endet am 30.06."
            />
            <small>Kundenseitiger Treiber / Compelling Event – kein internes Quartalsziel</small>
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
            :class="{
              'reverse-step-card--dragging': draggingStepId === step.id,
              'reverse-step-card--shifting': isPreviewShifted(index),
              'reverse-step-card--drop-target': dragTargetIndex === index && draggingStepId !== step.id,
            }"
            :style="stepDragStyle(step.id, index)"
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
              <label class="field reverse-step-owner-detail">
                <span>Name / Rolle <small>optional</small></span>
                <input
                  v-model="step.ownerDetail"
                  type="text"
                  maxlength="120"
                  placeholder="z. B. Einkauf, Dr. Müller / Legal"
                />
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
            <RouterLink class="button button-quiet button-with-icon" to="/settings">
              <Settings :size="16" aria-hidden="true" /> Einstellungen
            </RouterLink>
            <button
              class="button button-secondary button-with-icon"
              type="button"
              :disabled="exportBusy"
              @click="exportTimeline('svg')"
            >
              <Download :size="16" aria-hidden="true" />
              SVG
            </button>
            <button
              class="button button-primary button-with-icon"
              type="button"
              :disabled="exportBusy"
              @click="exportTimeline('png')"
            >
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
                    <span>{{ areaLabels[segment.area] }} · {{ ownerDisplay(segment) }}</span>
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
            Methodik-Hinweis: Die Timeline zeigt einen konservativen sequenziellen Basisplan aus den eingegebenen
            Schritten. Feiertage und kundenspezifische Sperrzeiten sind nicht automatisch eingerechnet. Parallelisierung
            und echte Abhängigkeits-/Critical-Path-Logik gehören bewusst nicht zu dieser Version.
          </p>
        </template>
      </section>
    </main>
  </div>
</template>
