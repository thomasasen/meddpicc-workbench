<script setup lang="ts">
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Compass,
  ListChecks,
  MessageCircleQuestion,
  Route,
} from '@lucide/vue'

import { painImplicationKnowledge as pain } from '../content/meddpicc/painImplication'
</script>

<template>
  <!-- prettier-ignore -->
  <div class="site-shell knowledge-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="Zurück zur MEDDPICC Toolbox">
          <span class="brand-mark">M</span>
          <span class="brand-copy"><strong>MEDDPICC Toolbox</strong><span>Wissen · Pain / Implication</span></span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/#knowledge">
          <ArrowLeft :size="17" aria-hidden="true" />
          Zur Wissensübersicht
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="knowledge-main">
      <section class="container knowledge-hero" aria-labelledby="pain-title">
        <div>
          <div class="tool-intro-meta"><span class="tool-kind">Wissen</span><span>Pain / Implication</span></div>
          <p class="eyebrow">Discovery · Business Impact · Käuferverständnis</p>
          <h1 id="pain-title">{{ pain.title }}</h1>
          <p class="intro-text">{{ pain.lead }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/pain-implication">
            <ListChecks :size="18" aria-hidden="true" />
            Pain-Checklist öffnen
          </RouterLink>
        </div>
        <aside class="knowledge-benefit">
          <Compass :size="22" aria-hidden="true" />
          <div><strong>Dein Nutzen</strong><p>{{ pain.benefit }}</p></div>
        </aside>
      </section>

      <section class="container knowledge-layout">
        <article class="knowledge-primary-card">
          <p class="eyebrow">Kurz erklärt</p>
          <h2>Was ist Pain / Implication?</h2>
          <p class="knowledge-definition">{{ pain.shortDefinition }}</p>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Warum wichtig?</p>
          <h2>Das Problem allein reicht nicht</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="item in pain.whyImportant" :key="item">
              <CheckCircle2 :size="17" aria-hidden="true" /><span>{{ item }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="three-is">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Drei Vertiefungsschritte</p>
            <h2 id="three-is">Identify → Indicate → Implicate</h2>
            <p class="section-note">
              Es sind Prüfstufen für die Tiefe der Qualifizierung, keine starre Pflichtabfolge von Gesprächsterminen.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="stage in pain.stages" :key="stage.title" class="knowledge-concept-card">
            <CheckCircle2 :size="19" aria-hidden="true" />
            <div>
              <h3>{{ stage.title }}</h3>
              <p>{{ stage.meaning }}</p>
              <p><strong>Woran erkennbar:</strong> {{ stage.evidence }}</p>
              <p><strong>Mögliche Frage:</strong> {{ stage.question }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="other-perspective">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Ergänzende Blickwinkel</p>
            <h2 id="other-perspective">Pain-Typen, Outcome und echte Dringlichkeit</h2>
            <p class="section-note">
              Diese Fragen ergänzen die Vertiefungsstufen. Die Pain-Typen sind keine Synonyme für Identify, Indicate und Implicate.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="type in pain.otherPerspective" :key="type.title" class="knowledge-concept-card">
            <CircleAlert :size="19" aria-hidden="true" />
            <div><h3>{{ type.title }}</h3><p>{{ type.meaning }}</p></div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="distinctions">
        <div class="section-heading-row">
          <div><p class="eyebrow">Abgrenzungen</p><h2 id="distinctions">Was du nicht gleichsetzen solltest</h2></div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="item in pain.distinctions" :key="item.title" class="knowledge-concept-card">
            <CircleAlert :size="19" aria-hidden="true" />
            <div><h3>{{ item.title }}</h3><p>{{ item.explanation }}</p></div>
          </article>
        </div>
        <p class="section-note">
          <RouterLink class="inline-link" to="/knowledge/metrics">Metrics nachschlagen</RouterLink>
          ·
          <RouterLink class="inline-link" to="/knowledge/economic-buyer">Economic Buyer nachschlagen</RouterLink>
        </p>
      </section>

      <section class="container knowledge-section" aria-labelledby="evidence-levels">
        <div class="section-heading-row">
          <div><p class="eyebrow">Evidenz statt Optimismus</p><h2 id="evidence-levels">Was weißt du wirklich?</h2></div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="level in pain.evidenceLevels" :key="level.title" class="knowledge-concept-card">
            <BookOpen :size="19" aria-hidden="true" />
            <div>
              <h3>{{ level.title }}</h3>
              <p>{{ level.example }}</p>
              <p><strong>Grenze:</strong> {{ level.caution }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="scenario">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Vom Symptom zum nächsten Schritt</p>
            <h2 id="scenario">{{ pain.scenario.title }}</h2>
            <p class="section-note">Das gesamte Beispiel ist erfunden. Die genannten Zahlen sind ausschließlich Annahmen.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="step in pain.scenario.steps" :key="step.name" class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div><h3>{{ step.name }}</h3><p>{{ step.detail }}</p></div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="red-flags">
        <div class="section-heading-row">
          <div><p class="eyebrow">Warnsignale</p><h2 id="red-flags">Fünf gefährliche Kurzschlüsse</h2></div>
        </div>
        <div class="knowledge-details-list">
          <details v-for="flag in pain.redFlags" :key="flag.claim" class="knowledge-detail">
            <summary><CircleAlert :size="18" aria-hidden="true" /><span>{{ flag.claim }}</span></summary>
            <p>{{ flag.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Discovery und nächste Schritte">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Offen und positiv fragen</p>
          <h2>Natürliche Discovery-Fragen</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in pain.questions" :key="question">{{ question }}</li>
          </ul>
          <RouterLink class="inline-link" to="/knowledge/discovery-call">Discovery Call nachschlagen</RouterLink>
        </article>
        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Eine Lücke nach der anderen</p>
          <h2>Konkrete Validierungsschritte</h2>
          <ol class="knowledge-action-list">
            <li v-for="action in pain.actions" :key="action">{{ action }}</li>
          </ol>
          <RouterLink class="inline-link" to="/checklists/pain-implication">Zur Themen-Checklist</RouterLink>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Quellen und fachliche Einordnung">
        <article class="knowledge-primary-card">
          <p class="knowledge-practical-takeaway"><strong>Für die Praxis:</strong> {{ pain.practicalTakeaway }}</p>
        </article>
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <p>Die Praxisfragen, das Evidenzraster und die Fallzahlen sind eigenständige Übertragungen, keine Buchzitate.</p>
            <div class="knowledge-author-grid">
              <div v-for="perspective in pain.perspectives" :key="perspective.author">
                <strong>{{ perspective.author }}</strong>
                <p>{{ perspective.summary }}</p>
                <small>{{ perspective.source }}</small>
              </div>
            </div>
            <ul><li v-for="note in pain.sourceNotes" :key="note">{{ note }}</li></ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
