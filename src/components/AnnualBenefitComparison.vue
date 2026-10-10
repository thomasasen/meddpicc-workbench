<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  annualGrossBenefitEur: number
  annualIncrementalOperatingCostEur: number
}>()

const scale = computed(() =>
  Math.max(Math.abs(props.annualGrossBenefitEur), Math.abs(props.annualIncrementalOperatingCostEur), 1),
)
const grossWidth = computed(() => Math.max(0, (props.annualGrossBenefitEur / scale.value) * 100))
const costWidth = computed(() => Math.max(0, (props.annualIncrementalOperatingCostEur / scale.value) * 100))
const money = (value: number): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
</script>

<template>
  <figure class="annual-benefit-chart" aria-label="Vergleich jährlicher Nutzen und zusätzlicher Betriebskosten">
    <figcaption>
      <strong>Jährliche Nutzen-Kosten-Gegenüberstellung</strong>
      <span>Gleicher Zeitraum und dieselbe EUR-Skala. Die Darstellung zeigt keine realisierten Einsparungen.</span>
    </figcaption>

    <dl class="annual-benefit-chart-rows">
      <div>
        <dt>Angesetzter realisierbarer Bruttonutzen</dt>
        <dd>{{ money(annualGrossBenefitEur) }} / Jahr</dd>
        <div class="annual-benefit-chart-track" aria-hidden="true">
          <div
            class="annual-benefit-chart-fill annual-benefit-chart-fill--gross"
            :style="{ width: grossWidth + '%' }"
          />
        </div>
      </div>
      <div>
        <dt>Zusätzliche laufende Betriebskosten</dt>
        <dd>{{ money(annualIncrementalOperatingCostEur) }} / Jahr</dd>
        <div class="annual-benefit-chart-track" aria-hidden="true">
          <div class="annual-benefit-chart-fill annual-benefit-chart-fill--cost" :style="{ width: costWidth + '%' }" />
        </div>
      </div>
    </dl>
    <p>Die Differenz und die Amortisationsdauer stehen in den berechneten Kennzahlen darüber.</p>
  </figure>
</template>

<style scoped>
.annual-benefit-chart {
  min-width: 0;
  margin: 1.4rem 0 0;
  border-top: 1px solid var(--color-border);
  padding-top: 1.15rem;
}
.annual-benefit-chart figcaption {
  display: grid;
  gap: 0.25rem;
  margin-bottom: 1.15rem;
}
.annual-benefit-chart figcaption strong {
  color: var(--color-text);
  font-size: 0.97rem;
}
.annual-benefit-chart figcaption span,
.annual-benefit-chart > p {
  color: var(--color-text-muted);
  font-size: 0.82rem;
  line-height: 1.55;
}
.annual-benefit-chart-rows {
  display: grid;
  gap: 1.2rem;
  margin: 0;
}
.annual-benefit-chart-rows > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  column-gap: 0.75rem;
  row-gap: 0.45rem;
}
.annual-benefit-chart dt {
  font-size: 0.85rem;
  font-weight: 600;
  overflow-wrap: anywhere;
}
.annual-benefit-chart dd {
  margin: 0;
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: right;
  overflow-wrap: anywhere;
}
.annual-benefit-chart-track {
  grid-column: 1 / -1;
  height: 12px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--color-surface-muted);
}
.annual-benefit-chart-fill {
  height: 100%;
  border-radius: 2px;
}
.annual-benefit-chart-fill--gross {
  background: #2563eb;
}
.annual-benefit-chart-fill--cost {
  background: #b45309;
}
.annual-benefit-chart > p {
  margin: 1.05rem 0 0;
}
@media (max-width: 640px) {
  .annual-benefit-chart-rows > div {
    grid-template-columns: 1fr;
  }
  .annual-benefit-chart dd {
    text-align: left;
  }
  .annual-benefit-chart-track {
    grid-column: 1;
  }
}
</style>
