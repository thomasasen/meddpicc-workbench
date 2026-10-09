<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MonthFlow } from '../domain/softwarePayback'

const props = defineProps<{
  months: MonthFlow[]
  horizon: number
  breakEven: number | null
}>()

const svgRef = ref<SVGSVGElement | null>(null)
defineExpose({ getSvgElement: () => svgRef.value })

const x0 = 110
const x1 = 850
const yTop = 92
const yBottom = 264
const money = (amount: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
const abbreviated = (amount: number) => {
  const absolute = Math.abs(amount)
  const sign = amount < 0 ? '−' : amount > 0 ? '+' : ''
  if (absolute >= 1_000_000)
    return sign + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(absolute / 1_000_000) + ' Mio. €'
  if (absolute >= 10_000)
    return sign + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(absolute / 1_000) + ' Tsd. €'
  return sign + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(absolute) + ' €'
}

const minimum = computed(() =>
  props.months.reduce((a, b) => (b.cumulativeEur < a.cumulativeEur ? b : a), props.months[0]!),
)
const ending = computed(() => props.months[props.months.length - 1]!)
const payback = computed(() => props.breakEven === null ? null : props.months.find((m) => m.month === props.breakEven) ?? null)
const bounds = computed(() => {
  const vals = props.months.map((m) => m.cumulativeEur)
  const lowest = Math.min(0, ...vals)
  const highest = Math.max(0, ...vals)
  const padding = Math.max(1, (highest - lowest) * 0.12)
  return { min: lowest - padding, max: highest + padding }
})
const x = (month: number) => x0 + (month / props.horizon) * (x1 - x0)
const y = (amount: number) => yBottom - ((amount - bounds.value.min) / (bounds.value.max - bounds.value.min)) * (yBottom - yTop)
const zero = computed(() => y(0))
const linePoints = computed(() =>
  props.months.map((m) => x(m.month).toFixed(1) + ',' + y(m.cumulativeEur).toFixed(1)).join(' '),
)
const monthsToShow = computed(() => {
  const possible = [0, 12, 24, 36, 48, 60]
  return possible.filter((month) => month <= props.horizon)
})
const hovering = ref<MonthFlow | null>(null)
const accessibleDescription = computed(() => {
  const valley = minimum.value.cumulativeEur < 0
    ? 'Tiefster Wert ' + money(minimum.value.cumulativeEur) + ' in Monat ' + minimum.value.month + '. '
    : 'Kein negativer kumulierter Saldo. '
  const when = payback.value
    ? 'Wirtschaftlicher Ausgleich ab Monat ' + payback.value.month + ' bis zum Betrachtungsende. '
    : 'Kein anhaltender wirtschaftlicher Ausgleich im Betrachtungszeitraum. '
  return valley + when + 'Rechnerischer Saldo nach ' + props.horizon + ' Monaten: ' + money(ending.value.cumulativeEur) +
    '. Der Saldo ist keine Liquiditäts- oder Zahlungsstromrechnung.'
})
</script>

<template>
  <div class="value-chart">
    <svg ref="svgRef" viewBox="0 0 960 368" role="img" aria-labelledby="value-chart-title value-chart-desc">
      <title id="value-chart-title">Wann rechnet sich das Vorhaben?</title>
      <desc id="value-chart-desc">{{ accessibleDescription }}</desc>
      <rect x="0" y="0" width="960" height="368" fill="#ffffff" />

      <text x="110" y="31" class="chart-head">Wann rechnet sich das Vorhaben?</text>
      <text x="110" y="53" class="chart-sub">Die Linie zeigt die erwarteten Vorteile abzüglich der neuen Kosten.</text>

      <line :x1="x0" :x2="x1" :y1="zero" :y2="zero" stroke="#5e6c80" stroke-width="1.5" stroke-dasharray="6 6" />
      <text :x="x0 - 13" :y="zero + 4" class="chart-tick" text-anchor="end">0 €</text>
      <text :x="x0 - 13" :y="y(bounds.max) + 4" class="chart-tick" text-anchor="end">
        {{ abbreviated(bounds.max) }}
      </text>
      <text :x="x0 - 13" :y="y(bounds.min) + 4" class="chart-tick" text-anchor="end">
        {{ abbreviated(bounds.min) }}
      </text>

      <polyline
        :points="linePoints"
        fill="none"
        stroke="#2563eb"
        stroke-width="3.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        data-testid="cumulative-line"
      />
      <g v-if="minimum.cumulativeEur < 0" :transform="'translate(' + x(minimum.month) + ',' + y(minimum.cumulativeEur) + ')'">
        <circle r="6.5" fill="#b42318" stroke="#ffffff" stroke-width="2.5" data-testid="chart-lowest" />
        <title>Tiefster rechnerischer Saldo: {{ money(minimum.cumulativeEur) }} in Monat {{ minimum.month }}</title>
      </g>
      <g v-if="payback" :transform="'translate(' + x(payback.month) + ',' + y(payback.cumulativeEur) + ')'">
        <circle r="7" fill="#08775e" stroke="#ffffff" stroke-width="2.5" data-testid="chart-break-even" />
        <title>Ab Monat {{ payback.month }} gleichen die kumulierten Vorteile die Kosten aus.</title>
      </g>
      <g :transform="'translate(' + x(ending.month) + ',' + y(ending.cumulativeEur) + ')'">
        <circle r="6.5" :fill="ending.cumulativeEur < 0 ? '#b42318' : '#2563eb'" stroke="#ffffff" stroke-width="2.5"
          data-testid="chart-endpoint" />
        <title>Rechnerischer Saldo nach {{ horizon }} Monaten: {{ money(ending.cumulativeEur) }}</title>
      </g>

      <g v-for="point in months" :key="point.month">
        <circle
          :cx="x(point.month)" :cy="y(point.cumulativeEur)" r="9" fill="transparent"
          class="chart-hit"
          @mouseenter="hovering = point" @mouseleave="hovering = null"
          @focus="hovering = point" @blur="hovering = null"
          :tabindex="point.month % 6 === 0 ? 0 : -1"
        >
          <title>Monat {{ point.month }}: {{ money(point.cumulativeEur) }}</title>
        </circle>
      </g>
      <g v-if="hovering" :transform="'translate(' + Math.max(x0, Math.min(688, x(hovering.month) - 94)) + ',66)'">
        <rect width="192" height="28" rx="5" fill="#172b46" />
        <text x="10" y="19" class="chart-tooltip">Monat {{ hovering.month }}: {{ abbreviated(hovering.cumulativeEur) }}</text>
      </g>

      <g v-for="month in monthsToShow" :key="month">
        <text :x="x(month)" y="284" text-anchor="middle" class="chart-tick">{{ month }}</text>
      </g>
      <text x="480" y="305" text-anchor="middle" class="chart-sub">Projektmonat</text>

      <g data-testid="chart-summary">
        <circle cx="112" cy="330" r="4" fill="#b42318" />
        <text x="123" y="326" class="summary-name">Tiefster Saldo</text>
        <text x="123" y="343" class="summary-value">
          {{ minimum.cumulativeEur < 0 ? abbreviated(minimum.cumulativeEur) + ' · M' + minimum.month : 'Kein Minus' }}
        </text>

        <circle cx="372" cy="330" r="4" fill="#08775e" />
        <text x="383" y="326" class="summary-name">Wirtschaftlicher Ausgleich</text>
        <text x="383" y="343" class="summary-value" data-testid="chart-payback">
          {{ payback ? 'Ab Monat ' + payback.month : 'Nicht erreicht' }}
        </text>

        <circle cx="682" cy="330" r="4" :fill="ending.cumulativeEur < 0 ? '#b42318' : '#2563eb'" />
        <text x="693" y="326" class="summary-name">Saldo nach {{ horizon }} Monaten</text>
        <text x="693" y="343" class="summary-value" data-testid="chart-final-balance">
          {{ abbreviated(ending.cumulativeEur) }}
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.value-chart {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  overflow: hidden;
  background: white;
}
.value-chart svg {
  width: 100%;
  height: auto;
  display: block;
}
.chart-head { font: 700 18px system-ui, sans-serif; fill: #172033; }
.chart-sub { font: 12px system-ui, sans-serif; fill: #5f6b7a; }
.chart-tick { font: 11px system-ui, sans-serif; fill: #53677d; }
.chart-tooltip { font: 700 12px system-ui, sans-serif; fill: white; }
.chart-hit { cursor: crosshair; }
.summary-name { font: 11px system-ui, sans-serif; fill: #5f6b7a; }
.summary-value { font: 700 13px system-ui, sans-serif; fill: #172033; }
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
</style>
