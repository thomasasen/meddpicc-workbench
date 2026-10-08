<script setup lang="ts">
import { ArrowLeft, BookOpen, CircleAlert, Compass, ListChecks, MessageCircleQuestion, Route } from '@lucide/vue'

import { discoveryCallKnowledge, spicedElements } from '../content/meddpicc/discoveryCall'
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
            <span>Wissen · Discovery Call</span>
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
            <span>Discovery · MEDDPICC + SPICED</span>
          </div>
          <p class="eyebrow">Gesprächsführung & Qualification</p>
          <h1 id="knowledge-title">{{ discoveryCallKnowledge.title }}</h1>
          <p class="intro-text">{{ discoveryCallKnowledge.lead }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/discovery-call">
            <ListChecks :size="18" aria-hidden="true" />
            Discovery-Checklist öffnen
          </RouterLink>
        </div>

        <aside class="knowledge-benefit">
          <Compass :size="22" aria-hidden="true" />
          <div>
            <strong>Leitprinzip</strong>
            <p>{{ discoveryCallKnowledge.principle }}</p>
          </div>
        </aside>
      </section>

      <section class="container knowledge-section" aria-labelledby="book-methods-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Gesprächsführung</p>
            <h2 id="book-methods-title">Praktische Fragetechniken für die Discovery</h2>
            <p class="section-note">
              Frageabsichten und Gesprächstechniken, keine Liste, die du von oben nach unten abfragen musst.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article class="knowledge-concept-card">
            <BookOpen :size="19" aria-hidden="true" />
            <div>
              <h3>Sieben zentrale Frageabsichten</h3>
              <p>Mit diesen sieben Absichten erkundest du Erfolge, Hürden und Folgen.</p>
              <ol>
                <li v-for="question in discoveryCallKnowledge.whyteBigQuestions" :key="question">
                  {{ question }}
                </li>
              </ol>
            </div>
          </article>
          <article class="knowledge-concept-card">
            <BookOpen :size="19" aria-hidden="true" />
            <div>
              <h3>Offen fragen mit T.H.E.D.</h3>
              <p>Eine sanfte, offene Gesprächsführung, ohne dem Kunden ein Problem einzureden.</p>
              <ul>
                <li v-for="item in discoveryCallKnowledge.lahouThed" :key="item.code">
                  <strong>{{ item.code }} · {{ item.name }}:</strong> {{ item.prompt }}
                </li>
              </ul>
            </div>
          </article>
          <article class="knowledge-concept-card">
            <MessageCircleQuestion :size="19" aria-hidden="true" />
            <div>
              <h3>Gezielt in die Tiefe fragen</h3>
              <p><strong>Erste Vertiefung:</strong> {{ discoveryCallKnowledge.twoSidedExample.first }}</p>
              <p><strong>Eine Ebene tiefer:</strong> {{ discoveryCallKnowledge.twoSidedExample.deepen }}</p>
              <p><strong>Achtung:</strong> {{ discoveryCallKnowledge.twoSidedExample.caution }}</p>
            </div>
          </article>
          <article class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div>
              <h3>Den Gesprächseinstieg mit ACE gestalten</h3>
              <p>Ein klarer, kurzer Einstieg in das Gespräch.</p>
              <ul>
                <li v-for="item in discoveryCallKnowledge.ace" :key="item.code">
                  <strong>{{ item.code }} · {{ item.name }}:</strong> {{ item.meaning }}
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="spiced-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">SPICED · Gesprächsstruktur</p>
            <h2 id="spiced-title">Fünf Perspektiven für die Discovery</h2>
            <p class="section-note">
              Kein Fragebogen zum Abarbeiten. Folge der Antwort des Kunden, fasse zusammen und prüfe Aussagen. Nicht
              alles muss im ersten Call vollständig geklärt werden.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="element in spicedElements" :key="element.id" class="knowledge-concept-card">
            <MessageCircleQuestion :size="19" aria-hidden="true" />
            <div>
              <h3>{{ element.code }} · {{ element.name }}</h3>
              <p>{{ element.meaning }}</p>
              <p><strong>Einsteigen:</strong> {{ element.openingQuestion }}</p>
              <p><strong>Vertiefen:</strong> {{ element.followUpQuestion }}</p>
              <p><strong>MEDDPICC-Bezug:</strong> {{ element.meddpiccBridge }}</p>
              <details class="knowledge-source-details">
                <summary>Was wäre noch keine Evidenz?</summary>
                <p>{{ element.evidenceGap }}</p>
              </details>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="flow-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Anwendung</p>
            <h2 id="flow-title">Ein natürlicher Gesprächsverlauf</h2>
            <p class="section-note">
              Die Reihenfolge dient nur zur Vorbereitung. In einem echten Gespräch darf ein neues Signal jederzeit zur
              Vertiefung eines früheren Themas führen.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="step in discoveryCallKnowledge.flow" :key="step.title" class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.detail }}</p>
              <p><strong>Beispielfrage:</strong> {{ step.question }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="red-flags-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Nicht hineininterpretieren</p>
            <h2 id="red-flags-title">Typische Warnsignale</h2>
          </div>
        </div>
        <article class="knowledge-primary-card">
          <ul class="knowledge-bullet-list">
            <li v-for="flag in discoveryCallKnowledge.redFlags" :key="flag">
              <CircleAlert :size="17" aria-hidden="true" />
              <span>{{ flag }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Quellen und fachliche Einordnung">
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <p>
              Die Fragen sind deutschsprachige Praxisformulierungen und keine wörtlichen Zitate oder verbindlichen
              Pflichtfragen. SPICED und ACE ergänzen die MEDDPICC-Qualifizierung.
            </p>
            <div class="knowledge-concept-grid">
              <div v-for="viewpoint in discoveryCallKnowledge.differences" :key="viewpoint.author">
                <h3>{{ viewpoint.author }}</h3>
                <p>{{ viewpoint.summary }}</p>
                <small>{{ viewpoint.source }}</small>
              </div>
            </div>
            <ul>
              <li v-for="source in discoveryCallKnowledge.sourceNotes" :key="source">{{ source }}</li>
              <li>
                <a
                  class="inline-link"
                  href="https://winningbydesign.com/spiced-framework/"
                  target="_blank"
                  rel="noopener noreferrer"
                  >SPICED-Originaldefinition aufrufen</a
                >
              </li>
            </ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
