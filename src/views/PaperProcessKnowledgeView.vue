<script setup lang="ts">
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  Compass,
  FileCheck,
  ListChecks,
  MessageCircleQuestion,
  Route,
  Users,
} from '@lucide/vue'

import { paperProcessKnowledge } from '../content/meddpicc/paperProcess'
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
            <span>Wissen · Paper Process</span>
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
            <span>Paper Process</span>
          </div>
          <p class="eyebrow">Buying Process · Procurement · Signatur</p>
          <h1 id="knowledge-title">{{ paperProcessKnowledge.title }}</h1>
          <p class="intro-text">{{ paperProcessKnowledge.lead }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/paper-process">
            <ListChecks :size="18" aria-hidden="true" />
            Paper-Process-Checklist öffnen
          </RouterLink>
        </div>
        <aside class="knowledge-benefit">
          <Compass :size="22" aria-hidden="true" />
          <div>
            <strong>Dein Nutzen</strong>
            <p>{{ paperProcessKnowledge.benefit }}</p>
          </div>
        </aside>
      </section>

      <KnowledgeSectionNav />

      <section class="container knowledge-layout">
        <article class="knowledge-primary-card" aria-labelledby="definition-title">
          <p class="eyebrow">Kurz erklärt</p>
          <h2 id="definition-title">Was ist der Paper Process?</h2>
          <p class="knowledge-definition">{{ paperProcessKnowledge.shortDefinition }}</p>
        </article>
        <article class="knowledge-primary-card" aria-labelledby="importance-title">
          <p class="eyebrow">Warum wichtig?</p>
          <h2 id="importance-title">Auswahl ist kein Auftrag</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="point in paperProcessKnowledge.whyImportant" :key="point">
              <CheckCircle2 :size="17" aria-hidden="true" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="boundary-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Abgrenzung</p>
            <h2 id="boundary-title">Entscheidung, Approval und Paper Process</h2>
            <p class="section-note">
              Die Begriffe überschneiden sich in der Praxis. Behandle sie für die Qualifizierung trotzdem als
              unterscheidbare Fragen.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="item in paperProcessKnowledge.distinctions" :key="item.title" class="knowledge-concept-card">
            <FileCheck :size="19" aria-hidden="true" />
            <div>
              <h3>{{ item.title }}</h3>
              <p>
                <strong>{{ item.definition }}</strong>
              </p>
              <p>{{ item.example }}</p>
            </div>
          </article>
        </div>
        <p class="section-note">
          <RouterLink class="inline-link" to="/knowledge/decision-process">Decision Process nachschlagen</RouterLink>
        </p>
      </section>

      <section class="container knowledge-section" aria-labelledby="dimensions-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Drei Klärungsdimensionen</p>
            <h2 id="dimensions-title">Prozess, Personen und Timing</h2>
            <p class="section-note">Erst die Kombination liefert einen belastbaren Weg zur Unterschrift.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="part in paperProcessKnowledge.dimensions" :key="part.title" class="knowledge-concept-card">
            <Users :size="19" aria-hidden="true" />
            <div>
              <h3>{{ part.title }}</h3>
              <p>{{ part.meaning }}</p>
              <p><strong>Nachfrage:</strong> {{ part.question }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="examples-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Mögliche Stationen</p>
            <h2 id="examples-title">Was je nach Kunde dazugehören kann</h2>
            <p class="section-note">
              Das sind Beispiele, keine universellen Pflichtschritte und keine feste Reihenfolge. Bestätige beim Kunden,
              welche Prüfungen tatsächlich gelten.
            </p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article
            v-for="example in paperProcessKnowledge.examples"
            :key="example.title"
            class="knowledge-concept-card"
          >
            <FileCheck :size="19" aria-hidden="true" />
            <div>
              <h3>{{ example.title }}</h3>
              <p>{{ example.detail }}</p>
              <p><strong>Typische Ansprechpartner:</strong> {{ example.owner }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Planung und Praxisbeispiel">
        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Abhängigkeiten und Termine</p>
          <h2>Vom Go-Live rückwärts denken</h2>
          <ol class="knowledge-action-list">
            <li v-for="step in paperProcessKnowledge.planning" :key="step">{{ step }}</li>
          </ol>
          <RouterLink class="inline-link" to="/tools/reverse-timeline">Go-Live-Rückwärtsplanung öffnen</RouterLink>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Praxisbeispiel · CRM / SaaS</p>
          <h2>Gewonnen oder nur ausgewählt?</h2>
          <p>{{ paperProcessKnowledge.scenario.situation }}</p>
          <p><strong>Was ist belegt, was fehlt?</strong> {{ paperProcessKnowledge.scenario.evidence }}</p>
          <p><strong>Nächste Aktion:</strong> {{ paperProcessKnowledge.scenario.nextAction }}</p>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="red-flags-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Warnsignale</p>
            <h2 id="red-flags-title">Typische gefährliche Kurzschlüsse</h2>
          </div>
        </div>
        <div class="knowledge-details-list">
          <details v-for="flag in paperProcessKnowledge.redFlags" :key="flag.claim" class="knowledge-detail">
            <summary>
              <CircleAlert :size="18" aria-hidden="true" />
              <span>{{ flag.claim }}</span>
            </summary>
            <p>{{ flag.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Discovery und konkrete Aktionen">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Natürlich nachfragen</p>
          <h2>Discovery-Fragen, die weiterführen</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in paperProcessKnowledge.discoveryQuestions" :key="question">{{ question }}</li>
          </ul>
        </article>
        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Nächste Schritte</p>
          <h2>Den Ablauf kundenseitig bestätigen</h2>
          <ol class="knowledge-action-list">
            <li v-for="action in paperProcessKnowledge.practiceActions" :key="action">{{ action }}</li>
          </ol>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Quellen und fachliche Einordnung">
        <article class="knowledge-primary-card">
          <p class="knowledge-practical-takeaway">
            <strong>Für die Praxis:</strong> {{ paperProcessKnowledge.practicalTakeaway }}
          </p>
        </article>
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <p>Die SaaS-Beispiele und Fragen sind eigenständige Übertragungen, keine wörtlichen Buchzitate.</p>
            <div class="knowledge-author-grid">
              <div v-for="viewpoint in paperProcessKnowledge.perspectives" :key="viewpoint.author">
                <strong>{{ viewpoint.author }}</strong>
                <p>{{ viewpoint.summary }}</p>
                <small>{{ viewpoint.source }}</small>
              </div>
            </div>
            <ul>
              <li v-for="source in paperProcessKnowledge.sourceNotes" :key="source">{{ source }}</li>
            </ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
