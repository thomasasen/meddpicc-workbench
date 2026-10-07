<script setup lang="ts">
import {
  ArrowRight,
  Award,
  Calculator,
  FileText,
  Flame,
  ListChecks,
  Presentation,
  Route,
  Swords,
  UserRound,
  Wrench,
} from '@lucide/vue'

const pillars = [
  {
    id: 'tools',
    title: 'Tools',
    kicker: 'Arbeit vereinfachen',
    description: 'Berechnen, strukturieren und visualisieren – für konkrete, wiederkehrende Sales-Aufgaben.',
    icon: Wrench,
  },
  {
    id: 'checklists',
    title: 'Checklists',
    kicker: 'Nichts Wichtiges vergessen',
    description: 'Kurze Prüfpunkte mit Erklärungen, Beispielen und typischen Fehlinterpretationen.',
    icon: ListChecks,
  },
  {
    id: 'knowledge',
    title: 'Knowledge',
    kicker: 'Schnell nachschlagen',
    description: 'MEDDPICC-Konzepte praxisnah verstehen, ohne erneut im Buch suchen zu müssen.',
    icon: FileText,
  },
]

const toolClusters = [
  {
    title: 'Go-Live & Buying Process',
    description: 'Termine, Schritte und Verantwortlichkeiten verständlich machen.',
    icon: Route,
    tools: [
      {
        label: 'Go-Live-Rückwärtsplanung',
        note: 'Vom Zieltermin rückwärts planen und eine kundenfähige Timeline erzeugen.',
        route: '/tools/reverse-timeline',
        customerReady: true,
      },
      {
        label: 'Go-Live Plan Builder',
        note: 'Aus Prozessschritten einen gemeinsamen Plan machen.',
        customerReady: true,
      },
      { label: 'Paper Process Explorer', note: 'Legal, Procurement und Freigaben strukturiert aufdecken.' },
    ],
  },
  {
    title: 'Value & Metrics',
    description: 'Wirtschaftlichen Wert schnell nachvollziehbar machen.',
    icon: Calculator,
    tools: [
      { label: 'Quick Payback', note: 'Amortisationszeit mit wenigen Eingaben berechnen.', customerReady: true },
      { label: 'Metric Builder', note: 'Pain oder Outcome in belastbare Metrics übersetzen.' },
      { label: 'Cost of Delay', note: 'Kosten des Wartens sichtbar machen.', customerReady: true },
      { label: 'Business Case', note: 'Wert, Kosten und Annahmen kompakt zusammenführen.', customerReady: true },
    ],
  },
  {
    title: 'Discovery, Pain & Differentiation',
    description: 'Gespräche vorbereiten und Erkenntnisse in verwertbare Argumentation übersetzen.',
    icon: Flame,
    tools: [
      { label: 'Discovery Prep', note: 'Konkreten Discovery-Termin fokussiert vorbereiten.' },
      { label: 'Pain → Impact', note: 'Problem, Konsequenz und Business Impact verbinden.' },
      {
        label: 'Value Triangle',
        note: 'Relevante Differenzierung aus Kundensicht herausarbeiten.',
        customerReady: true,
      },
    ],
  },
  {
    title: 'Economic Buyer, Champion & Competition',
    description: 'Wiederkehrende strategische Arbeit rund um Stakeholder und Alternativen unterstützen.',
    icon: UserRound,
    tools: [
      { label: 'EB Meeting Prep', note: 'Economic-Buyer-Termin strukturiert vorbereiten.' },
      { label: 'Champion Tester', note: 'Champion-Verhalten anhand konkreter Merkmale hinterfragen.' },
      {
        label: 'Competition / Alternatives Map',
        note: 'Vendor, Build, andere Initiative und Status quo betrachten.',
      },
    ],
  },
]

const checklists = [
  { label: 'Economic-Buyer-Termin', note: 'Vor dem Termin die entscheidenden Punkte prüfen.' },
  { label: 'Discovery Call', note: 'Pain, Impact, Stakeholder und nächste Erkenntnisse im Blick behalten.' },
  { label: 'POC / Pilot', note: 'Success Criteria, Commitment und den Prozess danach klären.' },
  { label: 'Pricing / Angebot', note: 'Vor kommerziellem Angebot Value und Entscheidungsweg überprüfen.' },
  { label: 'Go-Live / Decision Process', note: 'Plan, Verantwortlichkeiten und Abhängigkeiten plausibilisieren.' },
  { label: 'Closing / Paper Process', note: 'Administrative Schritte und Freigaben nicht zu spät entdecken.' },
]

const knowledgeTopics = [
  { code: 'M', label: 'Metrics', icon: Calculator },
  { code: 'E', label: 'Economic Buyer', icon: UserRound },
  { code: 'D', label: 'Decision Criteria', icon: ListChecks },
  { code: 'D', label: 'Decision Process', icon: Route },
  { code: 'P', label: 'Paper Process', icon: FileText },
  { code: 'I', label: 'Pain & Implication', icon: Flame },
  { code: 'C', label: 'Champion', icon: Award },
  { code: 'C', label: 'Competition', icon: Swords },
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
            <span>Praktische Sales Services</span>
          </span>
        </RouterLink>

        <div class="toolbox-header-meta">
          <Wrench :size="17" aria-hidden="true" />
          <span>Kein CRM · keine Deal-Pflege · fokussierte Arbeitshilfen</span>
        </div>
      </div>
    </header>

    <main id="main-content" class="toolbox-main toolbox-home-v2">
      <section class="container toolbox-hero" aria-labelledby="toolbox-title">
        <div class="toolbox-hero-copy">
          <p class="eyebrow">MEDDPICC Toolbox</p>
          <h1 id="toolbox-title">Das richtige Werkzeug genau dann, wenn du es brauchst.</h1>
          <p class="intro-text">
            Die Toolbox verwaltet keinen Deal vollständig. Sie vereinfacht wiederkehrende Aufgaben, hilft bei typischen
            Sales-Situationen und erklärt MEDDPICC-Konzepte so, dass du nicht jedes Mal im Buch nachschlagen musst.
          </p>
        </div>

        <aside class="toolbox-boundary" aria-label="Abgrenzung der Toolbox">
          <strong>Bewusst kein CRM</strong>
          <p>Keine Pipeline, keine Opportunity-Pflege, kein dauerhaftes MEDDPICC-Scoring.</p>
          <span>Öffnen → nutzen → Ergebnis weiterverwenden.</span>
        </aside>
      </section>

      <section class="container toolbox-entry-grid" aria-label="Einstiege in die Toolbox">
        <a v-for="pillar in pillars" :key="pillar.id" class="toolbox-entry-card" :href="'#' + pillar.id">
          <component :is="pillar.icon" :size="22" :stroke-width="2" aria-hidden="true" />
          <span class="toolbox-entry-kicker">{{ pillar.kicker }}</span>
          <strong>{{ pillar.title }}</strong>
          <span>{{ pillar.description }}</span>
          <span class="toolbox-entry-link">Öffnen <ArrowRight :size="16" aria-hidden="true" /></span>
        </a>
      </section>

      <section id="tools" class="container toolbox-section" aria-labelledby="tools-title">
        <div class="toolbox-section-heading">
          <div>
            <p class="eyebrow">Tools</p>
            <h2 id="tools-title">Wiederkehrende Arbeit schneller erledigen</h2>
            <p>Jedes Tool funktioniert eigenständig und fragt nur die Informationen ab, die es wirklich braucht.</p>
          </div>
          <div class="section-note">
            <Presentation :size="18" aria-hidden="true" />
            <span>Kundenfähige Ergebnisse sind entsprechend markiert.</span>
          </div>
        </div>

        <div class="tool-cluster-grid">
          <article v-for="cluster in toolClusters" :key="cluster.title" class="tool-cluster-card">
            <div class="tool-cluster-heading">
              <component :is="cluster.icon" :size="20" aria-hidden="true" />
              <div>
                <h3>{{ cluster.title }}</h3>
                <p>{{ cluster.description }}</p>
              </div>
            </div>

            <div class="tool-cluster-list">
              <component
                :is="tool.route ? 'RouterLink' : 'div'"
                v-for="tool in cluster.tools"
                :key="tool.label"
                class="tool-row"
                :class="{ 'tool-row--active': tool.route }"
                :to="tool.route"
              >
                <span>
                  <strong>{{ tool.label }}</strong>
                  <small>{{ tool.note }}</small>
                </span>
                <span v-if="tool.customerReady" class="tool-kind tool-kind--customer">Kundenfähig</span>
                <ArrowRight v-else-if="tool.route" :size="17" aria-hidden="true" />
                <span v-else class="microtool-planned">Geplant</span>
              </component>
            </div>
          </article>
        </div>
      </section>

      <section id="checklists" class="container toolbox-section" aria-labelledby="checklists-title">
        <div class="toolbox-section-heading">
          <div>
            <p class="eyebrow">Checklists</p>
            <h2 id="checklists-title">Kurze Orientierung für konkrete Sales-Situationen</h2>
            <p>
              Kein Score und kein Deal-Status. Jeder Punkt erklärt, worum es geht, warum er wichtig ist, woran du ihn
              erkennst und welche Fehlinterpretationen häufig vorkommen.
            </p>
          </div>
          <span class="foundation-badge">Foundation als nächster Roadmap-Schritt</span>
        </div>

        <div class="checklist-preview-grid">
          <article v-for="item in checklists" :key="item.label" class="checklist-preview-card">
            <ListChecks :size="18" aria-hidden="true" />
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.note }}</p>
            </div>
            <span class="microtool-planned">Geplant</span>
          </article>
        </div>

        <div class="checklist-explainer">
          <strong>Ein Checklist-Punkt ist mehr als ein Häkchen.</strong>
          <span>
            Prüffrage → Bedeutung → Warum wichtig? → Erkennungsmerkmale → typische Fehlinterpretation → mögliche Frage
            oder Handlung.
          </span>
        </div>
      </section>

      <section id="knowledge" class="container toolbox-section" aria-labelledby="knowledge-title">
        <div class="toolbox-section-heading">
          <div>
            <p class="eyebrow">Knowledge</p>
            <h2 id="knowledge-title">MEDDPICC nachschlagen, ohne im Buch zu suchen</h2>
            <p>
              Kompakte, praxisnahe Erklärungen bilden die gemeinsame Wissensbasis für Checklists und Hilfetexte in den
              Tools.
            </p>
          </div>
        </div>

        <div class="knowledge-grid" aria-label="MEDDPICC Wissensbereiche">
          <article v-for="topic in knowledgeTopics" :key="topic.code + topic.label" class="knowledge-card">
            <span class="knowledge-letter">{{ topic.code }}</span>
            <component :is="topic.icon" :size="18" aria-hidden="true" />
            <strong>{{ topic.label }}</strong>
            <span class="microtool-planned">Geplant</span>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
