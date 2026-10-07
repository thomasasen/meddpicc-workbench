<script setup lang="ts">
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  MessageCircleQuestion,
  Route,
  UserRound,
} from '@lucide/vue'
import { computed } from 'vue'

import { economicBuyerConcepts, economicBuyerKnowledge } from '../content/meddpicc/economicBuyer'

const concepts = Object.values(economicBuyerConcepts)

const recognitionConcepts = computed(() =>
  economicBuyerKnowledge.recognitionConceptIds
    .map((id) => concepts.find((concept) => concept.id === id))
    .filter((concept) => concept !== undefined),
)
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
            <span>Wissen · Economic Buyer</span>
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
            <span>Economic Buyer</span>
          </div>
          <p class="eyebrow">{{ economicBuyerKnowledge.eyebrow }}</p>
          <h1 id="knowledge-title">{{ economicBuyerKnowledge.title }}</h1>
          <p class="intro-text">{{ economicBuyerKnowledge.lead }}</p>
        </div>

        <aside class="knowledge-benefit">
          <UserRound :size="22" aria-hidden="true" />
          <div>
            <strong>Dein Nutzen</strong>
            <p>{{ economicBuyerKnowledge.benefit }}</p>
          </div>
        </aside>
      </section>

      <section class="container knowledge-layout">
        <article class="knowledge-primary-card" aria-labelledby="short-definition-title">
          <p class="eyebrow">Kurz erklärt</p>
          <h2 id="short-definition-title">Was ist ein Economic Buyer?</h2>
          <p class="knowledge-definition">{{ economicBuyerKnowledge.shortDefinition }}</p>
        </article>

        <article class="knowledge-primary-card" aria-labelledby="why-important-title">
          <p class="eyebrow">Praxis</p>
          <h2 id="why-important-title">Warum ist das wichtig?</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="point in economicBuyerKnowledge.whyImportant" :key="point">
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
            <h2 id="recognition-title">Woran erkenne ich den Economic Buyer?</h2>
            <p class="section-note">
              Die Merkmale sind Denkhilfen – keine Formel. Entscheidend ist die tatsächliche Autorität im konkreten
              Buying Process.
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
          <details v-for="item in economicBuyerKnowledge.misinterpretations" :key="item.claim" class="knowledge-detail">
            <summary>
              <CircleAlert :size="18" aria-hidden="true" />
              <span>{{ item.claim }}</span>
            </summary>
            <p>{{ item.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Fragen und Zugang">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Im Gespräch</p>
          <h2>Welche Fragen helfen mir?</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in economicBuyerKnowledge.discoveryQuestions" :key="question">{{ question }}</li>
          </ul>
        </article>

        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Zugang</p>
          <h2>Wenn ich keinen direkten Zugang habe</h2>
          <ol class="knowledge-action-list">
            <li v-for="action in economicBuyerKnowledge.withoutDirectAccess" :key="action">{{ action }}</li>
          </ol>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="authors-title">
        <article class="knowledge-source-card">
          <BookOpen :size="21" aria-hidden="true" />
          <div>
            <p class="eyebrow">Fachlicher Hinweis</p>
            <h2 id="authors-title">Whyte und Lahoutifard setzen hier unterschiedliche Akzente</h2>
            <div class="knowledge-author-grid">
              <div>
                <strong>Andy Whyte</strong>
                <p>{{ economicBuyerKnowledge.authorPerspective.whyte }}</p>
              </div>
              <div>
                <strong>Darius Lahoutifard</strong>
                <p>{{ economicBuyerKnowledge.authorPerspective.lahoutifard }}</p>
              </div>
            </div>
            <p class="knowledge-practical-takeaway">
              <strong>Für die Praxis:</strong> {{ economicBuyerKnowledge.authorPerspective.practicalTakeaway }}
            </p>

            <details class="knowledge-source-details">
              <summary>Quellenabschnitte anzeigen</summary>
              <ul>
                <li v-for="source in economicBuyerKnowledge.sourceNotes" :key="source">{{ source }}</li>
              </ul>
            </details>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>
