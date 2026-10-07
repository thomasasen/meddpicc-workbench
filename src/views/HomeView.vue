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
    kicker: 'Aufgabe erledigen',
    description: 'Berechnen, vorbereiten oder visualisieren und direkt ein nutzbares Ergebnis erhalten.',
    icon: Wrench,
  },
  {
    id: 'checklists',
    title: 'Checklists',
    kicker: 'Sicher vorbereiten',
    description: 'Vor wichtigen Sales-Situationen die entscheidenden Punkte kurz prüfen und richtig einordnen.',
    icon: ListChecks,
  },
  {
    id: 'knowledge',
    title: 'Wissen',
    kicker: 'Schnell verstehen',
    description: 'MEDDPICC-Begriffe, Zusammenhänge und typische Fehlinterpretationen gezielt nachschlagen.',
    icon: FileText,
  },
]

const toolClusters = [
  {
    title: 'Go-Live & Buying Process',
    description: 'Zeitplan und Entscheidungsweg gemeinsam mit dem Kunden greifbar machen.',
    icon: Route,
    tools: [
      {
        label: 'Go-Live-Rückwärtsplanung',
        note: 'Zieltermin und Schritte eingeben – du erhältst späteste Starttermine und eine teilbare Timeline.',
        route: '/tools/reverse-timeline',
        customerReady: true,
      },
      {
        label: 'Go-Live Plan Builder',
        note: 'Prozessschritte und Verantwortliche zusammenführen – daraus entsteht ein gemeinsamer Go-Live-Plan.',
        customerReady: true,
      },
      {
        label: 'Paper Process Explorer',
        note: 'Legal, Procurement und Freigaben Schritt für Schritt durchgehen – damit späte Überraschungen sichtbar werden.',
      },
    ],
  },
  {
    title: 'Value & Metrics',
    description: 'Geschäftlichen Nutzen schneller quantifizieren und verständlich kommunizieren.',
    icon: Calculator,
    tools: [
      {
        label: 'Quick Payback',
        note: 'Investition und Nutzen eingeben – du siehst sofort, wann sich die Investition amortisiert.',
        customerReady: true,
      },
      {
        label: 'Metric Builder',
        note: 'Aus Pain oder gewünschtem Outcome eine belastbare Kennzahl mit nachvollziehbarer Logik ableiten.',
      },
      {
        label: 'Cost of Delay',
        note: 'Den wirtschaftlichen Effekt einer Verzögerung pro Woche oder Monat sichtbar machen.',
        customerReady: true,
      },
      {
        label: 'Business Case',
        note: 'Nutzen, Kosten und Annahmen strukturiert zusammenführen – als Grundlage für die Kundendiskussion.',
        customerReady: true,
      },
    ],
  },
  {
    title: 'Discovery, Pain & Differentiation',
    description: 'Gespräche gezielter führen und aus Erkenntnissen verwertbare Argumentation machen.',
    icon: Flame,
    tools: [
      {
        label: 'Discovery Prep',
        note: 'Vor dem Kundentermin relevante Themen und Fragen strukturieren – statt unvorbereitet in Discovery zu gehen.',
      },
      {
        label: 'Pain → Impact',
        note: 'Vom beschriebenen Problem zu Konsequenz und Business Impact kommen – damit Pain nicht abstrakt bleibt.',
      },
      {
        label: 'Value Triangle',
        note: 'Kundenbedarf, eigene Stärke und Wettbewerb gegenüberstellen – um echte Differenzierung herauszuarbeiten.',
        customerReady: true,
      },
    ],
  },
  {
    title: 'Economic Buyer, Champion & Competition',
    description: 'Stakeholder und Alternativen besser einordnen und Termine gezielter vorbereiten.',
    icon: UserRound,
    tools: [
      {
        label: 'EB Meeting Prep',
        note: 'Economic-Buyer-Termin auf Value, Kernfragen und gewünschtes Commitment vorbereiten.',
      },
      {
        label: 'Champion Tester',
        note: 'An konkreten Verhaltensmerkmalen prüfen, ob ein Kontakt tatsächlich als Champion belastbar ist.',
      },
      {
        label: 'Competition / Alternatives Map',
        note: 'Vendor, Eigenbau, andere Initiative und Status quo sichtbar machen – damit du gegen die echte Alternative verkaufst.',
      },
    ],
  },
]

const checklists = [
  {
    label: 'Economic Buyer',
    note: 'Kurz prüfen, ob du wirtschaftliche Autorität, Business Outcome, Value und deine Evidenz wirklich verstanden hast.',
    route: '/checklists/economic-buyer',
  },
  {
    label: 'Economic-Buyer-Termin',
    note: 'Vor dem Termin in wenigen Minuten prüfen, ob Value, Fragen und gewünschtes Ergebnis sauber vorbereitet sind.',
    route: '/checklists/economic-buyer-meeting',
  },
  {
    label: 'Discovery Call',
    note: 'Vor dem Gespräch prüfen, ob du Pain, Impact, Stakeholder und den nächsten Erkenntnisschritt im Blick hast.',
  },
  {
    label: 'POC / Pilot',
    note: 'Vor dem Start klären, was Erfolg bedeutet, wer committed ist und was nach einem erfolgreichen POC passiert.',
  },
  {
    label: 'Pricing / Angebot',
    note: 'Vor dem Angebot prüfen, ob Value, Entscheidungsweg und kommerzieller Kontext ausreichend verstanden sind.',
  },
  {
    label: 'Go-Live / Decision Process',
    note: 'Zeitplan, Verantwortlichkeiten und Abhängigkeiten kurz gegenprüfen, bevor der Plan mit dem Kunden geteilt wird.',
  },
  {
    label: 'Closing / Paper Process',
    note: 'Vor der Schlussphase prüfen, ob Freigaben, Einkauf, Legal und Signaturweg wirklich geklärt sind.',
  },
]

const knowledgeTopics = [
  {
    code: 'M',
    label: 'Metrics',
    note: 'Wann ist eine Metric belastbar und wie wird daraus wirtschaftlicher Impact?',
    icon: Calculator,
  },
  {
    code: 'E',
    label: 'Economic Buyer',
    note: 'Woran erkennst du den EB und was unterscheidet ihn von Sponsor oder Entscheider?',
    icon: UserRound,
    route: '/knowledge/economic-buyer',
  },
  {
    code: 'D',
    label: 'Decision Criteria',
    note: 'Welche Kriterien beeinflussen die Auswahl und wie lassen sie sich richtig einordnen?',
    icon: ListChecks,
  },
  {
    code: 'D',
    label: 'Decision Process',
    note: 'Wie unterscheiden sich Validation und Approval und wer entscheidet wann?',
    icon: Route,
  },
  {
    code: 'P',
    label: 'Paper Process',
    note: 'Welche administrativen Schritte liegen zwischen Entscheidung und Unterschrift?',
    icon: FileText,
  },
  {
    code: 'I',
    label: 'Pain & Implication',
    note: 'Wie wird aus einem Problem eine relevante geschäftliche Konsequenz?',
    icon: Flame,
  },
  {
    code: 'C',
    label: 'Champion',
    note: 'Was macht einen echten Champion aus und welche Signale werden häufig überschätzt?',
    icon: Award,
  },
  {
    code: 'C',
    label: 'Competition',
    note: 'Warum gehören Status quo, Eigenbau und andere Initiativen genauso zum Wettbewerb?',
    icon: Swords,
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
            <span>Praktische Sales Services</span>
          </span>
        </RouterLink>

        <div class="toolbox-header-meta">
          <Wrench :size="17" aria-hidden="true" />
          <span>Berechnen · vorbereiten · nachschlagen</span>
        </div>
      </div>
    </header>

    <main id="main-content" class="toolbox-main toolbox-home-v2">
      <section class="container toolbox-hero" aria-labelledby="toolbox-title">
        <div class="toolbox-hero-copy">
          <p class="eyebrow">MEDDPICC Toolbox</p>
          <h1 id="toolbox-title">Wiederkehrende Sales-Aufgaben schneller und sicherer erledigen.</h1>
          <p class="intro-text">
            Nutze ein passendes Tool für konkrete Arbeit, eine Checklist zur Vorbereitung oder die Wissenshilfe, wenn du
            einen MEDDPICC-Punkt kurz und praxisnah nachschlagen möchtest.
          </p>
        </div>
      </section>

      <section class="container toolbox-entry-grid" aria-label="Einstiege in die Toolbox">
        <a v-for="pillar in pillars" :key="pillar.id" class="toolbox-entry-card" :href="'#' + pillar.id">
          <component :is="pillar.icon" :size="22" :stroke-width="2" aria-hidden="true" />
          <span class="toolbox-entry-kicker">{{ pillar.kicker }}</span>
          <strong>{{ pillar.title }}</strong>
          <span>{{ pillar.description }}</span>
          <span class="toolbox-entry-link">Ansehen <ArrowRight :size="16" aria-hidden="true" /></span>
        </a>
      </section>

      <section id="tools" class="container toolbox-section" aria-labelledby="tools-title">
        <div class="toolbox-section-heading">
          <div>
            <p class="eyebrow">Tools</p>
            <h2 id="tools-title">Eine konkrete Aufgabe erledigen</h2>
            <p>
              Wähle die Aufgabe aus, die gerade ansteht. Jeder Service führt mit wenigen Eingaben zu einem direkt
              nutzbaren Ergebnis.
            </p>
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
                <span class="tool-row-meta">
                  <span v-if="tool.customerReady" class="tool-kind tool-kind--customer">Kundenfähig</span>
                  <ArrowRight v-if="tool.route" :size="17" aria-hidden="true" />
                  <span v-else class="microtool-planned">Geplant</span>
                </span>
              </component>
            </div>
          </article>
        </div>
      </section>

      <section id="checklists" class="container toolbox-section" aria-labelledby="checklists-title">
        <div class="toolbox-section-heading">
          <div>
            <p class="eyebrow">Checklists</p>
            <h2 id="checklists-title">Vor wichtigen Sales-Situationen kurz gegenprüfen</h2>
            <p>
              Nutze eine Checklist direkt vor einem Termin oder Prozessschritt. Zu jedem Punkt bekommst du bei Bedarf
              eine Erklärung, Erkennungsmerkmale, typische Fehlinterpretationen und eine mögliche Frage oder Handlung.
            </p>
          </div>
        </div>

        <div class="checklist-preview-grid">
          <component
            :is="item.route ? 'RouterLink' : 'article'"
            v-for="item in checklists"
            :key="item.label"
            class="checklist-preview-card"
            :class="{ 'checklist-preview-card--active': item.route }"
            :to="item.route"
          >
            <ListChecks :size="18" aria-hidden="true" />
            <div>
              <strong>{{ item.label }}</strong>
              <p>{{ item.note }}</p>
            </div>
            <ArrowRight v-if="item.route" class="checklist-card-action" :size="17" aria-hidden="true" />
            <span v-else class="microtool-planned">Geplant</span>
          </component>
        </div>

        <div class="checklist-explainer">
          <strong>So hilft dir ein einzelner Punkt:</strong>
          <span>
            Prüffrage → Bedeutung → Warum relevant? → Woran erkenne ich es? → typische Fehlinterpretation → mögliche
            Frage oder Handlung.
          </span>
        </div>
      </section>

      <section id="knowledge" class="container toolbox-section" aria-labelledby="knowledge-title">
        <div class="toolbox-section-heading">
          <div>
            <p class="eyebrow">Wissen</p>
            <h2 id="knowledge-title">MEDDPICC-Fragen schnell und praxisnah klären</h2>
            <p>
              Öffne genau das Thema, bei dem du unsicher bist. Die Wissenshilfe erklärt Bedeutung, praktische Anwendung
              und typische Fehlinterpretationen kompakt.
            </p>
          </div>
        </div>

        <div class="knowledge-grid" aria-label="MEDDPICC Wissensbereiche">
          <component
            :is="topic.route ? 'RouterLink' : 'article'"
            v-for="topic in knowledgeTopics"
            :key="topic.code + topic.label"
            class="knowledge-card"
            :class="{ 'knowledge-card--active': topic.route }"
            :to="topic.route"
          >
            <span class="knowledge-letter">{{ topic.code }}</span>
            <component :is="topic.icon" :size="18" aria-hidden="true" />
            <div>
              <strong>{{ topic.label }}</strong>
              <small>{{ topic.note }}</small>
            </div>
            <ArrowRight v-if="topic.route" class="knowledge-card-action" :size="17" aria-hidden="true" />
            <span v-else class="microtool-planned">Geplant</span>
          </component>
        </div>
      </section>
    </main>
  </div>
</template>
