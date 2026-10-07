<script setup lang="ts">
type ToolItem = {
  title: string
  description: string
  audience: 'customer' | 'internal'
  route?: string
}

type MeddpiccGroup = {
  code: string
  title: string
  description: string
  tools: ToolItem[]
}

const groups: MeddpiccGroup[] = [
  {
    code: 'M',
    title: 'Metrics',
    description: 'Wirtschaftlichen Nutzen messbar und kundentauglich machen.',
    tools: [
      { title: 'Business Case', description: 'Current State, Nutzen und Investition zusammenführen.', audience: 'customer' },
      { title: 'ROI / Payback', description: 'ROI und Amortisationsdauer transparent berechnen.', audience: 'customer' },
      { title: 'Cost of Delay', description: 'Kosten einer Verzögerung sichtbar machen.', audience: 'customer' },
    ],
  },
  {
    code: 'EB',
    title: 'Economic Buyer',
    description: 'Economic Buyer identifizieren, vorbereiten und auf wirtschaftliche Priorität fokussieren.',
    tools: [
      { title: 'EB Qualification Check', description: 'Authority, Priorität und Zugang prüfen.', audience: 'internal' },
      { title: 'EB Meeting Prep', description: 'Gesprächsziel und relevante Business Outcomes vorbereiten.', audience: 'internal' },
      { title: 'EB Value Story', description: 'Wirtschaftliche Argumentation für den Economic Buyer strukturieren.', audience: 'customer' },
    ],
  },
  {
    code: 'DC',
    title: 'Decision Criteria',
    description: 'Entscheidungskriterien gemeinsam strukturieren und Differenzierung sichtbar machen.',
    tools: [
      { title: 'Decision Matrix', description: 'Kriterien, Gewichtung und Bewertung vergleichbar darstellen.', audience: 'customer' },
      { title: 'Criteria Workshop', description: 'Kriterien für einen Kundenworkshop vorbereiten.', audience: 'customer' },
      { title: 'Differentiation Map', description: 'Value, Parity und Differenzierung nachvollziehbar ordnen.', audience: 'internal' },
    ],
  },
  {
    code: 'DP',
    title: 'Decision Process',
    description: 'Entscheidungsweg, Meilensteine und Timing gemeinsam planbar machen.',
    tools: [
      {
        title: 'Go-Live-Rückwärtsplanung',
        description: 'Vom gewünschten Go-Live rückwärts zu den spätesten Meilensteinen planen.',
        audience: 'customer',
        route: '/tools/go-live-rueckwaertsplanung',
      },
      { title: 'Decision Map', description: 'Schritte, Owner und Abhängigkeiten visualisieren.', audience: 'customer' },
      { title: 'Mutual Action Plan', description: 'Gemeinsame nächste Schritte mit dem Kunden strukturieren.', audience: 'customer' },
    ],
  },
  {
    code: 'PP',
    title: 'Paper Process',
    description: 'Procurement, Legal, Security und Signatur rechtzeitig sichtbar machen.',
    tools: [
      { title: 'Procurement Timeline', description: 'Formale Schritte und Lead Times planen.', audience: 'customer' },
      { title: 'Closing Plan', description: 'Formale Voraussetzungen bis zur Unterschrift strukturieren.', audience: 'internal' },
      { title: 'Paper Process Check', description: 'Versteckte Verzögerungsrisiken identifizieren.', audience: 'internal' },
    ],
  },
  {
    code: 'I',
    title: 'Identify / Implicate Pain',
    description: 'Vom Problem zum Business Impact und zur Veränderungspriorität kommen.',
    tools: [
      { title: 'Pain → Impact', description: 'Problem, Auswirkungen und Konsequenz des Nicht-Handelns verbinden.', audience: 'customer' },
      { title: 'Cost of Pain', description: 'Geschäftliche Auswirkungen quantifizieren.', audience: 'customer' },
      { title: 'Executive Problem Statement', description: 'Pain und Business Impact managementtauglich formulieren.', audience: 'customer' },
    ],
  },
  {
    code: 'C',
    title: 'Champion',
    description: 'Champion erkennen, entwickeln und durch konkretes Verhalten testen.',
    tools: [
      { title: 'Champion Tester', description: 'Champion-Evidence statt Sympathie prüfen.', audience: 'internal' },
      { title: 'Champion Development', description: 'Vom Coach zum belastbaren Champion entwickeln.', audience: 'internal' },
      { title: 'Champion Test vorbereiten', description: 'Nächsten beobachtbaren Champion-Test definieren.', audience: 'internal' },
    ],
  },
  {
    code: 'C',
    title: 'Competition',
    description: 'Direkte Anbieter, Status quo, Do Nothing und interne Alternativen sichtbar machen.',
    tools: [
      { title: 'Competition Map', description: 'Alle relevanten Alternativen strukturiert vergleichen.', audience: 'internal' },
      { title: 'Status quo / Do Nothing', description: 'Trägheit als echten Wettbewerber qualifizieren.', audience: 'internal' },
      { title: 'Differentiation Matrix', description: 'Unterschiede kundenfähig gegenüberstellen.', audience: 'customer' },
    ],
  },
]
</script>

<template>
  <div class="toolbox-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="toolbox-header">
      <div class="container toolbox-header-inner">
        <RouterLink class="toolbox-brand" to="/" aria-label="MEDDPICC Toolbox Startseite">
          <span class="toolbox-brand-mark" aria-hidden="true">M</span>
          <span>
            <strong>MEDDPICC Toolbox</strong>
            <small>Microtools für komplexen B2B-Sales</small>
          </span>
        </RouterLink>
        <span class="local-first-label">Local-first · ohne Deal-Akte nutzbar</span>
      </div>
    </header>

    <main id="main-content" class="container toolbox-main">
      <section class="toolbox-intro" aria-labelledby="toolbox-title">
        <p class="eyebrow">Werkzeug wählen</p>
        <h1 id="toolbox-title">MEDDPICC nicht pflegen. MEDDPICC anwenden.</h1>
        <p>
          Jedes Werkzeug löst eine konkrete Verkäuferaufgabe und fragt nur die Informationen ab, die es dafür wirklich
          braucht. Kundenfähige Ergebnisse lassen sich direkt in Meetings und Präsentationen weiterverwenden.
        </p>
      </section>

      <section class="meddpicc-directory" aria-label="MEDDPICC Werkzeuge">
        <article v-for="group in groups" :key="group.title" class="meddpicc-group">
          <div class="meddpicc-group-identity">
            <span class="meddpicc-code">{{ group.code }}</span>
            <div>
              <h2>{{ group.title }}</h2>
              <p>{{ group.description }}</p>
            </div>
          </div>

          <div class="microtool-list">
            <RouterLink v-for="tool in group.tools.filter((item) => item.route)" :key="tool.title" class="microtool" :to="tool.route!">
              <span class="microtool-topline">
                <strong>{{ tool.title }}</strong>
                <span class="audience-badge audience-badge--customer">Kundenfähig</span>
              </span>
              <span>{{ tool.description }}</span>
              <span class="microtool-cta">Öffnen</span>
            </RouterLink>

            <button
              v-for="tool in group.tools.filter((item) => !item.route)"
              :key="tool.title"
              class="microtool microtool--planned"
              type="button"
              disabled
            >
              <span class="microtool-topline">
                <strong>{{ tool.title }}</strong>
                <span class="audience-badge" :class="'audience-badge--' + tool.audience">
                  {{ tool.audience === 'customer' ? 'Kundenfähig' : 'Intern' }}
                </span>
              </span>
              <span>{{ tool.description }}</span>
              <span class="microtool-cta">Geplant</span>
            </button>
          </div>
        </article>
      </section>
    </main>

    <footer class="toolbox-footer">
      <div class="container">
        <strong>Prinzip:</strong> Microtool zuerst. Ein optionaler Deal Workspace darf später Ergebnisse verbinden, ist
        aber keine Voraussetzung für die Nutzung.
      </div>
    </footer>
  </div>
</template>
