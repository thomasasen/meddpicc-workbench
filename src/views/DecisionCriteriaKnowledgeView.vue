<script setup lang="ts">
import { ArrowLeft, CheckCircle2, CircleAlert, Compass, ListChecks, MessageCircleQuestion, Route } from '@lucide/vue'

import {
  complementaryCriteria,
  criterionCategories,
  decisionCriteriaKnowledge,
  valueTriangleZones,
} from '../content/meddpicc/decisionCriteria'
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
            <span>Wissen · Decision Criteria</span>
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
            <span>Decision Criteria</span>
          </div>
          <p class="eyebrow">Auswahlkriterien & Differenzierung</p>
          <h1 id="knowledge-title">{{ decisionCriteriaKnowledge.title }}</h1>
          <p class="intro-text">{{ decisionCriteriaKnowledge.lead }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/decision-criteria">
            <ListChecks :size="18" aria-hidden="true" />
            Decision-Criteria-Checklist öffnen
          </RouterLink>
        </div>
        <aside class="knowledge-benefit">
          <Compass :size="22" aria-hidden="true" />
          <div>
            <strong>Dein Nutzen</strong>
            <p>{{ decisionCriteriaKnowledge.benefit }}</p>
          </div>
        </aside>
      </section>

      <section class="container knowledge-layout">
        <article class="knowledge-primary-card" aria-labelledby="definition-title">
          <p class="eyebrow">Kurz erklärt</p>
          <h2 id="definition-title">Was sind Decision Criteria?</h2>
          <p class="knowledge-definition">{{ decisionCriteriaKnowledge.shortDefinition }}</p>
        </article>
        <article class="knowledge-primary-card" aria-labelledby="relevance-title">
          <p class="eyebrow">Warum relevant?</p>
          <h2 id="relevance-title">Was macht Kriterien belastbar?</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="point in decisionCriteriaKnowledge.whyImportant" :key="point">
              <CheckCircle2 :size="17" aria-hidden="true" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="types-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Drei Blickwinkel</p>
            <h2 id="types-title">Technisch, wirtschaftlich und partnerschaftlich</h2>
            <p class="section-note">
              Welcher Bereich im Einzelfall entscheidend ist, hängt von Kundenkontext und beteiligten Stakeholdern ab.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="category in criterionCategories" :key="category.code" class="knowledge-concept-card">
            <ListChecks :size="19" aria-hidden="true" />
            <div>
              <h3>{{ category.label }} · {{ category.code }}</h3>
              <p>{{ category.meaning }}</p>
              <p><strong>Frage:</strong> {{ category.question }}</p>
              <p><strong>Nicht verwechseln:</strong> {{ category.caution }}</p>
            </div>
          </article>
        </div>
        <article class="knowledge-primary-card">
          <h3>Weitere praktische Einteilung</h3>
          <div class="knowledge-concept-grid">
            <div v-for="group in complementaryCriteria" :key="group.label">
              <strong>{{ group.label }}</strong>
              <p>{{ group.meaning }}</p>
            </div>
          </div>
          <p class="section-note">
            Beide Einteilungen beleuchten ähnliche Fragen aus unterschiedlichen Perspektiven; sie sind keine
            deckungsgleichen Kategorien.
          </p>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="validation-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Kundenevidenz</p>
            <h2 id="validation-title">Von der Anforderung zum bestätigten Entscheidungskriterium</h2>
            <p class="section-note">
              Ein Funktionswunsch oder Verkäuferargument allein ist noch kein gültiges Muss-Kriterium.
            </p>
          </div>
        </div>
        <article class="knowledge-primary-card">
          <ol class="knowledge-action-list">
            <li>Welcher <strong>Pain</strong> oder welches Geschäftsrisiko steht dahinter?</li>
            <li>Welcher <strong>Use Case</strong> muss tatsächlich funktionieren?</li>
            <li>Welche <strong>Capability</strong> braucht dieser Ablauf?</li>
            <li>Welchen <strong>Business Impact</strong> oder welche Metric soll sie ermöglichen?</li>
            <li>Wer bestätigt <strong>Notwendigkeit, Priorität und Nachweis</strong> als Entscheidungskriterium?</li>
          </ol>
        </article>
        <div class="knowledge-concept-grid">
          <article
            v-for="example in decisionCriteriaKnowledge.examples"
            :key="example.title"
            class="knowledge-concept-card"
          >
            <MessageCircleQuestion :size="19" aria-hidden="true" />
            <div>
              <h3>{{ example.title }}</h3>
              <p><strong>Kundenaussage:</strong> {{ example.situation }}</p>
              <p><strong>Nachfragen:</strong> {{ example.inquiry }}</p>
              <p><strong>Noch offen:</strong> {{ example.boundary }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="engagement-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Qualifizierung & Feedback</p>
            <h2 id="engagement-title">Kriterien mitgestalten und Kundenbewertung erfragen</h2>
            <p class="section-note">
              Ein fehlender Kriterienkatalog ist nicht automatisch eine Chance. Und selbst wenn wir die Kriterien kennen,
              kennen wir damit noch nicht die tatsächliche Einschätzung des Kunden zu unserer Lösung.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article
            v-for="step in decisionCriteriaKnowledge.engagementGuidance"
            :key="step.title"
            class="knowledge-concept-card"
          >
            <MessageCircleQuestion :size="19" aria-hidden="true" />
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.meaning }}</p>
              <p><strong>Nachfragen:</strong> {{ step.question }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="triangle-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Wettbewerb & Differenzierung</p>
            <h2 id="triangle-title">Das Value Triangle richtig nutzen</h2>
            <p class="section-note">
              Entscheidend ist die Schnittmenge zwischen echtem Kundenbedarf, belegter eigener Fähigkeit und
              nachvollziehbaren Alternativen. Auch Status quo und Eigenbau zählen als Alternativen.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="zone in valueTriangleZones" :key="zone.code" class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div>
              <h3>{{ zone.code }}</h3>
              <p>{{ zone.meaning }}</p>
              <p><strong>So vorgehen:</strong> {{ zone.action }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="pitfalls-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Nicht hineininterpretieren</p>
            <h2 id="pitfalls-title">Typische Fehlinterpretationen</h2>
          </div>
        </div>
        <div class="knowledge-details-list">
          <details
            v-for="mistake in decisionCriteriaKnowledge.misinterpretations"
            :key="mistake.claim"
            class="knowledge-detail"
          >
            <summary>
              <CircleAlert :size="18" aria-hidden="true" />
              <span>{{ mistake.claim }}</span>
            </summary>
            <p>{{ mistake.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Fragen und Vorgehen">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Im Kundengespräch</p>
          <h2>Welche Fragen helfen mir?</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in decisionCriteriaKnowledge.discoveryQuestions" :key="question">{{ question }}</li>
          </ul>
        </article>
        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Praktisch vorgehen</p>
          <h2>Vom Kriterienkatalog zur belastbaren Auswahl</h2>
          <ol class="knowledge-action-list">
            <li v-for="action in decisionCriteriaKnowledge.practiceActions" :key="action">{{ action }}</li>
          </ol>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Quellen und fachliche Einordnung">
        <article class="knowledge-primary-card">
          <p class="knowledge-practical-takeaway">
            <strong>Für die Praxis:</strong> {{ decisionCriteriaKnowledge.practicalTakeaway }}
          </p>
        </article>
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <p>
              Die Fragen und Beispiele sind praxisorientierte deutsche Formulierungen, keine wörtlichen Zitate. Die
              beiden Kriterienmodelle sind bewusst nicht gleichgesetzt.
            </p>
            <div class="knowledge-author-grid">
              <div v-for="viewpoint in decisionCriteriaKnowledge.differences" :key="viewpoint.author">
                <strong>{{ viewpoint.author }}</strong>
                <p>{{ viewpoint.summary }}</p>
                <small>{{ viewpoint.source }}</small>
              </div>
            </div>
            <ul>
              <li v-for="source in decisionCriteriaKnowledge.sourceNotes" :key="source">{{ source }}</li>
            </ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
