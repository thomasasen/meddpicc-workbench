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
  Users,
} from '@lucide/vue'

import { championKnowledge as champion } from '../content/meddpicc/champion'
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
            <span>Wissen · Champion</span>
          </span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/#knowledge">
          <ArrowLeft :size="17" aria-hidden="true" />
          Zur Wissensübersicht
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="knowledge-main">
      <section class="container knowledge-hero" aria-labelledby="champion-title">
        <div>
          <div class="tool-intro-meta">
            <span class="tool-kind">Wissen</span>
            <span>Champion</span>
          </div>
          <p class="eyebrow">Einfluss · Fürsprache · nachvollziehbares Handeln</p>
          <h1 id="champion-title">{{ champion.title }}</h1>
          <p class="intro-text">{{ champion.lead }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/champion">
            <ListChecks :size="18" aria-hidden="true" />
            Champion-Checklist öffnen
          </RouterLink>
        </div>
        <aside class="knowledge-benefit">
          <Compass :size="22" aria-hidden="true" />
          <div><strong>Dein Nutzen</strong><p>{{ champion.benefit }}</p></div>
        </aside>
      </section>

      <section class="container knowledge-layout" aria-label="Definition und Nutzen">
        <article class="knowledge-primary-card">
          <p class="eyebrow">Kurz erklärt</p>
          <h2>Was ist ein Champion?</h2>
          <p class="knowledge-definition">{{ champion.shortDefinition }}</p>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Warum wichtig?</p>
          <h2>Interne Wirkung statt gute Stimmung</h2>
          <ul class="knowledge-bullet-list">
            <li v-for="reason in champion.whyImportant" :key="reason">
              <CheckCircle2 :size="17" aria-hidden="true" />
              <span>{{ reason }}</span>
            </li>
          </ul>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="roles-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Rollen sauber unterscheiden</p>
            <h2 id="roles-title">Kontakt, Coach, Kandidat oder Champion?</h2>
            <p class="section-note">Nicht jede Person muss zum Champion werden. Ein Coach ist ein wertvoller Partner.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="role in champion.roles" :key="role.title" class="knowledge-concept-card">
            <Users :size="19" aria-hidden="true" />
            <div>
              <h3>{{ role.title }}</h3>
              <p>{{ role.meaning }}</p>
              <p><strong>Evidenz:</strong> {{ role.evidence }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="criteria-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Drei Kernkriterien</p>
            <h2 id="criteria-title">Einfluss, internes Verkaufen, eigenes Interesse</h2>
            <p class="section-note">Jedes Kriterium getrennt prüfen. Behauptungen sind noch keine beobachteten Ergebnisse.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="criterion in champion.whyteCriteria" :key="criterion.id" class="knowledge-concept-card">
            <CheckCircle2 :size="19" aria-hidden="true" />
            <div>
              <h3>{{ criterion.question }}</h3>
              <p>{{ criterion.meaning }}</p>
              <p><strong>Gute Hinweise:</strong> {{ criterion.signals.join(' ') }}</p>
              <details class="knowledge-detail">
                <summary>Fehlinterpretation und nächste Frage</summary>
                <p><strong>Nicht verwechseln:</strong> {{ criterion.commonMisinterpretation }}</p>
                <p><strong>Weiterdenken:</strong> {{ criterion.possibleQuestionsOrActions[0] }}</p>
              </details>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="perspective-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Ergänzende Prüfungen</p>
            <h2 id="perspective-title">Zugang, Glaubwürdigkeit und Personal Win</h2>
            <p class="section-note">Diese Perspektiven ergänzen die Kernkriterien. Sie sind keine weitere starre Pflichtliste.</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="item in champion.additionalPerspective" :key="item.title" class="knowledge-concept-card">
            <Users :size="19" aria-hidden="true" />
            <div><h3>{{ item.title }}</h3><p>{{ item.meaning }}</p></div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Champion entwickeln und testen">
        <article class="knowledge-primary-card">
          <BookOpen :size="21" aria-hidden="true" />
          <p class="eyebrow">Befähigen statt Folien weiterleiten</p>
          <h2>Wie entwickelst du interne Fürsprache?</h2>
          <ol class="knowledge-action-list">
            <li v-for="step in champion.enablement" :key="step">{{ step }}</li>
          </ol>
          <RouterLink class="inline-link" to="/knowledge/metrics">Metrics nachschlagen</RouterLink>
          · <RouterLink class="inline-link" to="/knowledge/pain-implication">Pain / Implication nachschlagen</RouterLink>
          · <RouterLink class="inline-link" to="/knowledge/decision-criteria">Decision Criteria nachschlagen</RouterLink>
        </article>
        <article class="knowledge-primary-card">
          <p class="eyebrow">Angemessene Champion-Tests</p>
          <h2>Ein gemeinsamer Schritt liefert mehr als ein Versprechen</h2>
          <div class="knowledge-details-list">
            <details v-for="test in champion.tests" :key="test.title" class="knowledge-detail">
              <summary><CheckCircle2 :size="17" aria-hidden="true" /><span>{{ test.title }}</span></summary>
              <p>{{ test.action }}</p>
              <p><strong>Grenze:</strong> {{ test.caution }}</p>
            </details>
          </div>
          <p class="section-note">Keine geheimen Unterlagen, Loyalitätsfallen oder Antworten außerhalb der Arbeitszeit verlangen.</p>
        </article>
      </section>

      <section class="container knowledge-section" aria-labelledby="stakeholder-title">
        <div class="section-heading-row">
          <div><p class="eyebrow">Buying Committee</p><h2 id="stakeholder-title">Economic Buyer, andere Champions und Prozessgrenzen</h2></div>
        </div>
        <div class="knowledge-layout">
          <article class="knowledge-primary-card">
            <ul class="knowledge-question-list">
              <li v-for="item in champion.buyerAndCommittee" :key="item">{{ item }}</li>
            </ul>
          </article>
          <article class="knowledge-primary-card">
            <p class="eyebrow">Benachbarte Themen</p>
            <h3>Die interne Unterstützung richtig einordnen</h3>
            <p><RouterLink class="inline-link" to="/knowledge/economic-buyer">Economic Buyer nachschlagen</RouterLink></p>
            <p><RouterLink class="inline-link" to="/knowledge/decision-process">Decision Process nachschlagen</RouterLink></p>
            <p><RouterLink class="inline-link" to="/knowledge/paper-process">Paper Process nachschlagen</RouterLink></p>
          </article>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="flags-title">
        <div class="section-heading-row">
          <div><p class="eyebrow">Red Flags</p><h2 id="flags-title">Typische gefährliche Kurzschlüsse</h2></div>
        </div>
        <div class="knowledge-details-list">
          <details v-for="flag in champion.redFlags" :key="flag.claim" class="knowledge-detail">
            <summary><CircleAlert :size="18" aria-hidden="true" /><span>{{ flag.claim }}</span></summary>
            <p>{{ flag.explanation }}</p>
          </details>
        </div>
      </section>

      <section class="container knowledge-section" aria-labelledby="case-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Praxisbeispiel · CRM / SaaS</p>
            <h2 id="case-title">Vom hilfreichen Coach zur überprüften Fürsprache</h2>
            <p class="section-note">{{ champion.scenario.label }}</p>
          </div>
        </div>
        <div class="knowledge-concept-grid">
          <article v-for="step in champion.scenario.steps" :key="step.role" class="knowledge-concept-card">
            <Route :size="19" aria-hidden="true" />
            <div>
              <h3>{{ step.role }}</h3>
              <p>{{ step.detail }}</p>
              <p><strong>Nächste Aktion:</strong> {{ step.next }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="container knowledge-section knowledge-two-column" aria-label="Gesprächsfragen und nächste Schritte">
        <article class="knowledge-primary-card">
          <MessageCircleQuestion :size="21" aria-hidden="true" />
          <p class="eyebrow">Natürlich nachfragen</p>
          <h2>Fragen für dein nächstes Gespräch</h2>
          <ul class="knowledge-question-list">
            <li v-for="question in champion.questions" :key="question">{{ question }}</li>
          </ul>
        </article>
        <article class="knowledge-primary-card">
          <Route :size="21" aria-hidden="true" />
          <p class="eyebrow">Pragmatischer nächster Schritt</p>
          <h2>Eine Evidenzlücke gezielt klären</h2>
          <p>{{ champion.practicalTakeaway }}</p>
          <RouterLink class="button button-primary button-with-icon" to="/checklists/champion">
            <ListChecks :size="17" aria-hidden="true" />
            Zur Champion-Checklist
          </RouterLink>
        </article>
      </section>

      <section class="container knowledge-section" aria-label="Quellen und fachliche Einordnung">
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <div class="knowledge-source-card">
            <p>Die Gesprächsfragen, Tests und das gesamte Praxisbeispiel sind freie Praxisableitungen, keine wörtlichen Zitate. Die Kritikerprüfung ist simuliert.</p>
            <div class="knowledge-author-grid">
              <div v-for="perspective in champion.perspectives" :key="perspective.author">
                <strong>{{ perspective.author }}</strong>
                <p>{{ perspective.summary }}</p>
                <small>{{ perspective.source }}</small>
              </div>
            </div>
            <ul><li v-for="note in champion.sourceNotes" :key="note">{{ note }}</li></ul>
          </div>
        </details>
      </section>
    </main>
  </div>
</template>
