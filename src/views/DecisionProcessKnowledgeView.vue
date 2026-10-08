<script setup lang="ts">
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Compass,
  ListChecks,
  MessageCircleQuestion,
  Route,
  Workflow,
} from '@lucide/vue'

import { decisionProcessKnowledge, decisionProcessPhases } from '../content/meddpicc/decisionProcess'
</script>

<template>
  <div class="site-shell knowledge-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="Zurück zur MEDDPICC Toolbox">
          <span class="brand-mark">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Toolbox</strong>
            <span>Wissen · Decision Process</span>
          </span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/#knowledge">
          <ArrowLeft :size="17" aria-hidden="true" />
          Zur Wissensübersicht
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="knowledge-main">
      <section class="container knowledge-hero" aria-labelledby="knowledge-title">
        <div>
          <div class="tool-intro-meta">
            <span class="tool-kind">Wissen</span>
            <span>Decision Process</span>
          </div>
          <p class="eyebrow">Buying Process & Freigaben</p>
          <h1 id="knowledge-title">{{ decisionProcessKnowledge.title }}</h1>
          <p class="intro-text">{{ decisionProcessKnowledge.lead }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/decision-process">
            <ListChecks :size="18" aria-hidden="true" />
            Decision-Process-Checklist öffnen
          </RouterLink>
        </div>
        <aside class="knowledge-benefit">
          <Compass :size="22" aria-hidden="true" />
          <div>
            <strong>Dein Nutzen</strong>
            <p>{{ decisionProcessKnowledge.benefit }}</p>
          </div>
        </aside>
      </section>

      <section class="container knowledge-layout">
        <article class="knowledge-primary-card" aria-labelledby="definition-title">
          <p class="eyebrow">Kurz erklärt</p>
          <h2 id="definition-title">Was ist der Decision Process?</h2>
          <p class="knowledge-definition">{{ decisionProcessKnowledge.shortDefinition }}</p>
        </article>
        <article class="knowledge-primary-card" aria-labelledby="importance-title">
          <p class="eyebrow">Warum wichtig?</p>
          <h2 id="importance-title">Fortschritt statt Aktivität erkennen</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="point in decisionProcessKnowledge.whyImportant" :key="point">
              <CheckCircle2 :size="17" aria-hidden="true" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="boundary-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Saubere Abgrenzung</p>
            <h2 id="boundary-title">Was, wie und bis zur Unterschrift</h2>
            <p class="section-note">Die drei Fragen ergänzen sich, sind aber keine austauschbaren MEDDPICC-Elemente.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article
            v-for="item in decisionProcessKnowledge.distinctions"
            :key="item.title"
            class="knowledge-concept-card"
          >
            <Workflow :size="19" aria-hidden="true" />
            <div>
              <h3>{{ item.title }}</h3>
              <p>
                <strong>{{ item.definition }}</strong>
              </p>
              <p>{{ item.example }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="phases-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Kundenseitige Etappen</p>
            <h2 id="phases-title">Validation, Business Approval und Paper Process</h2>
            <p class="section-note">
              Die technische Validierung steht typischerweise zuerst. Business Approval kann sich damit überschneiden;
              ein Approval ohne erkennbaren technischen Prüfpfad ist ein Warnsignal. Paper Process ist ein eigener,
              teils schon früher beginnender administrativer Prüfpfad.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="phase in decisionProcessPhases" :key="phase.title" class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div>
              <h3>{{ phase.title }}</h3>
              <p>{{ phase.description }}</p>
              <p><strong>Benötigte Evidenz:</strong> {{ phase.evidence }}</p>
              <p><strong>Nachfrage:</strong> {{ phase.question }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="mutual-plan-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Gemeinsamer Entscheidungsplan</p>
            <h2 id="mutual-plan-title">Die Timeline braucht Aufgaben auf beiden Seiten</h2>
            <p class="section-note">
              Eine Demo-Liste des Verkäufers reicht nicht. Eine gemeinsame Timeline zeigt sowohl Kundenentscheidungen
              als auch die dafür nötigen Beiträge des Anbieters. Beide Seiten bestätigen ihre Verpflichtungen.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article
            v-for="part in decisionProcessKnowledge.balancedPlan"
            :key="part.title"
            class="knowledge-concept-card"
          >
            <Workflow :size="19" aria-hidden="true" />
            <div>
              <h3>{{ part.title }}</h3>
              <p>{{ part.meaning }}</p>
              <p><strong>Konkrete Frage:</strong> {{ part.question }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Compelling Event und Go-Live-Plan">
        <article class="knowledge-primary-card">
          <p class="eyebrow">Compelling Event</p>
          <h2>{{ decisionProcessKnowledge.compellingEvent.headline }}</h2>
          <p>{{ decisionProcessKnowledge.compellingEvent.meaning }}</p>
          <p><strong>Discovery-Frage:</strong> {{ decisionProcessKnowledge.compellingEvent.question }}</p>
          <p><strong>Evidenz:</strong> {{ decisionProcessKnowledge.compellingEvent.proof }}</p>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Go-Live rückwärts planen</p>
          <h2>Vom Kundenziel bis zur heutigen Entscheidung</h2>
          <ol class="knowledge-action-list">
            <li v-for="point in decisionProcessKnowledge.goLivePlanning" :key="point">{{ point }}</li>
          </ol>
          <RouterLink class="inline-link" to="/tools/reverse-timeline">Go-Live-Rückwärtsplanung öffnen</RouterLink>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="example-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Praxisbeispiel · CRM-Auswahl</p>
            <h2 id="example-title">Wo die Entscheidung noch offen ist</h2>
          </div>
        </div>
        <article class="knowledge-primary-card">
          <p>
            Ein CRM-POC wurde durchgeführt. Der Projektleiter bezeichnet ihn als erfolgreich und erwartet die Auswahl im
            Steering Committee. Einkauf und Legal wurden noch nicht einbezogen. Die Geschäftsführung kennt den Business
            Case, hat die Investition aber nicht bestätigt.
          </p>
          <p>
            <strong>Bekannt:</strong> Der Test wurde durchgeführt und der Projektleiter bewertet ihn positiv.
            <strong>Nicht belegt:</strong>
            formale POC-Abnahme, wirtschaftliches Commitment, tatsächlicher Gremiumsbeschluss und der Ablauf bis zur
            Bestellung. Das sind unterschiedliche Qualifizierungslücken.
          </p>
          <p>
            <strong>Nächste Aktion:</strong> Mit dem Projektleiter die zuständigen Abnehmer, die Beschlussvorlage, den
            Gremiumstermin und den separaten Paper Process samt Verantwortlichen klären. Danach die Schritte mit den
            beteiligten Personen validieren.
          </p>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="mistakes-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Rote Flaggen</p>
            <h2 id="mistakes-title">Typische Kurzschlüsse</h2>
          </div>
        </div>
        <div class="knowledge-details-list">
          <details v-for="pitfall in decisionProcessKnowledge.pitfalls" :key="pitfall.claim" class="knowledge-detail">
            <summary>
              <CircleAlert :size="18" aria-hidden="true" />
              <span>{{ pitfall.claim }}</span>
            </summary>
            <p>{{ pitfall.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Discovery und Vorgehen">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Im Kundengespräch</p>
          <h2>Diese Fragen bringen Klarheit</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in decisionProcessKnowledge.discoveryQuestions" :key="question">{{ question }}</li>
          </ul>
        </article>
        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Praktisch vorgehen</p>
          <h2>Den Entscheidungsweg belastbar machen</h2>
          <ol class="knowledge-action-list">
            <li v-for="action in decisionProcessKnowledge.practiceActions" :key="action">{{ action }}</li>
          </ol>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Quellen und fachliche Einordnung">
        <article class="knowledge-primary-card">
          <p class="knowledge-practical-takeaway">
            <strong>Für die Praxis:</strong> {{ decisionProcessKnowledge.practicalTakeaway }}
          </p>
        </article>
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <p>Die Beispiele und Fragen sind auf B2B-Software-Vertrieb übertragen und keine wörtlichen Zitate.</p>
            <div class="knowledge-author-grid">
              <div v-for="viewpoint in decisionProcessKnowledge.perspectives" :key="viewpoint.author">
                <strong>{{ viewpoint.author }}</strong>
                <p>{{ viewpoint.summary }}</p>
                <small>{{ viewpoint.source }}</small>
              </div>
            </div>
            <ul>
              <li v-for="source in decisionProcessKnowledge.sourceNotes" :key="source">{{ source }}</li>
            </ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
