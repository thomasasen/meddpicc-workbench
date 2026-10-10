<script setup lang="ts">
import { ArrowLeft, CheckCircle2, CircleAlert, Lightbulb, MessageCircleQuestion, Route, Calculator } from '@lucide/vue'
import { computed } from 'vue'

import { metricsConcepts, metricsKnowledge } from '../content/meddpicc/metrics'

const concepts = Object.values(metricsConcepts)
const recognitionConcepts = computed(() =>
  metricsKnowledge.recognitionConceptIds
    .map((id) => concepts.find((concept) => concept.id === id))
    .filter((concept) => concept !== undefined),
)
import KnowledgeSectionNav from '../components/KnowledgeSectionNav.vue'
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
            <span>Wissen · Metrics</span>
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
            <span>Metrics</span>
          </div>
          <p class="eyebrow">{{ metricsKnowledge.eyebrow }}</p>
          <h1 id="knowledge-title">{{ metricsKnowledge.title }}</h1>
          <p class="intro-text">{{ metricsKnowledge.lead }}</p>
        </div>

        <aside class="knowledge-benefit">
          <Calculator :size="22" aria-hidden="true" />
          <div>
            <strong>Dein Nutzen</strong>
            <p>{{ metricsKnowledge.benefit }}</p>
          </div>
        </aside>
      </section>

      <KnowledgeSectionNav />

      <section class="container knowledge-layout">
        <article class="knowledge-primary-card" aria-labelledby="short-definition-title">
          <p class="eyebrow">Kurz erklärt</p>
          <h2 id="short-definition-title">Was sind Metrics?</h2>
          <p class="knowledge-definition">{{ metricsKnowledge.shortDefinition }}</p>
        </article>

        <article class="knowledge-primary-card" aria-labelledby="why-important-title">
          <p class="eyebrow">Praxis</p>
          <h2 id="why-important-title">Warum ist das wichtig?</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="point in metricsKnowledge.whyImportant" :key="point">
              <CheckCircle2 :size="17" aria-hidden="true" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="recognition-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Einordnen</p>
            <h2 id="recognition-title">Woran erkenne ich eine belastbare Metric?</h2>
            <p class="section-note">
              Die Kriterien sind Denkhilfen und kein Score. Zahlen aus Referenzprojekten sind erst dann
              kundenspezifische Evidenz, wenn die Annahmen mit dem aktuellen Kunden überprüft wurden.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="concept in recognitionConcepts" :key="concept.id" class="knowledge-concept-card">
            <Lightbulb :size="19" aria-hidden="true" />
            <div>
              <p>{{ concept.meaning }}</p>
              <ul>
                <li v-for="signal in concept.signals" :key="signal">{{ signal }}</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="misinterpretations-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Nicht verwechseln</p>
            <h2 id="misinterpretations-title">Typische Fehlinterpretationen</h2>
          </div>
        </div>
        <div class="knowledge-details-list">
          <details v-for="item in metricsKnowledge.misinterpretations" :key="item.claim" class="knowledge-detail">
            <summary>
              <CircleAlert :size="18" aria-hidden="true" />
              <span>{{ item.claim }}</span>
            </summary>
            <p>{{ item.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Fragen und Vorgehen">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Im Gespräch</p>
          <h2>Welche Fragen helfen mir?</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in metricsKnowledge.discoveryQuestions" :key="question">{{ question }}</li>
          </ul>
        </article>

        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Vorgehen</p>
          <h2>Vom Pain zur Metric</h2>
          <ol class="knowledge-action-list">
            <li v-for="action in metricsKnowledge.practiceActions" :key="action">{{ action }}</li>
          </ol>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Praxis und Quellen">
        <article class="knowledge-primary-card">
          <p class="knowledge-practical-takeaway">
            <strong>Für die Praxis:</strong> {{ metricsKnowledge.authorPerspective.practicalTakeaway }}
          </p>
        </article>
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <div class="knowledge-author-grid">
              <div>
                <strong>Andy Whyte</strong>
                <p>{{ metricsKnowledge.authorPerspective.whyte }}</p>
              </div>
              <div>
                <strong>Darius Lahoutifard</strong>
                <p>{{ metricsKnowledge.authorPerspective.lahoutifard }}</p>
              </div>
            </div>
            <ul>
              <li v-for="source in metricsKnowledge.sourceNotes" :key="source">{{ source }}</li>
            </ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
