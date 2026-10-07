<script setup lang="ts">
import {
  ArrowRight,
  Award,
  Calculator,
  CircleDollarSign,
  FileText,
  Flame,
  ListChecks,
  Presentation,
  Route,
  Swords,
  UserRound,
  Wrench,
} from '@lucide/vue'

const areas = [
  {
    code: 'M',
    title: 'Metrics',
    description: 'Wert quantifizieren und finanzielle Wirkung verständlich machen.',
    icon: Calculator,
    tools: [
      { label: 'Business Case', note: 'ROI, Payback und Value Bridge', customerReady: true },
      { label: 'Cost of Delay', note: 'Kosten des Wartens sichtbar machen', customerReady: true },
    ],
  },
  {
    code: 'E',
    title: 'Economic Buyer',
    description: 'Economic Buyer identifizieren, vorbereiten und auf Business Outcomes ausrichten.',
    icon: UserRound,
    tools: [
      { label: 'EB Meeting Prep', note: 'Gespräch fokussiert vorbereiten', customerReady: false },
      { label: 'EB Value Story', note: 'Executive Value Narrative', customerReady: true },
    ],
  },
  {
    code: 'D',
    title: 'Decision Criteria',
    description: 'Entscheidungskriterien strukturieren und Differenzierung herausarbeiten.',
    icon: ListChecks,
    tools: [
      { label: 'Criteria Workshop', note: 'Kriterien gemeinsam strukturieren', customerReady: true },
      { label: 'Decision Matrix', note: 'Kriterien vergleichbar machen', customerReady: true },
    ],
  },
  {
    code: 'D',
    title: 'Decision Process',
    description: 'Kundenseitige Schritte, Abhängigkeiten und Termine in einen belastbaren Plan bringen.',
    icon: Route,
    tools: [
      {
        label: 'Go-Live-Rückwärtsplanung',
        note: 'Vom Zieltermin rückwärts planen',
        customerReady: true,
        route: '/tools/reverse-timeline',
      },
      { label: 'Decision Map', note: 'Entscheidungsweg visualisieren', customerReady: true },
    ],
  },
  {
    code: 'P',
    title: 'Paper Process',
    description: 'Legal, Procurement, Vertrag und Freigaben frühzeitig planbar machen.',
    icon: FileText,
    tools: [
      { label: 'Procurement Timeline', note: 'Paper Process visualisieren', customerReady: true },
      { label: 'Closing Plan', note: 'Administrative Schritte planen', customerReady: true },
    ],
  },
  {
    code: 'I',
    title: 'Identify / Implicate Pain',
    description: 'Pain in konkrete geschäftliche Auswirkungen und Dringlichkeit übersetzen.',
    icon: Flame,
    tools: [
      { label: 'Pain → Impact', note: 'Problem, Konsequenz und Outcome verbinden', customerReady: true },
      { label: 'Cost of Pain', note: 'Wirtschaftliche Auswirkung quantifizieren', customerReady: true },
    ],
  },
  {
    code: 'C',
    title: 'Champion',
    description: 'Champion-Verhalten testen und gezielte nächste Tests ableiten.',
    icon: Award,
    tools: [
      { label: 'Champion Tester', note: 'Interne Wirkung evidenzbasiert prüfen', customerReady: false },
      { label: 'Champion Development', note: 'Nächsten Champion-Test planen', customerReady: false },
    ],
  },
  {
    code: 'C',
    title: 'Competition',
    description: 'Wettbewerb einschließlich Status quo und Do Nothing sichtbar machen.',
    icon: Swords,
    tools: [
      { label: 'Competition Map', note: 'Alternativen und Positionierung strukturieren', customerReady: false },
      { label: 'Differentiation Matrix', note: 'Relevante Differenzierung darstellen', customerReady: true },
    ],
  },
]
</script>

<template>
  <div class="site-shell toolbox-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="MEDDPICC Toolbox Startseite">
          <span class="brand-mark">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Toolbox</strong>
            <span>Microtools für komplexe Deals</span>
          </span>
        </RouterLink>

        <div class="toolbox-header-meta">
          <Wrench :size="17" aria-hidden="true" />
          <span>Local-first · deterministisch · ohne CRM-Pflicht</span>
        </div>
      </div>
    </header>

    <main id="main-content" class="toolbox-main">
      <section class="container toolbox-intro" aria-labelledby="toolbox-title">
        <div>
          <p class="eyebrow">MEDDPICC Microtools</p>
          <h1 id="toolbox-title">Das passende Werkzeug für die konkrete Sales-Aufgabe.</h1>
          <p class="intro-text">
            Jedes Microtool funktioniert eigenständig und fragt nur die Informationen ab, die für genau diese Aufgabe
            benötigt werden. Ein vollständiger Opportunity-Datensatz ist keine Voraussetzung.
          </p>
        </div>

        <aside class="toolbox-principles" aria-label="Produktprinzipien">
          <div>
            <Presentation :size="20" aria-hidden="true" />
            <span
              ><strong>Kundenfähig</strong> gekennzeichnete Ergebnisse sind für Präsentationen und gemeinsame Planung
              gedacht.</span
            >
          </div>
          <div>
            <CircleDollarSign :size="20" aria-hidden="true" />
            <span>Berechnungen bleiben nachvollziehbar und reproduzierbar.</span>
          </div>
        </aside>
      </section>

      <section class="container toolbox-area-list" aria-label="MEDDPICC Bereiche und Microtools">
        <article v-for="area in areas" :key="area.code + area.title" class="toolbox-area">
          <div class="toolbox-area-heading">
            <div class="toolbox-letter" aria-hidden="true">{{ area.code }}</div>
            <div class="toolbox-area-copy">
              <div class="toolbox-area-title">
                <component :is="area.icon" :size="20" :stroke-width="2" aria-hidden="true" />
                <h2>{{ area.title }}</h2>
              </div>
              <p>{{ area.description }}</p>
            </div>
          </div>

          <div class="microtool-grid">
            <component
              :is="tool.route ? 'RouterLink' : 'button'"
              v-for="tool in area.tools"
              :key="tool.label"
              class="microtool-card"
              :class="{ 'microtool-card--active': tool.route }"
              :to="tool.route"
              :disabled="!tool.route"
              :aria-disabled="tool.route ? undefined : 'true'"
            >
              <span class="microtool-card-copy">
                <span class="microtool-card-title">
                  <strong>{{ tool.label }}</strong>
                  <span v-if="tool.customerReady" class="tool-kind tool-kind--customer">Kundenfähig</span>
                  <span v-else class="tool-kind">Intern</span>
                </span>
                <span>{{ tool.note }}</span>
              </span>
              <ArrowRight v-if="tool.route" :size="18" aria-hidden="true" />
              <span v-else class="microtool-planned">Geplant</span>
            </component>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>
