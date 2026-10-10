<script setup lang="ts">
import { ArrowLeft, BookOpen, CheckSquare2, CircleAlert, Lightbulb, MessageCircleQuestion } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import { championChecklist } from '../content/meddpicc/champion'
import { competitionChecklist } from '../content/meddpicc/competition'
import { decisionCriteriaChecklist } from '../content/meddpicc/decisionCriteria'
import { decisionProcessChecklist } from '../content/meddpicc/decisionProcess'
import { discoveryCallChecklist } from '../content/meddpicc/discoveryCall'
import { economicBuyerChecklists } from '../content/meddpicc/economicBuyer'
import { metricsChecklists } from '../content/meddpicc/metrics'
import { painImplicationChecklist } from '../content/meddpicc/painImplication'
import { paperProcessChecklist } from '../content/meddpicc/paperProcess'
import type { ChecklistId, KnowledgeTopicId } from '../content/meddpicc/types'

const props = defineProps<{
  checklistId: ChecklistId
}>()

const checklistLabels: Record<ChecklistId, string> = {
  'economic-buyer': 'Economic Buyer',
  'economic-buyer-meeting': 'Economic Buyer',
  metrics: 'Metrics',
  'discovery-call': 'Discovery Call',
  'decision-criteria': 'Decision Criteria',
  'decision-process': 'Decision Process',
  'paper-process': 'Paper Process',
  'pain-implication': 'Pain / Implication',
  champion: 'Champion',
  competition: 'Competition',
}

const knowledgeLabels: Record<KnowledgeTopicId, string> = {
  'economic-buyer': 'Economic Buyer',
  metrics: 'Metrics',
  'discovery-call': 'Discovery Call',
  'decision-criteria': 'Decision Criteria',
  'decision-process': 'Decision Process',
  'paper-process': 'Paper Process',
  'pain-implication': 'Pain / Implication',
  champion: 'Champion',
  competition: 'Competition',
}

const checklistContextLabel = computed(() => checklistLabels[props.checklistId])

function knowledgeLabel(topic: KnowledgeTopicId | undefined): string {
  return topic ? knowledgeLabels[topic] : ''
}

const checked = ref<Record<string, boolean>>({})
const filter = ref<'all' | 'open' | 'marked'>('all')

const checklist = computed(() => {
  if (props.checklistId === 'decision-criteria') return decisionCriteriaChecklist
  if (props.checklistId === 'decision-process') return decisionProcessChecklist
  if (props.checklistId === 'paper-process') return paperProcessChecklist
  if (props.checklistId === 'pain-implication') return painImplicationChecklist
  if (props.checklistId === 'champion') return championChecklist
  if (props.checklistId === 'competition') return competitionChecklist
  if (props.checklistId === 'discovery-call') return discoveryCallChecklist
  if (props.checklistId === 'metrics') return metricsChecklists.metrics
  return economicBuyerChecklists[props.checklistId]
})

watch(
  () => props.checklistId,
  () => {
    checked.value = {}
    filter.value = 'all'
  },
)

const markedCount = computed(() => checklist.value.items.filter((item) => checked.value[item.id]).length)
const visibleItems = computed(() => {
  if (filter.value === 'all') return checklist.value.items
  return checklist.value.items.filter((item) => Boolean(checked.value[item.id]) === (filter.value === 'marked'))
})

function checkboxId(itemId: string): string {
  return `checklist-${props.checklistId}-${itemId}`
}
</script>

<template>
  <div class="site-shell checklist-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="Zurück zur MEDDPICC Toolbox">
          <span class="brand-mark">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Toolbox</strong>
            <span>Checklists</span>
          </span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/#checklists">
          <ArrowLeft :size="17" aria-hidden="true" />
          Zur Checklist-Übersicht
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="checklist-main">
      <section class="container checklist-hero" aria-labelledby="checklist-title">
        <div>
          <div class="tool-intro-meta">
            <span class="tool-kind">Checklist</span>
            <span>{{ checklistContextLabel }}</span>
          </div>
          <p class="eyebrow">{{ checklist.eyebrow }}</p>
          <h1 id="checklist-title">{{ checklist.title }}</h1>
          <p class="intro-text">{{ checklist.lead }}</p>
        </div>

        <aside class="checklist-context">
          <div>
            <strong>Wann nutzen?</strong>
            <p>{{ checklist.whenToUse }}</p>
          </div>
          <div>
            <strong>Was bringt es?</strong>
            <p>{{ checklist.benefit }}</p>
          </div>
        </aside>
      </section>

      <section class="container checklist-list-section" aria-labelledby="checklist-items-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Kurz prüfen</p>
            <h2 id="checklist-items-title">Die entscheidenden Punkte</h2>
            <p class="section-note">
              Hake Punkte nur als persönliche Gedankenstütze ab. Wenn du unsicher bist, öffne die Erklärung direkt
              darunter.
            </p>
          </div>
        </div>

        <div class="checklist-toolbar">
          <p class="checklist-count" aria-live="polite">
            {{ markedCount }} von {{ checklist.items.length }} Punkten als Gedankenstütze markiert
          </p>
          <div class="checklist-filters" role="group" aria-label="Prüfpunkte filtern">
            <button type="button" :aria-pressed="filter === 'all'" @click="filter = 'all'">Alle</button>
            <button type="button" :aria-pressed="filter === 'open'" @click="filter = 'open'">Noch offen</button>
            <button type="button" :aria-pressed="filter === 'marked'" @click="filter = 'marked'">Markiert</button>
          </div>
        </div>
        <p v-if="visibleItems.length === 0" class="checklist-filter-empty" role="status">
          {{ filter === 'marked' ? 'Noch keine Punkte markiert.' : 'In dieser Ansicht sind keine Punkte mehr offen.' }}
          <button type="button" class="button button-secondary" @click="filter = 'all'">Alle anzeigen</button>
        </p>
        <div class="checklist-item-list">
          <article v-for="item in visibleItems" :key="item.id" class="checklist-item">
            <label class="checklist-question" :for="checkboxId(item.id)">
              <input :id="checkboxId(item.id)" v-model="checked[item.id]" type="checkbox" />
              <span>{{ item.question }}</span>
            </label>

            <details class="checklist-item-details">
              <summary>
                <Lightbulb :size="17" aria-hidden="true" />
                Erklärung und mögliche Fragen
              </summary>

              <div class="checklist-detail-grid">
                <section>
                  <h3>Worum geht es?</h3>
                  <p>{{ item.meaning }}</p>
                </section>

                <section>
                  <h3>Warum ist das relevant?</h3>
                  <p>{{ item.whyItMatters }}</p>
                </section>

                <section>
                  <h3>Woran erkenne ich es?</h3>
                  <ul>
                    <li v-for="signal in item.signals" :key="signal">{{ signal }}</li>
                  </ul>
                </section>

                <section class="checklist-warning">
                  <h3>
                    <CircleAlert :size="16" aria-hidden="true" />
                    Typische Fehlinterpretation
                  </h3>
                  <p>{{ item.commonMisinterpretation }}</p>
                </section>

                <section class="checklist-actions">
                  <h3>
                    <MessageCircleQuestion :size="16" aria-hidden="true" />
                    Mögliche Frage oder Handlung
                  </h3>
                  <ul>
                    <li v-for="action in item.possibleQuestionsOrActions" :key="action">{{ action }}</li>
                  </ul>
                </section>

                <section v-if="item.learnMore">
                  <h3>Mehr erfahren</h3>
                  <p>{{ item.learnMore }}</p>
                </section>
              </div>

              <div class="checklist-item-footer">
                <RouterLink
                  v-if="item.relatedKnowledge"
                  class="inline-link"
                  :to="'/knowledge/' + item.relatedKnowledge"
                >
                  <BookOpen :size="15" aria-hidden="true" />
                  {{ knowledgeLabel(item.relatedKnowledge) }}
                  nachschlagen
                </RouterLink>
              </div>
            </details>
          </article>
        </div>

        <div class="checklist-guidance">
          <CheckSquare2 :size="20" aria-hidden="true" />
          <p>
            <strong>Offene Punkte sind Gesprächshinweise.</strong>
            Die Checklist soll dir zeigen, was du noch verstehen oder validieren möchtest – nicht einen Deal bewerten.
          </p>
        </div>
      </section>

      <section class="container checklist-sources">
        <details class="knowledge-source-details">
          <summary>Quellen und fachliche Einordnung anzeigen</summary>
          <ul>
            <li v-for="source in checklist.sourceNotes" :key="source">{{ source }}</li>
            <li v-for="item in checklist.items" :key="item.id">
              <strong>{{ item.question }}</strong>
              <span v-if="item.sourceNote"> – {{ item.sourceNote }}</span>
            </li>
          </ul>
        </details>
      </section>
    </main>
  </div>
</template>
