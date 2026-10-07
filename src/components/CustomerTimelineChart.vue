<script setup lang="ts">
import { CalendarRange, Flag } from '@lucide/vue'
import { computed } from 'vue'

import type {
  ReverseTimelinePlan,
  ReverseTimelineSegment,
  TimelineArea,
  TimelineOwner,
} from '../domain/reverseTimeline'
import { buildTimelineScale, timelineSegmentPosition, timelineTotalDays } from '../domain/timelinePresentation'

const props = defineProps<{
  plan: ReverseTimelinePlan
  title: string
  customerName: string
}>()

const areaLabels: Record<TimelineArea, string> = {
  'decision-process': 'Decision Process',
  'paper-process': 'Paper Process',
  implementation: 'Implementierung',
}

const ownerLabels: Record<TimelineOwner, string> = {
  customer: 'Kunde',
  seller: 'Anbieter',
  shared: 'Gemeinsam',
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year}`
}

const totalDays = computed(() => timelineTotalDays(props.plan))
const axisTicks = computed(() => buildTimelineScale(props.plan))

function segmentStyle(segment: ReverseTimelineSegment): Record<string, string> {
  const position = timelineSegmentPosition(props.plan, segment)

  return {
    '--segment-left': `${position.leftPercent}%`,
    '--segment-width': `${position.widthPercent}%`,
  }
}

function durationLabel(segment: ReverseTimelineSegment): string {
  const position = timelineSegmentPosition(props.plan, segment)
  const fullUnit = segment.durationUnit === 'business-days' ? 'Arbeitstage' : 'Kalendertage'
  const shortUnit = segment.durationUnit === 'business-days' ? 'AT' : 'KT'
  return position.widthPercent >= 14 ? `${segment.duration} ${fullUnit}` : `${segment.duration} ${shortUnit}`
}

const bufferLabel = computed(() => {
  if (props.plan.status === 'target-before-reference') return 'Target vor Planungsdatum'
  if (props.plan.status === 'compression-required') {
    return `Fehlen ${Math.abs(props.plan.calendarDaysToLatestStart)} Kalendertage`
  }
  return `${props.plan.calendarDaysToLatestStart} Kalendertage`
})
</script>

<template>
  <section class="executive-timeline" aria-labelledby="executive-timeline-title">
    <header class="executive-timeline-header">
      <div>
        <span class="executive-timeline-kicker">Gemeinsamer Go-Live-Plan</span>
        <h3 id="executive-timeline-title">{{ title || 'Go-Live-Plan' }}</h3>
        <p v-if="customerName">{{ customerName }}</p>
      </div>

      <div class="executive-go-live">
        <Flag :size="18" aria-hidden="true" />
        <span>Target Go-Live</span>
        <strong>{{ formatDate(plan.targetGoLiveDate) }}</strong>
      </div>
    </header>

    <div class="executive-timeline-story">
      <CalendarRange :size="18" aria-hidden="true" />
      <p>
        Um den Go-Live am <strong>{{ formatDate(plan.targetGoLiveDate) }}</strong> zu erreichen, sollte der erste
        Prozessschritt spätestens am <strong>{{ formatDate(plan.latestStartDate) }}</strong> starten.
      </p>
    </div>

    <div class="executive-kpi-strip" aria-label="Kernkennzahlen des Go-Live-Plans">
      <div>
        <span>Spätester Start</span>
        <strong>{{ formatDate(plan.latestStartDate) }}</strong>
      </div>
      <div>
        <span>Prozessdauer</span>
        <strong>{{ totalDays }} Kalendertage</strong>
      </div>
      <div :class="`executive-kpi-buffer executive-kpi-buffer--${plan.status}`">
        <span>Puffer zum notwendigen Start</span>
        <strong>{{ bufferLabel }}</strong>
      </div>
      <div>
        <span>Target Go-Live</span>
        <strong>{{ formatDate(plan.targetGoLiveDate) }}</strong>
      </div>
    </div>

    <div class="executive-timeline-meta" aria-label="Legende und Planungsfenster">
      <div class="executive-timeline-legend">
        <span><i class="area-dot area-dot--decision-process"></i>Decision Process</span>
        <span><i class="area-dot area-dot--paper-process"></i>Paper Process</span>
        <span><i class="area-dot area-dot--implementation"></i>Implementierung</span>
      </div>
      <span class="executive-window">Zeitproportionaler Prozessplan</span>
    </div>

    <div class="executive-timeline-scroll" tabindex="0" aria-label="Zeitplan horizontal anzeigen">
      <div class="executive-chart" data-testid="executive-timeline-chart" aria-hidden="true">
        <div class="executive-chart-axis">
          <div class="executive-chart-axis-label">Prozessschritt</div>
          <div class="executive-chart-axis-track">
            <span
              v-for="tick in axisTicks"
              :key="tick.date"
              class="executive-axis-tick"
              :class="[
                `executive-axis-tick--${tick.kind}`,
                { 'executive-axis-tick--end': tick.position === 100 },
              ]"
              :style="{ left: `${tick.position}%` }"
            >
              {{ tick.label }}
            </span>
          </div>
        </div>

        <div class="executive-chart-body">
          <div
            v-for="segment in plan.chronologicalSegments"
            :key="segment.id"
            class="executive-chart-row"
            :data-segment-id="segment.id"
          >
            <div class="executive-row-label">
              <strong>{{ segment.label }}</strong>
              <span>{{ ownerLabels[segment.owner] }}</span>
            </div>

            <div class="executive-row-track">
              <span
                v-for="tick in axisTicks"
                :key="`${segment.id}-${tick.date}`"
                class="executive-grid-line"
                :class="{ 'executive-grid-line--go-live': tick.position === 100 }"
                :style="{ left: `${tick.position}%` }"
              ></span>

              <div
                class="executive-segment"
                :class="`executive-segment--${segment.area}`"
                :style="segmentStyle(segment)"
                :title="`${segment.label}: ${formatDate(segment.startDate)} bis ${formatDate(segment.endDate)}`"
              >
                <span class="executive-segment-duration">{{ durationLabel(segment) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="executive-chart-footer">
          <div></div>
          <div class="executive-go-live-line-label">
            <span>Start {{ formatDate(plan.latestStartDate) }}</span>
            <strong>Go-Live {{ formatDate(plan.targetGoLiveDate) }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div class="sr-only">
      <p>
        Zeitplan von {{ formatDate(plan.latestStartDate) }} bis {{ formatDate(plan.targetGoLiveDate) }} mit
        {{ plan.chronologicalSegments.length }} Prozessschritten.
      </p>
      <ul>
        <li v-for="segment in plan.chronologicalSegments" :key="`accessible-${segment.id}`">
          {{ segment.label }}, {{ areaLabels[segment.area] }}, {{ ownerLabels[segment.owner] }},
          {{ formatDate(segment.startDate) }} bis {{ formatDate(segment.endDate) }}, {{ segment.duration }}
          {{ segment.durationUnit === 'business-days' ? 'Arbeitstage' : 'Kalendertage' }}.
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.executive-timeline {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-surface);
  box-shadow: 0 14px 34px rgb(23 32 51 / 0.07);
}

.executive-timeline-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-5) var(--space-5) var(--space-4);
}

.executive-timeline-kicker {
  display: block;
  margin-bottom: var(--space-1);
  color: var(--color-accent-strong);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.055em;
  text-transform: uppercase;
}

.executive-timeline-header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.15rem;
}

.executive-timeline-header p {
  margin: var(--space-1) 0 0;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.executive-go-live {
  min-width: 168px;
  display: grid;
  grid-template-columns: 22px 1fr;
  gap: 0 var(--space-2);
  align-items: center;
  border: 1px solid var(--color-success-border);
  border-radius: var(--radius-control);
  background: var(--color-success-soft);
  padding: var(--space-2) var(--space-3);
  color: var(--color-success-text);
}

.executive-go-live svg {
  grid-row: 1 / 3;
}

.executive-go-live span {
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
}

.executive-go-live strong {
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
}

.executive-timeline-story {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: var(--space-2);
  align-items: start;
  margin: 0 var(--space-5);
  border: 1px solid color-mix(in srgb, var(--color-accent) 20%, var(--color-border));
  border-radius: var(--radius-control);
  background: color-mix(in srgb, var(--color-accent-soft) 56%, white);
  padding: var(--space-3) var(--space-4);
}

.executive-timeline-story svg {
  margin-top: 0.1rem;
  color: var(--color-accent);
}

.executive-timeline-story p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  line-height: 1.5;
}

.executive-timeline-story strong {
  color: var(--color-text);
}


.executive-kpi-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  margin: var(--space-4) var(--space-5) 0;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  background: var(--color-border);
}

.executive-kpi-strip > div {
  min-width: 0;
  display: grid;
  gap: 0.18rem;
  background: var(--color-surface);
  padding: var(--space-3);
}

.executive-kpi-strip span {
  color: var(--color-text-muted);
  font-size: 0.64rem;
  font-weight: 650;
}

.executive-kpi-strip strong {
  color: var(--color-text);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.executive-kpi-buffer--compression-required strong,
.executive-kpi-buffer--target-before-reference strong {
  color: var(--color-warning-text);
}

.executive-timeline-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5) var(--space-3);
}

.executive-timeline-legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.executive-timeline-legend span {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-muted);
  font-size: 0.68rem;
  font-weight: 650;
}

.area-dot {
  width: 9px;
  height: 9px;
  display: inline-block;
  border-radius: 999px;
}

.area-dot--decision-process {
  background: #3b82f6;
}

.area-dot--paper-process {
  background: #8b5cf6;
}

.area-dot--implementation {
  background: #22c55e;
}

.executive-window {
  color: var(--color-text-muted);
  font-size: 0.68rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.executive-timeline-scroll {
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  border-top: 1px solid var(--color-divider);
  scrollbar-width: thin;
}

.executive-timeline-scroll:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--color-focus) 34%, transparent);
  outline-offset: -3px;
}

.executive-chart {
  min-width: 860px;
  padding: var(--space-4) var(--space-5) var(--space-5);
}

.executive-chart-axis,
.executive-chart-row,
.executive-chart-footer {
  display: grid;
  grid-template-columns: 230px minmax(0, 1fr);
  gap: var(--space-4);
}

.executive-chart-axis {
  align-items: end;
  min-height: 38px;
  margin-bottom: var(--space-2);
}

.executive-chart-axis-label {
  color: var(--color-text-muted);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.executive-chart-axis-track,
.executive-row-track {
  position: relative;
}

.executive-chart-axis-track {
  height: 28px;
  border-bottom: 1px solid var(--color-border-strong);
}

.executive-axis-tick {
  position: absolute;
  bottom: 7px;
  transform: translateX(-50%);
  color: var(--color-text-muted);
  font-size: 0.64rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.executive-axis-tick:first-child {
  transform: none;
}

.executive-axis-tick--start,
.executive-axis-tick--end {
  font-weight: 750;
}

.executive-axis-tick--start {
  transform: none;
  color: var(--color-accent-strong);
}

.executive-axis-tick--end {
  transform: translateX(-100%);
  color: var(--color-success-text);
}

.executive-chart-body {
  display: grid;
}

.executive-chart-row {
  min-height: 66px;
  align-items: center;
  border-bottom: 1px solid var(--color-divider);
}

.executive-chart-row:last-child {
  border-bottom: 0;
}

.executive-row-label {
  min-width: 0;
  display: grid;
  gap: 0.12rem;
}

.executive-row-label strong {
  overflow: hidden;
  color: var(--color-text);
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.executive-row-label span {
  color: var(--color-text-muted);
  font-size: 0.66rem;
}

.executive-row-track {
  height: 42px;
  border-radius: 0.3rem;
  background: linear-gradient(90deg, rgb(241 244 248 / 0.6), rgb(241 244 248 / 0.22));
}

.executive-grid-line {
  position: absolute;
  z-index: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--color-divider);
}

.executive-grid-line--go-live {
  width: 2px;
  background: color-mix(in srgb, var(--color-confirmed) 70%, transparent);
}

.executive-segment {
  position: absolute;
  z-index: 1;
  top: 7px;
  left: var(--segment-left);
  width: var(--segment-width);
  min-width: 8px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  border: 1px solid;
  border-radius: 0.38rem;
  padding-inline: var(--space-2);
  box-shadow: 0 4px 10px rgb(23 32 51 / 0.08);
  transition:
    left 160ms cubic-bezier(0.2, 0, 0, 1),
    width 160ms cubic-bezier(0.2, 0, 0, 1);
}

.executive-segment--decision-process {
  border-color: #60a5fa;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e3a8a;
}

.executive-segment--paper-process {
  border-color: #a78bfa;
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  color: #4c1d95;
}

.executive-segment--implementation {
  border-color: #4ade80;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #14532d;
}

.executive-segment-duration {
  overflow: hidden;
  font-size: 0.61rem;
  font-weight: 750;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.executive-chart-footer {
  margin-top: var(--space-2);
}

.executive-go-live-line-label {
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.64rem;
  font-variant-numeric: tabular-nums;
}

.executive-go-live-line-label strong {
  color: var(--color-success-text);
}

@media (max-width: 760px) {
  .executive-timeline-header,
  .executive-timeline-meta {
    align-items: flex-start;
    flex-direction: column;
  }

  .executive-go-live {
    min-width: 0;
    width: 100%;
  }

  .executive-timeline-story,
  .executive-kpi-strip {
    margin-inline: var(--space-4);
  }

  .executive-kpi-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .executive-timeline-meta {
    padding-inline: var(--space-4);
  }

  .executive-chart {
    min-width: 780px;
    padding-inline: var(--space-4);
  }

  .executive-chart-axis,
  .executive-chart-row,
  .executive-chart-footer {
    grid-template-columns: 205px minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .executive-segment {
    transition: none;
  }
}
</style>
