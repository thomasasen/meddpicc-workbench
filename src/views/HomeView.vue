<script setup lang="ts">
import {
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleQuestionMark,
  ListChecks,
  ListTodo,
  TriangleAlert,
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, type Component } from 'vue'

import type { ProjectAreaKey, ProjectRisk } from '../domain/project'
import { useProjectStore } from '../stores/projectStore'
import {
  qualificationStatusLabels,
  type QualificationStatusKey,
} from '../domain/qualificationStatus'

type SnapshotItem = {
  label: string
  status: QualificationStatusKey
  confidence: number
}

const projectStore = useProjectStore()
const { project } = storeToRefs(projectStore)

const areaLabels: Record<ProjectAreaKey, string> = {
  metrics: 'Metrics',
  economicBuyer: 'Economic Buyer',
  decisionCriteria: 'Decision Criteria',
  decisionProcess: 'Decision Process',
  paperProcess: 'Paper Process',
  pain: 'Pain',
  champions: 'Champion',
  competition: 'Competition',
}

const forecastLabels: Record<string, string> = {
  pipeline: 'Pipeline',
  'best-case': 'Best Case',
  commit: 'Commit',
  closed: 'Closed',
}

const statusIcons: Record<QualificationStatusKey, Component> = {
  confirmed: CircleCheck,
  partial: CircleDot,
  assumption: CircleDashed,
  unknown: CircleQuestionMark,
  risk: TriangleAlert,
}

const snapshot = computed<SnapshotItem[]>(() =>
  (Object.entries(areaLabels) as Array<[ProjectAreaKey, string]>).map(([key, label]) => ({
    label,
    status: project.value.meddpicc[key].status,
    confidence: project.value.meddpicc[key].confidence,
  })),
)

const severityWeight: Record<ProjectRisk['severity'], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const openRisks = computed(() =>
  project.value.risks
    .filter((risk) => risk.status === 'open' || risk.status === 'mitigating')
    .sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity])
    .slice(0, 2),
)

const openActions = computed(() =>
  project.value.actions
    .filter((action) => action.status === 'open')
    .sort((a, b) => (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31'))
    .slice(0, 2),
)

const dateFormatter = new Intl.DateTimeFormat('de-DE')

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: project.value.project.currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string | null): string {
  if (!value) return 'Noch offen'
  return dateFormatter.format(new Date(`${value}T00:00:00`))
}

function riskClass(risk: ProjectRisk): string {
  return risk.severity === 'critical' || risk.severity === 'high'
    ? 'risk-item'
    : 'risk-item risk-item--warning'
}

function forecastLabel(value: string): string {
  return forecastLabels[value] ?? value
}
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="#main-content" aria-label="MEDDPICC Workbench Startseite">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Workbench</strong>
            <span>Local-first Deal-Qualifizierung</span>
          </span>
        </a>

        <div class="header-actions">
          <span class="release-badge">Pre-Alpha</span>
          <a
            class="icon-link"
            href="https://github.com/thomasasen/meddpicc-workbench"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>

    <main id="main-content">
      <section class="intro">
        <div class="container intro-grid">
          <div class="intro-copy">
            <p class="eyebrow">MEDDPICC für komplexe B2B-Opportunities</p>
            <h1>Qualifizierung, Evidenz und Deal Planning in einer Arbeitsumgebung.</h1>
            <p class="intro-text">
              Die Workbench strukturiert MEDDPICC-Informationen, macht Gaps sichtbar
              und übernimmt wiederholbare Berechnungs- und Planungsarbeit. Der
              Opportunity-Stand liegt in einer portablen <code>.meddpicc</code>-Datei.
            </p>

            <div class="release-panel" aria-label="Aktueller Funktionsstand">
              <div>
                <span class="release-panel-label">Aktueller Stand</span>
                <strong>Eine fiktive Demo-Projektdatei ist standardmäßig geladen.</strong>
              </div>
              <a class="button button-secondary" href="#arbeitsweise">
                Arbeitsweise ansehen
              </a>
            </div>

            <ul class="principle-list" aria-label="Technische Grundprinzipien">
              <li>Kein Backend erforderlich</li>
              <li>Keine AI zur Runtime</li>
              <li>Projektinhalte werden lokal im Browser verarbeitet</li>
            </ul>
          </div>

          <section class="opportunity-panel" aria-labelledby="opportunity-title">
            <div class="panel-header">
              <div>
                <p class="panel-kicker">Standard-Demo · vollständig fiktiv</p>
                <h2 id="opportunity-title">{{ project.project.accountName }}</h2>
                <p class="opportunity-name">{{ project.project.name }}</p>
              </div>
              <span class="deal-value">
                {{ formatCurrency(project.project.dealValue) }}
              </span>
            </div>

            <dl class="opportunity-meta">
              <div>
                <dt>Forecast</dt>
                <dd>{{ forecastLabel(project.project.forecastCategory) }}</dd>
              </div>
              <div>
                <dt>Target Close</dt>
                <dd>{{ formatDate(project.project.targetCloseDate) }}</dd>
              </div>
              <div>
                <dt>Target Go-Live</dt>
                <dd>{{ formatDate(project.project.targetGoLiveDate) }}</dd>
              </div>
            </dl>

            <div class="workbench-grid">
              <section class="workbench-block" aria-labelledby="gaps-title">
                <div class="block-heading">
                  <h3 id="gaps-title" class="heading-with-icon">
                    <TriangleAlert class="section-icon section-icon--risk" :size="18" :stroke-width="2" aria-hidden="true" />
                    <span>Kritische Gaps</span>
                  </h3>
                  <span class="count-badge">{{ openRisks.length }} sichtbar</span>
                </div>

                <div
                  v-for="risk in openRisks"
                  :key="risk.id"
                  :class="riskClass(risk)"
                >
                  <TriangleAlert
                    class="risk-item-icon"
                    :size="16"
                    :stroke-width="2"
                    aria-hidden="true"
                  />
                  <div>
                    <strong>{{ risk.title }}</strong>
                    <p>{{ risk.impact }}</p>
                  </div>
                </div>
              </section>

              <section class="workbench-block" aria-labelledby="actions-title">
                <div class="block-heading">
                  <h3 id="actions-title" class="heading-with-icon">
                    <ListTodo class="section-icon" :size="18" :stroke-width="2" aria-hidden="true" />
                    <span>Nächste Aktionen</span>
                  </h3>
                  <span class="count-badge">{{ openActions.length }} sichtbar</span>
                </div>

                <ol class="action-list">
                  <li v-for="action in openActions" :key="action.id">
                    <div>
                      <strong>{{ action.title }}</strong>
                      <span>{{ areaLabels[action.relatedArea] }}</span>
                    </div>
                    <span class="action-due">{{ formatDate(action.dueDate) }}</span>
                  </li>
                </ol>
              </section>
            </div>

            <section class="status-section" aria-labelledby="status-title">
              <div class="block-heading block-heading--status">
                <div>
                  <h3 id="status-title" class="heading-with-icon">
                    <ListChecks class="section-icon" :size="18" :stroke-width="2" aria-hidden="true" />
                    <span>MEDDPICC-Status</span>
                  </h3>
                  <p>Evidenzgrad, keine Gewinnwahrscheinlichkeit</p>
                </div>
                <span class="status-scale">0–10</span>
              </div>

              <div class="status-list" aria-label="MEDDPICC-Status der Standard-Demo">
                <div v-for="item in snapshot" :key="item.label" class="status-row">
                  <span class="status-label">{{ item.label }}</span>
                  <span class="status-summary">
                    <component
                      :is="statusIcons[item.status]"
                      class="status-icon"
                      :class="`status-icon--${item.status}`"
                      :size="16"
                      :stroke-width="2"
                      aria-hidden="true"
                    />
                    <span>{{ qualificationStatusLabels[item.status] }}</span>
                    <span
                      class="confidence"
                      :aria-label="`${item.confidence} von 10 Evidenzgrad`"
                    >
                      {{ item.confidence }}/10
                    </span>
                  </span>
                </div>
              </div>
            </section>
          </section>
        </div>
      </section>

      <section class="section section-muted" aria-labelledby="aufgaben-title">
        <div class="container compact-section-grid">
          <div class="section-heading">
            <p class="eyebrow">Deterministische Unterstützung</p>
            <h2 id="aufgaben-title">Welche Arbeit die Workbench übernehmen soll</h2>
            <p>
              Sie ersetzt keine Seller-Beurteilung. Sie reduziert administrative
              Fleißarbeit und hält Qualifizierungslogik nachvollziehbar.
            </p>
          </div>

          <div class="capability-list">
            <article>
              <span class="capability-label">Evidenz</span>
              <div>
                <h3>Wissen und Annahmen trennen</h3>
                <p>
                  Quelle, Datum und Evidenztyp bleiben mit einer Aussage verknüpft.
                  Unbekanntes muss nicht künstlich „grün“ gemacht werden.
                </p>
              </div>
            </article>

            <article>
              <span class="capability-label">Prozess</span>
              <div>
                <h3>Decision Process und Paper Process planbar machen</h3>
                <p>
                  Owner, Termine, Abhängigkeiten und Go-Live-Auswirkungen werden
                  strukturiert statt in parallelen Notizen gepflegt.
                </p>
              </div>
            </article>

            <article>
              <span class="capability-label">Value</span>
              <div>
                <h3>Metrics und Business Case reproduzierbar berechnen</h3>
                <p>
                  ROI, Payback und Cost of Delay entstehen aus dokumentierten Inputs
                  und lassen sich jederzeit nachvollziehbar neu berechnen.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="arbeitsweise" class="section" aria-labelledby="arbeitsweise-title">
        <div class="container compact-section-grid">
          <div class="section-heading">
            <p class="eyebrow">Ein Projekt, ein Datenmodell</p>
            <h2 id="arbeitsweise-title">Geplanter Project File Lifecycle</h2>
            <p>
              Die <code>.meddpicc</code>-Datei bleibt der kanonische Projektstand.
              Browser Storage dient höchstens als Recovery- oder Komfortebene.
            </p>
          </div>

          <ol class="workflow-list">
            <li>
              <span class="workflow-step">1</span>
              <div>
                <h3>Projektdatei öffnen</h3>
                <p>
                  Eine portable Datei enthält den strukturierten Stand der Opportunity
                  und kann beispielsweise beim CRM-Datensatz abgelegt werden.
                </p>
              </div>
            </li>
            <li>
              <span class="workflow-step">2</span>
              <div>
                <h3>Qualifizieren und planen</h3>
                <p>
                  MEDDPICC-Module, Evidenz, Risiken, Aktionen und Tools arbeiten
                  auf demselben Datenmodell.
                </p>
              </div>
            </li>
            <li>
              <span class="workflow-step">3</span>
              <div>
                <h3>Validiert speichern und wiederverwenden</h3>
                <p>
                  Der aktualisierte Stand wird nach Schema-Validierung wieder als
                  Projektdatei gespeichert; Reviews und Exporte nutzen dieselben Daten.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="privacy-band" aria-labelledby="privacy-title">
        <div class="container privacy-grid">
          <div>
            <p class="eyebrow eyebrow--light">Local-first</p>
            <h2 id="privacy-title">Projektverarbeitung ohne verpflichtendes Backend.</h2>
          </div>
          <p>
            Die Standard-Demo wird beim Build in die Anwendung eingebettet und lokal
            im Browser verarbeitet. Für echte Projektdateien wird kein verpflichtendes
            Backend benötigt; spätere externe Integrationen wären ausdrücklich optional.
          </p>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <strong>MEDDPICC Workbench</strong>
          <p>Open Source · MIT · Projektstatus: Pre-Alpha</p>
        </div>
        <a
          href="https://github.com/thomasasen/meddpicc-workbench"
          target="_blank"
          rel="noreferrer"
        >
          Repository auf GitHub
        </a>
      </div>
    </footer>
  </div>
</template>
