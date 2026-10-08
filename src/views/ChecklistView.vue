<script setup lang="ts">
import { ArrowLeft, BookOpen, CheckSquare2, CircleAlert, Lightbulb, MessageCircleQuestion } from '@lucide/vue'
import { computed, ref, watch } from 'vue'

import { decisionCriteriaChecklist } from '../content/meddpicc/decisionCriteria'
import { discoveryCallChecklist } from '../content/meddpicc/discoveryCall'
import { economicBuyerChecklists } from '../content/meddpicc/economicBuyer'
import { metricsChecklists } from '../content/meddpicc/metrics'
import type { ChecklistId } from '../content/meddpicc/types'

const props = defineProps<{
  checklistId: ChecklistId
}>()

const checked = ref<Record<string, boolean>>({})

const checklist = computed(() => {
  if (props.checklistId === 'decision-criteria') return decisionCriteriaChecklist
  if (props.checklistId === 'discovery-call') return discoveryCallChecklist
  if (props.checklistId === 'metrics') return metricsChecklists.metrics
  return economicBuyerChecklists[props.checklistId]
})

watch(
  () => props.checklistId,
  () => {
    checked.value = {}
  },
)

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
            <span>{{
              props.checklistId === 'decision-criteria'
                ? 'Decision Criteria'
                : props.checklistId === 'metrics'
                ? 'Metrics'
                : props.checklistId === 'discovery-call'
                  ? 'Discovery Call'
                  : 'Economic Buyer'
            }}</span>
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

        <div class="checklist-item-list">
          <article v-for="item in checklist.items" :key="item.id" class="checklist-item">
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
                  {{
                    item.relatedKnowledge === 'decision-criteria'
                      ? 'Decision Criteria'
                      : item.relatedKnowledge === 'metrics'
                      ? 'Metrics'
                      : item.relatedKnowledge === 'discovery-call'
                        ? 'Discovery Call'
                        : 'Economic Buyer'
                  }}
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
