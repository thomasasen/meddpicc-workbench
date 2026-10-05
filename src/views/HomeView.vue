<script setup lang="ts">
import {
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleQuestionMark,
  FilePlus,
  FolderOpen,
  ListChecks,
  ListTodo,
  Pencil,
  Save,
  TriangleAlert,
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, type Component } from 'vue'

import type { ProjectAction, ProjectAreaKey, ProjectMeta, ProjectRisk } from '../domain/project'
import { loadProject, ProjectValidationError, type ProjectValidationIssue } from '../domain/projectSchema'
import { downloadTextFile } from '../services/browserFile'
import { useProjectStore } from '../stores/projectStore'
import { qualificationStatusLabels, type QualificationStatusKey } from '../domain/qualificationStatus'
import { traceActionSources, traceRiskSources, type SourceTrace } from '../domain/sourceTraceability'

type SnapshotItem = {
  label: string
  status: QualificationStatusKey
  confidence: number
}

const projectStore = useProjectStore()
const { project, source, fileName, dirty } = storeToRefs(projectStore)

const fileInput = ref<HTMLInputElement | null>(null)
const accountNameInput = ref<HTMLInputElement | null>(null)
const showNewProjectForm = ref(false)
const importIssues = ref<ProjectValidationIssue[]>([])
const statusMessage = ref('')
const newProjectForm = ref({
  accountName: '',
  name: '',
  owner: '',
  currency: 'EUR',
})

type ProjectMetaForm = {
  name: string
  accountName: string
  opportunityId: string
  owner: string
  currency: string
  dealValue: string
  targetCloseDate: string
  targetGoLiveDate: string
  forecastCategory: ProjectMeta['forecastCategory']
  notes: string
}

const showProjectMetaForm = ref(false)
const projectMetaIssues = ref<ProjectValidationIssue[]>([])
const projectMetaForm = ref<ProjectMetaForm>({
  name: '',
  accountName: '',
  opportunityId: '',
  owner: '',
  currency: 'EUR',
  dealValue: '',
  targetCloseDate: '',
  targetGoLiveDate: '',
  forecastCategory: 'unknown',
  notes: '',
})

const projectStateLabel = computed(() => {
  if (dirty.value) return 'Ungespeicherte Änderungen'
  if (source.value === 'demo') return 'Demo · unverändert'
  return 'Gespeicherter Stand'
})

const projectFileLabel = computed(() => {
  if (fileName.value) return fileName.value
  return source.value === 'demo' ? 'Eingebettete Demo' : 'Noch nicht gespeichert'
})

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
  unknown: 'Unbekannt',
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

function formatCurrency(value: number | null): string {
  if (value === null) return 'Noch offen'

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
  return risk.severity === 'critical' || risk.severity === 'high' ? 'risk-item' : 'risk-item risk-item--warning'
}

function riskTrace(risk: ProjectRisk): SourceTrace {
  return traceRiskSources(project.value, risk)
}

function actionTrace(action: ProjectAction): SourceTrace {
  return traceActionSources(project.value, action)
}

function sourceTraceLabel(trace: SourceTrace): string {
  if (trace.evidence.length === 0) return 'Quellenbasis: keine verknüpfte Evidenz'

  const evidenceLabel = `${trace.evidence.length} ${trace.evidence.length === 1 ? 'Evidenz' : 'Evidenzen'}`
  if (trace.references.length === 0) return `Quellenbasis: ${evidenceLabel} · ohne Quellenreferenz`

  const titles = trace.references.slice(0, 2).map((reference) => reference.title)
  const remaining = trace.references.length - titles.length
  const sourceLabel = titles.join(', ') + (remaining > 0 ? ` +${remaining}` : '')
  const missingLabel =
    trace.evidenceWithoutReference > 0 ? ` · ${trace.evidenceWithoutReference} ohne Quellenreferenz` : ''

  return `Quellenbasis: ${evidenceLabel} · ${sourceLabel}${missingLabel}`
}

function sourceTraceTarget(trace: SourceTrace): string {
  if (trace.references[0]) return `/references#reference-${trace.references[0].id}`
  if (trace.evidence[0]) return `/evidence#evidence-${trace.evidence[0].id}`
  return '/evidence'
}

function forecastLabel(value: string): string {
  return forecastLabels[value] ?? value
}

function fillProjectMetaForm() {
  const meta = project.value.project
  projectMetaForm.value = {
    name: meta.name,
    accountName: meta.accountName,
    opportunityId: meta.opportunityId ?? '',
    owner: meta.owner ?? '',
    currency: meta.currency,
    dealValue: meta.dealValue === null ? '' : String(meta.dealValue),
    targetCloseDate: meta.targetCloseDate ?? '',
    targetGoLiveDate: meta.targetGoLiveDate ?? '',
    forecastCategory: meta.forecastCategory,
    notes: meta.notes,
  }
}

function openProjectMetaForm() {
  fillProjectMetaForm()
  projectMetaIssues.value = []
  statusMessage.value = ''
  showProjectMetaForm.value = true
}

function cancelProjectMetaEdit() {
  fillProjectMetaForm()
  projectMetaIssues.value = []
  showProjectMetaForm.value = false
}

function submitProjectMeta() {
  projectMetaIssues.value = []
  statusMessage.value = ''

  try {
    const rawDealValue = projectMetaForm.value.dealValue.trim()
    projectStore.updateProjectMeta({
      name: projectMetaForm.value.name.trim(),
      accountName: projectMetaForm.value.accountName.trim(),
      opportunityId: projectMetaForm.value.opportunityId.trim() || null,
      owner: projectMetaForm.value.owner.trim() || null,
      currency: projectMetaForm.value.currency.trim().toUpperCase(),
      dealValue: rawDealValue === '' ? null : Number(rawDealValue),
      targetCloseDate: projectMetaForm.value.targetCloseDate || null,
      targetGoLiveDate: projectMetaForm.value.targetGoLiveDate || null,
      forecastCategory: projectMetaForm.value.forecastCategory,
      notes: projectMetaForm.value.notes,
    })

    showProjectMetaForm.value = false
    statusMessage.value = 'Projektmetadaten wurden validiert aktualisiert. Der Stand ist noch nicht gespeichert.'
  } catch (error) {
    if (error instanceof ProjectValidationError) {
      projectMetaIssues.value = error.issues
      return
    }

    projectMetaIssues.value = [
      {
        source: 'domain',
        code: 'project_meta_update_failed',
        path: '/project',
        message: 'Die Projektmetadaten konnten nicht aktualisiert werden.',
      },
    ]
  }
}

function confirmDiscardUnsavedChanges(): boolean {
  if (!dirty.value) return true

  return window.confirm('Es gibt ungespeicherte Änderungen. Wenn du fortfährst, gehen diese Änderungen verloren.')
}

async function openNewProjectForm() {
  showProjectMetaForm.value = false
  projectMetaIssues.value = []
  importIssues.value = []
  statusMessage.value = ''
  showNewProjectForm.value = true
  await nextTick()
  accountNameInput.value?.focus()
}

function closeNewProjectForm() {
  showNewProjectForm.value = false
}

function submitNewProject() {
  if (!confirmDiscardUnsavedChanges()) return

  projectStore.createProject({
    accountName: newProjectForm.value.accountName,
    name: newProjectForm.value.name,
    owner: newProjectForm.value.owner,
    currency: newProjectForm.value.currency,
  })

  showNewProjectForm.value = false
  importIssues.value = []
  statusMessage.value = 'Neues Projekt erstellt. Der Stand ist noch nicht gespeichert.'
  newProjectForm.value = {
    accountName: '',
    name: '',
    owner: '',
    currency: 'EUR',
  }
}

function triggerProjectOpen() {
  importIssues.value = []
  statusMessage.value = ''
  fileInput.value?.click()
}

async function handleProjectFileChange(event: Event) {
  const input = event.currentTarget as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''

  if (!file) return

  if (!file.name.toLowerCase().endsWith('.meddpicc')) {
    importIssues.value = [
      {
        source: 'file',
        code: 'invalid_file_extension',
        path: '/',
        message: 'Bitte eine Projektdatei mit der Endung .meddpicc auswählen.',
      },
    ]
    return
  }

  try {
    const raw = await file.text()
    const result = loadProject(raw)

    if (!result.success) {
      importIssues.value = result.issues
      return
    }

    if (!confirmDiscardUnsavedChanges()) return

    const migrated = result.migration !== null
    projectStore.replaceProject(result.project, 'file', file.name, migrated)
    showProjectMetaForm.value = false
    projectMetaIssues.value = []
    importIssues.value = []
    statusMessage.value = migrated
      ? `${file.name} wurde von Schema ${result.migration?.fromVersion} auf ${result.migration?.toVersion} migriert. Bitte speichern, um die Migration zu übernehmen.`
      : `${file.name} wurde vollständig validiert und geladen.`
  } catch {
    importIssues.value = [
      {
        source: 'file',
        code: 'file_read_failed',
        path: '/',
        message: 'Die ausgewählte Projektdatei konnte nicht gelesen werden.',
      },
    ]
  }
}

function saveProject() {
  importIssues.value = []
  statusMessage.value = ''

  try {
    const download = projectStore.prepareDownload()
    downloadTextFile(download.content, download.fileName)
    projectStore.confirmDownloaded(download)
    statusMessage.value = `${download.fileName} wurde als validierte Projektdatei heruntergeladen.`
  } catch (error) {
    if (error instanceof ProjectValidationError) {
      importIssues.value = error.issues
      return
    }

    importIssues.value = [
      {
        source: 'file',
        code: 'download_failed',
        path: '/',
        message: 'Das Projekt konnte nicht als Datei gespeichert werden.',
      },
    ]
  }
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
          <RouterLink class="icon-link" to="/evidence">Evidenzregister</RouterLink>
          <RouterLink class="icon-link" to="/references">Quellen</RouterLink>
          <RouterLink class="icon-link" to="/risks-actions">Risiken &amp; Aktionen</RouterLink>
          <a class="icon-link" href="https://github.com/thomasasen/meddpicc-workbench" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </header>

    <section class="project-toolbar" aria-label="Projektdatei">
      <div class="container project-toolbar-inner">
        <div class="project-context">
          <span class="project-context-label">Aktuelles Projekt</span>
          <strong>{{ project.project.accountName }} · {{ project.project.name }}</strong>
          <span class="project-file-name">{{ projectFileLabel }}</span>
          <span class="project-save-state" :class="{ 'project-save-state--dirty': dirty }">
            {{ projectStateLabel }}
          </span>
        </div>

        <div class="project-actions" aria-label="Projektaktionen">
          <button class="button button-secondary button-with-icon" type="button" @click="openNewProjectForm">
            <FilePlus :size="17" :stroke-width="2" aria-hidden="true" />
            <span>Neues Projekt</span>
          </button>
          <button class="button button-secondary button-with-icon" type="button" @click="triggerProjectOpen">
            <FolderOpen :size="17" :stroke-width="2" aria-hidden="true" />
            <span>Projekt öffnen</span>
          </button>
          <button class="button button-primary button-with-icon" type="button" @click="saveProject">
            <Save :size="17" :stroke-width="2" aria-hidden="true" />
            <span>Projekt speichern</span>
          </button>
          <input
            ref="fileInput"
            class="project-file-input"
            type="file"
            accept=".meddpicc"
            aria-label="MEDDPICC-Projektdatei auswählen"
            @change="handleProjectFileChange"
          />
        </div>
      </div>

      <div v-if="showNewProjectForm" class="container project-flow-panel">
        <form class="new-project-form" @submit.prevent="submitNewProject">
          <div class="project-flow-heading">
            <div>
              <p class="eyebrow">Project File Lifecycle</p>
              <h2>Neues Projekt erstellen</h2>
            </div>
            <p>Das Projekt startet bewusst leer. Alle MEDDPICC-Bereiche stehen auf „Unbekannt“.</p>
          </div>

          <div class="new-project-fields">
            <label>
              <span>Account</span>
              <input
                ref="accountNameInput"
                v-model.trim="newProjectForm.accountName"
                type="text"
                maxlength="300"
                autocomplete="organization"
                required
              />
            </label>
            <label>
              <span>Projektname</span>
              <input v-model.trim="newProjectForm.name" type="text" maxlength="300" required />
            </label>
            <label>
              <span>Owner <small>optional</small></span>
              <input v-model.trim="newProjectForm.owner" type="text" maxlength="200" autocomplete="name" />
            </label>
            <label>
              <span>Währung</span>
              <select v-model="newProjectForm.currency">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
            </label>
          </div>

          <div class="project-flow-actions">
            <button class="button button-primary" type="submit">Projekt erstellen</button>
            <button class="button button-secondary" type="button" @click="closeNewProjectForm">Abbrechen</button>
          </div>
        </form>
      </div>

      <div v-if="importIssues.length" class="container project-message project-message--error" role="alert">
        <TriangleAlert :size="19" :stroke-width="2" aria-hidden="true" />
        <div>
          <strong>Projektdatei wurde nicht geladen.</strong>
          <p>Das aktuell geöffnete Projekt bleibt unverändert.</p>
          <ul>
            <li v-for="issue in importIssues.slice(0, 8)" :key="`${issue.code}-${issue.path}-${issue.message}`">
              <code>{{ issue.path }}</code> {{ issue.message }}
            </li>
          </ul>
          <p v-if="importIssues.length > 8">
            Weitere {{ importIssues.length - 8 }} Validierungsfehler wurden ausgeblendet.
          </p>
        </div>
      </div>

      <div v-else-if="statusMessage" class="container project-message project-message--success" role="status">
        <CircleCheck :size="19" :stroke-width="2" aria-hidden="true" />
        <span>{{ statusMessage }}</span>
      </div>
    </section>

    <main id="main-content">
      <section class="intro">
        <div class="container intro-grid">
          <div class="intro-copy">
            <p class="eyebrow">MEDDPICC für komplexe B2B-Opportunities</p>
            <h1>Qualifizierung, Evidenz und Deal Planning in einer Arbeitsumgebung.</h1>
            <p class="intro-text">
              Die Workbench strukturiert MEDDPICC-Informationen, macht Gaps sichtbar und übernimmt wiederholbare
              Berechnungs- und Planungsarbeit. Der Opportunity-Stand liegt in einer portablen
              <code>.meddpicc</code>-Datei.
            </p>

            <div class="release-panel" aria-label="Aktueller Funktionsstand">
              <div>
                <span class="release-panel-label">Aktueller Stand</span>
                <strong v-if="source === 'demo'">Eine fiktive Demo-Projektdatei ist standardmäßig geladen.</strong>
                <strong v-else-if="dirty">Das aktuelle Projekt enthält ungespeicherte Änderungen.</strong>
                <strong v-else>Eine validierte Projektdatei ist geladen.</strong>
              </div>
              <a class="button button-secondary" href="#arbeitsweise"> Arbeitsweise ansehen </a>
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
                <p class="panel-kicker">
                  {{ source === 'demo' ? 'Standard-Demo · vollständig fiktiv' : projectStateLabel }}
                </p>
                <h2 id="opportunity-title">{{ project.project.accountName }}</h2>
                <p class="opportunity-name">{{ project.project.name }}</p>
              </div>
              <div class="opportunity-header-actions">
                <span class="deal-value">
                  {{ formatCurrency(project.project.dealValue) }}
                </span>
                <button
                  class="button button-secondary button-with-icon compact-button"
                  type="button"
                  @click="openProjectMetaForm"
                >
                  <Pencil :size="15" :stroke-width="2" aria-hidden="true" />
                  <span>Projekt bearbeiten</span>
                </button>
              </div>
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

            <section v-if="showProjectMetaForm" class="project-meta-editor" aria-labelledby="project-meta-title">
              <form @submit.prevent="submitProjectMeta">
                <div class="project-meta-editor-heading">
                  <div>
                    <p class="panel-kicker">Projektmetadaten</p>
                    <h3 id="project-meta-title">Opportunity-Daten bearbeiten</h3>
                  </div>
                  <p>Änderungen werden erst nach vollständiger Schema- und Domain-Validierung übernommen.</p>
                </div>

                <div class="project-meta-grid">
                  <label class="field">
                    <span>Account</span>
                    <input
                      v-model="projectMetaForm.accountName"
                      type="text"
                      maxlength="300"
                      autocomplete="organization"
                      required
                    />
                  </label>
                  <label class="field">
                    <span>Projektname</span>
                    <input v-model="projectMetaForm.name" type="text" maxlength="300" required />
                  </label>
                  <label class="field">
                    <span>Opportunity ID <small>optional</small></span>
                    <input v-model="projectMetaForm.opportunityId" type="text" maxlength="200" />
                  </label>
                  <label class="field">
                    <span>Owner <small>optional</small></span>
                    <input v-model="projectMetaForm.owner" type="text" maxlength="200" autocomplete="name" />
                  </label>
                  <label class="field">
                    <span>Währung</span>
                    <input
                      v-model="projectMetaForm.currency"
                      type="text"
                      minlength="3"
                      maxlength="3"
                      pattern="[A-Za-z]{3}"
                      autocomplete="off"
                      required
                    />
                  </label>
                  <label class="field">
                    <span>Deal Value <small>optional</small></span>
                    <input
                      v-model="projectMetaForm.dealValue"
                      type="number"
                      min="0"
                      step="any"
                      inputmode="decimal"
                    />
                  </label>
                  <label class="field">
                    <span>Target Close <small>optional</small></span>
                    <input v-model="projectMetaForm.targetCloseDate" type="date" />
                  </label>
                  <label class="field">
                    <span>Target Go-Live <small>optional</small></span>
                    <input v-model="projectMetaForm.targetGoLiveDate" type="date" />
                  </label>
                  <label class="field">
                    <span>Forecast Category</span>
                    <select v-model="projectMetaForm.forecastCategory">
                      <option value="unknown">Unbekannt</option>
                      <option value="pipeline">Pipeline</option>
                      <option value="best-case">Best Case</option>
                      <option value="commit">Commit</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>
                  <label class="field field--full">
                    <span>Notizen</span>
                    <textarea v-model="projectMetaForm.notes" maxlength="10000" rows="3" />
                  </label>
                </div>

                <div class="form-actions project-meta-actions">
                  <button class="button button-primary" type="submit">Änderungen speichern</button>
                  <button class="button button-secondary" type="button" @click="cancelProjectMetaEdit">Abbrechen</button>
                </div>
              </form>

              <div v-if="projectMetaIssues.length" class="project-message project-message--error" role="alert">
                <TriangleAlert :size="19" :stroke-width="2" aria-hidden="true" />
                <div>
                  <strong>Projektmetadaten wurden nicht geändert.</strong>
                  <ul>
                    <li v-for="issue in projectMetaIssues" :key="`${issue.code}-${issue.path}-${issue.message}`">
                      {{ issue.message }}
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <div class="workbench-grid">
              <section class="workbench-block" aria-labelledby="gaps-title">
                <div class="block-heading">
                  <h3 id="gaps-title" class="heading-with-icon">
                    <TriangleAlert
                      class="section-icon section-icon--risk"
                      :size="18"
                      :stroke-width="2"
                      aria-hidden="true"
                    />
                    <span>Kritische Gaps</span>
                  </h3>
                  <span class="count-badge">{{ openRisks.length }} sichtbar</span>
                </div>

                <div v-for="risk in openRisks" :key="risk.id" :class="riskClass(risk)">
                  <TriangleAlert class="risk-item-icon" :size="16" :stroke-width="2" aria-hidden="true" />
                  <div>
                    <strong>{{ risk.title }}</strong>
                    <p>{{ risk.impact }}</p>
                    <RouterLink class="source-trace-link" :to="sourceTraceTarget(riskTrace(risk))">
                      {{ sourceTraceLabel(riskTrace(risk)) }}
                    </RouterLink>
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
                      <RouterLink class="source-trace-link" :to="sourceTraceTarget(actionTrace(action))">
                        {{ sourceTraceLabel(actionTrace(action)) }}
                      </RouterLink>
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

              <div class="status-list" aria-label="MEDDPICC-Status des aktuellen Projekts">
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
                    <span class="confidence" :aria-label="`${item.confidence} von 10 Evidenzgrad`">
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
              Sie ersetzt keine Seller-Beurteilung. Sie reduziert administrative Fleißarbeit und hält
              Qualifizierungslogik nachvollziehbar.
            </p>
          </div>

          <div class="capability-list">
            <article>
              <span class="capability-label">Evidenz</span>
              <div>
                <h3>Wissen und Annahmen trennen</h3>
                <p>
                  Quelle, Datum und Evidenztyp bleiben mit einer Aussage verknüpft. Unbekanntes muss nicht künstlich
                  „grün“ gemacht werden.
                </p>
              </div>
            </article>

            <article>
              <span class="capability-label">Prozess</span>
              <div>
                <h3>Decision Process und Paper Process planbar machen</h3>
                <p>
                  Owner, Termine, Abhängigkeiten und Go-Live-Auswirkungen werden strukturiert statt in parallelen
                  Notizen gepflegt.
                </p>
              </div>
            </article>

            <article>
              <span class="capability-label">Value</span>
              <div>
                <h3>Metrics und Business Case reproduzierbar berechnen</h3>
                <p>
                  ROI, Payback und Cost of Delay entstehen aus dokumentierten Inputs und lassen sich jederzeit
                  nachvollziehbar neu berechnen.
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
              Die <code>.meddpicc</code>-Datei bleibt der kanonische Projektstand. Browser Storage dient höchstens als
              Recovery- oder Komfortebene.
            </p>
          </div>

          <ol class="workflow-list">
            <li>
              <span class="workflow-step">1</span>
              <div>
                <h3>Projektdatei öffnen</h3>
                <p>
                  Eine portable Datei enthält den strukturierten Stand der Opportunity und kann beispielsweise beim
                  CRM-Datensatz abgelegt werden.
                </p>
              </div>
            </li>
            <li>
              <span class="workflow-step">2</span>
              <div>
                <h3>Qualifizieren und planen</h3>
                <p>MEDDPICC-Module, Evidenz, Risiken, Aktionen und Tools arbeiten auf demselben Datenmodell.</p>
              </div>
            </li>
            <li>
              <span class="workflow-step">3</span>
              <div>
                <h3>Validiert speichern und wiederverwenden</h3>
                <p>
                  Der aktualisierte Stand wird nach Schema-Validierung wieder als Projektdatei gespeichert; Reviews und
                  Exporte nutzen dieselben Daten.
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
            Demo und echte Projektdateien werden lokal im Browser verarbeitet. Öffnen, Validieren und Speichern benötigt
            kein verpflichtendes Backend; Projektinhalte werden für diesen Lifecycle nicht an einen Server übertragen.
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
        <a href="https://github.com/thomasasen/meddpicc-workbench" target="_blank" rel="noreferrer">
          Repository auf GitHub
        </a>
      </div>
    </footer>
  </div>
</template>
