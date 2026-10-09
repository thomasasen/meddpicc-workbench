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

const x0 = 94
const x1 = 878
const plotTop = 167
const plotBottom = 319

function niceStep(raw: number): number {
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, raw)))
  return ([1, 2, 2.5, 5, 10].find((k) => k * magnitude >= raw) ?? 10) * magnitude
}

const bounds = computed(() => {
  const values = props.months.map((m) => m.cumulativeEur)
  let low = Math.min(0, ...values)
  let high = Math.max(0, ...values)
  if (high - low < 1) {
    low -= 1
    high += 1
  }
  const padding = (high - low) * 0.08
  const step = niceStep((high - low + 2 * padding) / 4)
  return {
    min: Math.floor((low - padding) / step) * step,
    max: Math.ceil((high + padding) / step) * step,
    step,
  }
})
const x = (month: number) => x0 + (month / props.horizon) * (x1 - x0)
const y = (eur: number) =>
  plotBottom - ((eur - bounds.value.min) / (bounds.value.max - bounds.value.min)) * (plotBottom - plotTop)
const zero = computed(() => y(0))
const linePoints = computed(() =>
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
const finalPoint = computed(() => props.months.at(-1)!)
const payback = computed(() => (props.breakEven === null ? null : (props.months[props.breakEven] ?? null)))
const hovered = ref<MonthFlow | null>(null)

const money = (eur: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur)
const compact = (eur: number): string => {
  const abs = Math.abs(eur)
  const sign = eur < 0 ? '−' : eur > 0 ? '+' : ''
  if (abs >= 1_000_000)
    return sign + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(abs / 1_000_000) + ' Mio. €'
  if (abs >= 1_000)
    return sign + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(abs / 1_000) + ' Tsd. €'
  return sign + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(abs) + ' €'
}
const ticks = computed(() => {
  const { min, max, step } = bounds.value
  const values: number[] = []
  for (let n = min; n <= max + step / 10 && values.length < 9; n += step) {
    values.push(Math.abs(n) < step / 100 ? 0 : n)
  }
  return values
})
const tickMonths = computed(() =>
  [0, 12, 24, 36, 48, 60].filter((m) => m <= props.horizon),
)
</script>

<template>
  <div class="value-chart">
    <svg ref="svgRef" viewBox="0 0 960 405" role="img" aria-labelledby="value-chart-title value-chart-desc">
      <title id="value-chart-title">Wann hat die Software ihre Kosten wirtschaftlich ausgeglichen?</title>
      <desc id="value-chart-desc">
        Kumulierte wirtschaftliche Vorteile abzüglich sämtlicher neuer Projektkosten. Die Grafik zeigt das größte
        kumulierte Minus, den bis zum Ende des Betrachtungszeitraums anhaltenden Ausgleich und den Endsaldo.
        Ein negativer Saldo bedeutet noch nicht ausgeglichene Kosten. Es handelt sich nicht um einen Liquiditätsplan.
        Sämtliche Werte sind zusätzlich in der Monatstabelle enthalten.
      </desc>
      <defs>
        <clipPath id="value-positive-area">
          <rect :x="x0" :width="x1 - x0" :height="Math.max(0, zero)" y="0" />
        </clipPath>
        <clipPath id="value-negative-area">
          <rect :x="x0" :y="zero" :width="x1 - x0" :height="405 - zero" />
        </clipPath>
      </defs>
      <rect width="960" height="405" fill="#ffffff" />
      <text x="94" y="29" class="chart-head">Wann ist die Investition wirtschaftlich ausgeglichen?</text>
      <text x="94" y="48" class="chart-sub">Kumulierter Saldo = wirtschaftlicher Nutzen minus neue Kosten · undiskontiert</text>

      <g class="chart-milestone" data-testid="chart-lowest">
        <rect x="94" y="62" width="248" height="66" rx="7" fill="#fff4f2" />
        <text x="108" y="81" class="chart-card-title">GRÖSSTES KUMULIERTES MINUS</text>
        <text x="108" y="106" class="chart-card-value" fill="#9c2823">
          {{ compact(minPoint.cumulativeEur) }}
        </text>
        <text x="329" y="119" text-anchor="end" class="chart-card-month">M{{ minPoint.month }}</text>
      </g>
      <g class="chart-milestone" data-testid="chart-payback">
        <rect x="357" y="62" width="248" height="66" rx="7" fill="#edf7f5" />
        <text x="371" y="81" class="chart-card-title">KOSTEN AUSGEGLICHEN</text>
        <text x="371" y="106" class="chart-card-value" fill="#116c5c">
          {{ payback ? 'Ab Monat ' + payback.month : 'Nicht erreicht' }}
        </text>
        <text x="592" y="119" text-anchor="end" class="chart-card-month">bis M{{ horizon }}</text>
      </g>
      <g class="chart-milestone" data-testid="chart-final">
        <rect x="620" y="62" width="258" height="66" rx="7" fill="#eff4fb" />
        <text x="634" y="81" class="chart-card-title">SALDO AM PERIODENENDE</text>
        <text x="634" y="106" class="chart-card-value" fill="#1e446c">
          {{ compact(finalPoint.cumulativeEur) }}
        </text>
        <text x="865" y="119" text-anchor="end" class="chart-card-month">M{{ horizon }}</text>
      </g>

      <g v-for="(tick, i) in ticks" :key="i">
        <line :x1="x0" :x2="x1" :y1="y(tick)" :y2="y(tick)" stroke="#e7edf4" stroke-width="1" />
        <text :x="x0 - 12" :y="y(tick) + 4" text-anchor="end" class="chart-tick">
          {{ compact(tick) }}
        </text>
      </g>

      <path :d="area" fill="#fce6e2" opacity="0.8" clip-path="url(#value-negative-area)" />
      <path :d="area" fill="#d9f4ea" opacity="0.8" clip-path="url(#value-positive-area)" />
      <line :x1="x0" :x2="x1" :y1="zero" :y2="zero" stroke="#5c697b" stroke-width="1.6" stroke-dasharray="6 5" />

      <polyline
        :points="linePoints"
        fill="none"
        stroke="#b42318"
        stroke-width="3.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        clip-path="url(#value-negative-area)"
      />
      <polyline
        :points="linePoints"
        fill="none"
        stroke="#0f826b"
        stroke-width="3.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        clip-path="url(#value-positive-area)"
      />

      <g v-if="firstBenefitMonth !== null">
        <line
          :x1="x(firstBenefitMonth)"
          :x2="x(firstBenefitMonth)"
          :y1="plotTop - 1"
          :y2="plotBottom"
          stroke="#9aa9b9"
          stroke-width="1"
          stroke-dasharray="3 5"
        />
      </g>
      <g :transform="'translate(' + x(minPoint.month) + ',' + y(minPoint.cumulativeEur) + ')'">
        <circle r="5.3" fill="#b42318" stroke="#ffffff" stroke-width="2" />
        <title>Größtes kumuliertes Minus: Monat {{ minPoint.month }}, {{ money(minPoint.cumulativeEur) }}</title>
      </g>
      <g v-if="payback" :transform="'translate(' + x(payback.month) + ',' + y(payback.cumulativeEur) + ')'">
        <circle r="5.6" fill="#0f826b" stroke="#ffffff" stroke-width="2" />
        <text x="0" y="-11" text-anchor="middle" class="chart-break-label">Kostenausgleich M{{ payback.month }}</text>
        <title>Anhaltender Kostenausgleich bis zum Periodenende: Monat {{ payback.month }}</title>
      </g>
      <circle :cx="x(finalPoint.month)" :cy="y(finalPoint.cumulativeEur)" r="4.7" :fill="finalPoint.cumulativeEur >= 0 ? '#0f826b' : '#b42318'" />
      <g v-for="point in months" :key="point.month">
        <circle
          :cx="x(point.month)"
          :cy="y(point.cumulativeEur)"
          r="6"
          fill="transparent"
          class="chart-hit"
          :tabindex="point.month % 6 === 0 ? 0 : -1"
          @mouseenter="hovered = point"
          @mouseleave="hovered = null"
          @focus="hovered = point"
          @blur="hovered = null"
        >
          <title>Monat {{ point.month }}: {{ money(point.cumulativeEur) }}</title>
        </circle>
      </g>
      <g v-if="hovered" :transform="'translate(' + Math.min(693, Math.max(x0, x(hovered.month) - 90)) + ',340)'">
        <rect width="185" height="29" rx="5" fill="#13233b" />
        <text x="9" y="19" class="chart-tooltip">M{{ hovered.month }}: {{ money(hovered.cumulativeEur) }}</text>
      </g>
      <g v-for="month in tickMonths" :key="month">
        <text :x="x(month)" y="337" text-anchor="middle" class="chart-tick">{{ month }}</text>
      </g>
      <text x="485" y="353" text-anchor="middle" class="chart-sub">Projektmonat</text>
      <text x="94" y="377" class="chart-legend">
        Unter 0 €: Kosten noch nicht ausgeglichen · Über 0 €: kumulierter Überschuss
      </text>
      <text x="94" y="395" class="chart-footnote">
        {{ firstBenefitMonth === null ? 'Kein Nutzenbeitrag eingeplant' : 'Nutzenbeiträge ab M' + firstBenefitMonth }}
        · Modellrechnung, keine Liquiditäts- oder Gewinnprognose
      </text>
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
  display: block;
  width: 100%;
  height: auto;
}
.chart-head {
  font: 700 18px system-ui, sans-serif;
  fill: #172033;
}
.chart-sub {
  font: 12px system-ui, sans-serif;
  fill: #5f6b7a;
}
.chart-card-title {
  font: 700 10px system-ui, sans-serif;
  letter-spacing: 0.2px;
  fill: #465769;
}
.chart-card-value {
  font: 700 18px system-ui, sans-serif;
}
.chart-card-month {
  font: 10px system-ui, sans-serif;
  fill: #5f6b7a;
}
.chart-tick {
  font: 11px system-ui, sans-serif;
  fill: #5f6b7a;
}
.chart-break-label {
  font: 700 11px system-ui, sans-serif;
  fill: #116c5c;
}
.chart-legend {
  font: 11px system-ui, sans-serif;
  fill: #33465d;
}
.chart-footnote {
  font: 10px system-ui, sans-serif;
  fill: #5f6b7a;
}
.chart-hit {
  cursor: crosshair;
}
.chart-tooltip {
  font: 700 11px system-ui, sans-serif;
  fill: #ffffff;
}
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}
</style>
