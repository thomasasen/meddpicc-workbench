<script setup lang="ts">
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Compass,
  GitCompareArrows,
  ListChecks,
  MessageCircleQuestion,
  Route,
} from '@lucide/vue'

import { competitionKnowledge as competition } from '../content/meddpicc/competition'
</script>

<template>
  <!-- prettier-ignore -->
  <div class="site-shell knowledge-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="Zurück zur MEDDPICC Toolbox">
          <span class="brand-mark">M</span>
          <span class="brand-copy"><strong>MEDDPICC Toolbox</strong><span>Wissen · Competition</span></span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/#knowledge">
          <ArrowLeft :size="17" aria-hidden="true" />
          Zur Wissensübersicht
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="knowledge-main">
      <section class="container knowledge-hero" aria-labelledby="competition-title">
        <div>
          <div class="tool-intro-meta"><span class="tool-kind">Wissen</span><span>Competition</span></div>
          <p class="eyebrow">Alternativen · Entscheider · Kundenevidenz</p>
          <h1 id="competition-title">{{ competition.title }}</h1>
          <p class="intro-text">{{ competition.lead }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/competition">
            <ListChecks :size="18" aria-hidden="true" />
            Competition-Checklist öffnen
          </RouterLink>
        </div>
        <aside class="knowledge-benefit">
          <Compass :size="22" aria-hidden="true" />
          <div><strong>Dein Nutzen</strong><p>{{ competition.benefit }}</p></div>
        </aside>
      </section>

      <section class="container knowledge-layout" aria-label="Definition und Nutzen">
        <article class="knowledge-primary-card">
          <p class="eyebrow">Kurz erklärt</p>
          <h2>Was bedeutet Competition?</h2>
          <p class="knowledge-definition">{{ competition.shortDefinition }}</p>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Warum relevant?</p>
          <h2>Auch ohne Konkurrenzangebot</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="reason in competition.whyImportant" :key="reason">
              <CheckCircle2 :size="17" aria-hidden="true" />
              <span>{{ reason }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="types-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Vier Alternativarten</p>
            <h2 id="types-title">Gegen wen oder was konkurrieren wir?</h2>
            <p class="section-note">Es geht um dieselbe Entscheidung, Ressourcen oder Prioritäten – nicht nur um Anbieterlisten.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="type in competition.types" :key="type.id" class="knowledge-concept-card">
            <GitCompareArrows :size="19" aria-hidden="true" />
            <div>
              <h3>{{ type.title }}</h3>
              <p>{{ type.meaning }}</p>
              <p><strong>Discovery:</strong> {{ type.question }}</p>
              <details class="knowledge-detail">
                <summary>Fehlinterpretation und nächste Handlung</summary>
                <p><strong>Nicht verwechseln:</strong> {{ type.trap }}</p>
                <p><strong>Weiterdenken:</strong> {{ type.action }}</p>
              </details>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="evidence-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Woher wissen wir das?</p>
            <h2 id="evidence-title">Kundenevidenz ist keine Seller-Hypothese</h2>
            <p class="section-note">Eine berichtete Option ist nicht automatisch budgetiert, genehmigt oder in der Auswahl.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="level in competition.evidence" :key="level.title" class="knowledge-concept-card">
            <BookOpen :size="19" aria-hidden="true" />
            <div><h3>{{ level.title }}</h3><p>{{ level.meaning }}</p></div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="perspective-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Drei Analyseperspektiven · keine weiteren Alternativarten</p>
            <h2 id="perspective-title">Warum könnte die Alternative gewinnen?</h2>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="perspective in competition.perspectives" :key="perspective.title" class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div><h3>{{ perspective.title }}</h3><p>{{ perspective.meaning }}</p></div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Differenzierung und Value Triangle">
        <article class="knowledge-primary-card">
          <p class="eyebrow">Kundennutzen nachweisen</p>
          <h2>Aus Pain wird echte Differenzierung</h2>
          <ol class="knowledge-action-list">
            <li v-for="step in competition.differentiation" :key="step">{{ step }}</li>
          </ol>
          <p class="section-note">Feature-Liste ≠ kundenspezifischer Value.</p>
          <p><RouterLink class="inline-link" to="/knowledge/pain-implication">Pain / Implication nachschlagen</RouterLink></p>
          <p><RouterLink class="inline-link" to="/knowledge/metrics">Metrics nachschlagen</RouterLink></p>
          <p><RouterLink class="inline-link" to="/knowledge/decision-criteria">Decision Criteria nachschlagen</RouterLink></p>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Value Triangle · sieben Zonen</p>
          <h2>VALUE ist nicht jedes Alleinstellungsmerkmal</h2>
          <p>Vergleiche die bestätigten Käuferkriterien mit unserer Lösung und einer konkreten Alternative. Ohne Evidenz keine Zuordnung.</p>
          <div class="knowledge-details-list">
            <details v-for="zone in competition.zones" :key="zone.id" class="knowledge-detail">
              <summary><GitCompareArrows :size="17" aria-hidden="true" /><span>{{ zone.title }}</span></summary>
              <p>{{ zone.meaning }}</p>
            </details>
          </div>
          <p><RouterLink class="inline-link" to="/knowledge/decision-criteria">Decision Criteria vertiefen</RouterLink></p>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="dive-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Gezielt vertiefen</p>
            <h2 id="dive-title">Inertia, Build, Prioritäten und Gegeninteressen</h2>
            <p class="section-note">Warnsignale prüfen und faire Gesprächsfragen stellen. Keine automatische Lost-Prognose.</p>
          </div>
        </div>
        <div class="knowledge-details-list">
          <details v-for="item in competition.deepDives" :key="item.title" class="knowledge-detail">
            <summary><BookOpen :size="17" aria-hidden="true" /><span>{{ item.title }}</span></summary>
            <p>{{ item.meaning }}</p>
            <p><strong>Offene Frage:</strong> {{ item.question }}</p>
          </details>
        </div>
        <p class="section-note">
          Weitere Einordnung:
          <RouterLink class="inline-link" to="/knowledge/champion">Champion</RouterLink> ·
          <RouterLink class="inline-link" to="/knowledge/economic-buyer">Economic Buyer</RouterLink> ·
          <RouterLink class="inline-link" to="/knowledge/decision-process">Decision Process</RouterLink> ·
          <RouterLink class="inline-link" to="/knowledge/paper-process">Paper Process</RouterLink>
        </p>
      </section>

      <section class="container knowledge-section" aria-labelledby="redflags-title">
        <div class="section-heading-row">
          <div><p class="eyebrow">Typische Denkfehler</p><h2 id="redflags-title">Red Flags im Wettbewerb</h2></div>
        </div>
        <div class="knowledge-details-list">
          <details v-for="flag in competition.redFlags" :key="flag.claim" class="knowledge-detail">
            <summary><CircleAlert :size="18" aria-hidden="true" /><span>{{ flag.claim }}</span></summary>
            <p>{{ flag.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="case-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Praxisbeispiel · CRM / SaaS</p>
            <h2 id="case-title">Ein Angebot, mehrere mögliche Alternativen</h2>
            <p class="section-note">{{ competition.scenario.label }}</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="step in competition.scenario.steps" :key="step.title" class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.detail }}</p>
              <p><strong>Nächste Validierung:</strong> {{ step.next }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Fragen und Handlungen">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Offen fragen</p>
          <h2>Fragen für das nächste Kundengespräch</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in competition.questions" :key="question">{{ question }}</li>
          </ul>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Nächste Aktion</p>
          <h2>Eine Unbekannte sachlich klären</h2>
          <p>{{ competition.practicalTakeaway }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/competition">
            <ListChecks :size="17" aria-hidden="true" />
            Zur Competition-Checklist
          </RouterLink>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Quellen und fachliche Einordnung">
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <p>Die Discovery-Fragen sind eigene Praxisableitungen; das CRM-Beispiel ist frei konstruiert. Die fachliche Kritik erfolgt als simuliertes Red Team, nicht durch die Autoren.</p>
            <ul><li v-for="note in competition.sourceNotes" :key="note">{{ note }}</li></ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
