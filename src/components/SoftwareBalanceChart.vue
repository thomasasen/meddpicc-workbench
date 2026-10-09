<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MonthFlow } from '../domain/softwarePayback'

const props = defineProps<{
  months: MonthFlow[]
  horizon: number
  breakEven: number | null
  firstBenefitMonth: number | null
}>()
const svgRef = ref<SVGSVGElement | null>(null)
defineExpose({ getSvgElement: () => svgRef.value })
const x0 = 94,
  x1 = 878,
  y0 = 286,
  y1 = 76
function niceStep(raw: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, raw)))
  return ([1, 2, 2.5, 5, 10].find((k) => k * magnitude >= raw) ?? 10) * magnitude
}
const bounds = computed(() => {
  const values = props.months.map((m) => m.cumulativeEur)
  let low = Math.min(0, ...values),
    high = Math.max(0, ...values)
  if (high - low < 1) {
    low -= 1
    high += 1
  }
  const pad = (high - low) * 0.08
  const step = niceStep((high - low + 2 * pad) / 4)
  return { min: Math.floor((low - pad) / step) * step, max: Math.ceil((high + pad) / step) * step, step }
})
const x = (month: number) => x0 + (month / props.horizon) * (x1 - x0)
const y = (eur: number) => y0 - ((eur - bounds.value.min) / (bounds.value.max - bounds.value.min)) * (y0 - y1)
const zero = computed(() => y(0))
const points = computed(() =>
  props.months.map((m) => x(m.month).toFixed(1) + ',' + y(m.cumulativeEur).toFixed(1)).join(' '),
)
const area = computed(
  () =>
    'M ' +
    x(0) +
    ' ' +
    zero.value +
    ' L ' +
    props.months.map((m) => x(m.month).toFixed(1) + ' ' + y(m.cumulativeEur).toFixed(1)).join(' L ') +
    ' L ' +
    x(props.horizon) +
    ' ' +
    zero.value +
    ' Z',
)
const minPoint = computed(() => props.months.reduce((a, b) => (b.cumulativeEur < a.cumulativeEur ? b : a)))
const payback = computed(() => (props.breakEven === null ? null : (props.months[props.breakEven] ?? null)))
const hovered = ref<MonthFlow | null>(null)
const fmt = (v: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
const compact = (value: number) => {
  const sign = value < 0 ? '-' : '',
    v = Math.abs(value)
  return (
    sign +
    (v >= 1000000
      ? new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(v / 1000000) + ' Mio.'
      : v >= 1000
        ? new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v / 1000) + ' Tsd.'
        : new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(v)) +
    ' €'
  )
}
const ticks = computed(() => {
  const { min, max, step } = bounds.value
  const values: number[] = []
  for (let v = min; v <= max + step / 10 && values.length < 9; v += step) values.push(Math.abs(v) < step / 100 ? 0 : v)
  return values
})
</script>

<template>
  <div class="value-chart">
    <svg ref="svgRef" viewBox="0 0 960 380" role="img" aria-labelledby="value-chart-title value-chart-desc">
      <title id="value-chart-title">Wirtschaftliche Wertentwicklung des Softwareprojekts</title>
      <desc id="value-chart-desc">
        Kumulierter wirtschaftlicher Saldo nach Projektmonat. Rot unter null, grün über null. Tiefpunkt und anhaltender
        Break-even sind markiert. Alle Monatswerte stehen in der Tabelle.
      </desc>
      <defs>
        <clipPath id="value-positive"><rect :x="x0" y="0" :width="x1 - x0" :height="Math.max(0, zero)" /></clipPath>
        <clipPath id="value-negative"><rect :x="x0" :y="zero" :width="x1 - x0" :height="380 - zero" /></clipPath>
      </defs>
      <rect x="0" y="0" width="960" height="380" fill="#ffffff" />
      <text x="94" y="32" class="chart-head">Wertentwicklung über {{ horizon }} Projektmonate</text>
      <text x="94" y="51" class="chart-sub">Kumulierter wirtschaftlicher Saldo · undiskontiert · EUR</text>
      <g v-for="(tick, i) in ticks" :key="i">
        <line :x1="x0" :x2="x1" :y1="y(tick)" :y2="y(tick)" stroke="#e7edf4" stroke-width="1" />
        <text :x="x0 - 12" :y="y(tick) + 4" text-anchor="end" class="chart-tick">{{ compact(tick) }}</text>
      </g>
      <path :d="area" fill="#ffe5e2" opacity="0.85" clip-path="url(#value-negative)" />
      <path :d="area" fill="#d9f4ea" opacity="0.85" clip-path="url(#value-positive)" />
      <line :x1="x0" :x2="x1" :y1="zero" :y2="zero" stroke="#65758a" stroke-width="1.5" stroke-dasharray="7 5" />
      <polyline
        :points="points"
        fill="none"
        stroke="#2563eb"
        stroke-width="3.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <g v-if="firstBenefitMonth !== null" :transform="'translate(' + x(firstBenefitMonth) + ',0)'">
        <line y1="72" y2="286" stroke="#94a3b8" stroke-dasharray="3 6" />
        <text x="5" y="68" class="chart-annotation">Nutzenbeginn · M{{ firstBenefitMonth }}</text>
      </g>
      <g :transform="'translate(' + x(minPoint.month) + ',' + y(minPoint.cumulativeEur) + ')'">
        <circle r="5.5" fill="#b42318" stroke="white" stroke-width="2" />
        <text x="7" y="23" class="chart-min">Tiefpunkt · M{{ minPoint.month }}</text>
        <title>Tiefpunkt in Projektmonat {{ minPoint.month }}: {{ fmt(minPoint.cumulativeEur) }}</title>
      </g>
      <g v-if="payback" :transform="'translate(' + x(payback.month) + ',' + y(payback.cumulativeEur) + ')'">
        <circle r="6" fill="#0f826b" stroke="white" stroke-width="2.5" />
        <text x="-8" y="-17" text-anchor="end" class="chart-profit">Break-even · M{{ payback.month }}</text>
        <title>Anhaltender Break-even bis zum Betrachtungsende: Monat {{ payback.month }}</title>
      </g>
      <g v-for="point in months" :key="point.month">
        <circle
          :cx="x(point.month)"
          :cy="y(point.cumulativeEur)"
          r="6"
          fill="transparent"
          class="chart-hit"
          @mouseenter="hovered = point"
          @mouseleave="hovered = null"
          @focus="hovered = point"
          @blur="hovered = null"
          :tabindex="point.month % 6 === 0 ? 0 : -1"
        >
          <title>Monat {{ point.month }}: {{ fmt(point.cumulativeEur) }}</title>
        </circle>
      </g>
      <g v-if="hovered" :transform="'translate(' + Math.min(777, Math.max(x0, x(hovered.month) - 90)) + ',310)'">
        <rect width="183" height="30" rx="5" fill="#13233b" />
        <text x="10" y="20" class="chart-tooltip">M{{ hovered.month }} · {{ fmt(hovered.cumulativeEur) }}</text>
      </g>
      <g v-for="month in [0, 12, 24, 36, 48, 60].filter((m) => m <= horizon)" :key="month">
        <text :x="x(month)" y="308" text-anchor="middle" class="chart-tick">{{ month }}</text>
      </g>
      <text x="485" y="342" text-anchor="middle" class="chart-sub">Projektmonat</text>
      <rect x="94" y="355" width="10" height="9" rx="2" fill="#b42318" />
      <text x="111" y="363" class="chart-legend">Noch nicht amortisiert</text>
      <rect x="300" y="355" width="10" height="9" rx="2" fill="#0f826b" />
      <text x="317" y="363" class="chart-legend">Positiver kumulierter Wert</text>
      <text x="866" y="363" text-anchor="end" class="chart-legend">Modellrechnung · keine Garantie</text>
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
.chart-head {
  font:
    700 17px system-ui,
    sans-serif;
  fill: #172033;
}
.chart-sub {
  font:
    12px system-ui,
    sans-serif;
  fill: #5f6b7a;
}
.chart-tick {
  font:
    11px system-ui,
    sans-serif;
  fill: #5f6b7a;
}
.chart-annotation {
  font:
    600 10px system-ui,
    sans-serif;
  fill: #53677d;
}
.chart-min {
  font:
    700 11px system-ui,
    sans-serif;
  fill: #b42318;
}
.chart-profit {
  font:
    700 12px system-ui,
    sans-serif;
  fill: #0f826b;
}
.chart-legend {
  font:
    11px system-ui,
    sans-serif;
  fill: #53677d;
}
.chart-hit {
  cursor: crosshair;
}
.chart-tooltip {
  font:
    700 12px system-ui,
    sans-serif;
  fill: white;
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>
