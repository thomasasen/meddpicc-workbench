<script setup lang="ts">
import {
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleQuestionMark,
  FilePlus,
  FolderOpen,
  Pencil,
  Save,
  TriangleAlert,
} from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref, type Component } from 'vue'

import type { ProjectAction, ProjectAreaKey, ProjectMeta, ProjectRisk } from '../domain/project'
import { qualificationStatusLabels, type QualificationStatusKey } from '../domain/qualificationStatus'
import { loadProject, ProjectValidationError, type ProjectValidationIssue } from '../domain/projectSchema'
import { traceActionSources, traceRiskSources, type SourceTrace } from '../domain/sourceTraceability'
import { downloadTextFile } from '../services/browserFile'
import { useProjectStore } from '../stores/projectStore'

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
  dealValue: string | number
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

const projectStateLabel = computed(() => (dirty.value ? 'Ungespeicherte Änderungen' : 'Gespeicherter Stand'))

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

const severityLabels: Record<ProjectRisk['severity'], string> = {
  critical: 'Kritisch',
  high: 'Hoch',
  medium: 'Mittel',
  low: 'Niedrig',
}

const riskStatusLabels: Record<ProjectRisk['status'], string> = {
  open: 'Offen',
  mitigating: 'In Bearbeitung',
  closed: 'Geschlossen',
  accepted: 'Akzeptiert',
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

const openRiskCount = computed(
  () => project.value.risks.filter((risk) => risk.status === 'open' || risk.status === 'mitigating').length,
)

const openRisks = computed(() =>
  project.value.risks
    .filter((risk) => risk.status === 'open' || risk.status === 'mitigating')
    .sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity])
    .slice(0, 3),
)

const openActionCount = computed(() => project.value.actions.filter((action) => action.status === 'open').length)

const openActions = computed(() =>
  project.value.actions
    .filter((action) => action.status === 'open')
    .sort((a, b) => (a.dueDate ?? '9999-12-31').localeCompare(b.dueDate ?? '9999-12-31'))
    .slice(0, 3),
)

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function formatCurrency(value: number | null): string {
  if (value === null) return 'Unbekannt'

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: project.value.project.currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string | null): string {
  if (!value) return 'Unbekannt'
  return dateFormatter.format(new Date(value + 'T00:00:00'))
}

function riskClass(risk: ProjectRisk): string {
  return risk.severity === 'critical' || risk.severity === 'high'
    ? 'focus-risk-row'
    : 'focus-risk-row focus-risk-row--warning'
}

function riskTrace(risk: ProjectRisk): SourceTrace {
  return traceRiskSources(project.value, risk)
}

function actionTrace(action: ProjectAction): SourceTrace {
  return traceActionSources(project.value, action)
}

function sourceTraceLabel(trace: SourceTrace): string {
  if (trace.evidence.length === 0) return 'Quellenbasis: keine verknüpfte Evidenz'

  const evidenceLabel = String(trace.evidence.length) + ' ' + (trace.evidence.length === 1 ? 'Evidenz' : 'Evidenzen')
  if (trace.references.length === 0) return 'Quellenbasis: ' + evidenceLabel + ' · ohne Quellenreferenz'

  const titles = trace.references.slice(0, 2).map((reference) => reference.title)
  const remaining = trace.references.length - titles.length
  const sourceLabel = titles.join(', ') + (remaining > 0 ? ' +' + String(remaining) : '')
  const missingLabel =
    trace.evidenceWithoutReference > 0
      ? ' · ' + String(trace.evidenceWithoutReference) + ' ohne Quellenreferenz'
      : ''

  return 'Quellenbasis: ' + evidenceLabel + ' · ' + sourceLabel + missingLabel
}

function sourceTraceTarget(trace: SourceTrace): string {
  if (trace.references[0]) return '/references#reference-' + trace.references[0].id
  if (trace.evidence[0]) return '/evidence#evidence-' + trace.evidence[0].id
  return '/evidence'
}

function forecastLabel(value: string): string {
  return forecastLabels[value] ?? value
}

function relatedRiskTitle(action: ProjectAction): string | null {
  if (!action.relatedRiskId) return null
  return project.value.risks.find((risk) => risk.id === action.relatedRiskId)?.title ?? null
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
    const rawDealValue = String(projectMetaForm.value.dealValue).trim()
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
      ? file.name +
        ' wurde von Schema ' +
        result.migration?.fromVersion +
        ' auf ' +
        result.migration?.toVersion +
        ' migriert. Bitte speichern, um die Migration zu übernehmen.'
      : file.name + ' wurde vollständig validiert und geladen.'
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
    statusMessage.value = download.fileName + ' wurde als validierte Projektdatei heruntergeladen.'
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
        <RouterLink class="brand" to="/" aria-label="MEDDPICC Workbench Startseite">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Workbench</strong>
          </span>
        </RouterLink>

        <nav class="app-nav" aria-label="Hauptnavigation">
          <RouterLink class="app-nav-link" to="/">Deal-Fokus</RouterLink>
          <RouterLink class="app-nav-link" to="/evidence">Evidenzregister</RouterLink>
          <RouterLink class="app-nav-link" to="/references">Quellen</RouterLink>
          <RouterLink class="app-nav-link" to="/risks-actions">Risiken &amp; Aktionen</RouterLink>
        </nav>

        <a
          class="icon-link app-nav-secondary"
          href="https://github.com/thomasasen/meddpicc-workbench"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>

    <section class="project-toolbar" aria-label="Opportunity-Kontext">
      <div class="container project-toolbar-inner">
        <div class="opportunity-context">
          <div class="opportunity-context-topline">
            <span v-if="source === 'demo'" class="demo-label">Fiktive Demo</span>
            <span class="project-file-name">{{ projectFileLabel }}</span>
            <span class="project-save-state" :class="{ 'project-save-state--dirty': dirty }">
              {{ projectStateLabel }}
            </span>
          </div>

          <h1>{{ project.project.accountName }} · {{ project.project.name }}</h1>

          <dl class="opportunity-context-meta">
            <div>
              <dt>Deal Value</dt>
              <dd>{{ formatCurrency(project.project.dealValue) }}</dd>
            </div>
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
        </div>

        <div class="project-actions" aria-label="Projektaktionen">
          <button
            class="button button-with-icon"
            :class="dirty ? 'button-primary' : 'button-secondary'"
            type="button"
            @click="saveProject"
          >
            <Save :size="17" :stroke-width="2" aria-hidden="true" />
            <span>Projekt speichern</span>
          </button>
          <button class="button button-quiet button-with-icon" type="button" @click="triggerProjectOpen">
            <FolderOpen :size="17" :stroke-width="2" aria-hidden="true" />
            <span>Projekt öffnen</span>
          </button>
          <button class="button button-quiet button-with-icon" type="button" @click="openNewProjectForm">
            <FilePlus :size="17" :stroke-width="2" aria-hidden="true" />
            <span>Neues Projekt</span>
          </button>
          <button
            class="button button-quiet button-with-icon"
            type="button"
            aria-label="Opportunity bearbeiten"
            @click="openProjectMetaForm"
          >
            <Pencil :size="17" :stroke-width="2" aria-hidden="true" />
            <span>Bearbeiten</span>
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

      <section v-if="showNewProjectForm" class="container project-flow-panel" aria-labelledby="new-project-title">
        <form class="new-project-form" @submit.prevent="submitNewProject">
          <div class="project-flow-heading">
            <div>
              <h2 id="new-project-title">Neues Projekt erstellen</h2>
            </div>
            <p>Der neue Deal startet ohne erfundene Qualifizierung. Alle MEDDPICC-Bereiche stehen auf „Unbekannt“.</p>
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
      </section>

      <section
        v-if="showProjectMetaForm"
        class="container project-meta-editor"
        aria-labelledby="project-meta-title"
      >
        <form @submit.prevent="submitProjectMeta">
          <div class="project-meta-editor-heading">
            <div>
              <p class="panel-kicker">Opportunity-Kontext</p>
              <h2 id="project-meta-title">Opportunity-Daten bearbeiten</h2>
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
              <input v-model="projectMetaForm.dealValue" type="number" min="0" step="any" inputmode="decimal" />
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
              <li v-for="issue in projectMetaIssues" :key="issue.code + '-' + issue.path + '-' + issue.message">
                {{ issue.message }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div v-if="importIssues.length" class="container project-message project-message--error" role="alert">
        <TriangleAlert :size="19" :stroke-width="2" aria-hidden="true" />
        <div>
          <strong>Projektdatei wurde nicht geladen.</strong>
          <p>Das aktuell geöffnete Projekt bleibt unverändert.</p>
          <ul>
            <li v-for="issue in importIssues.slice(0, 8)" :key="issue.code + '-' + issue.path + '-' + issue.message">
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

    <main id="main-content" class="deal-workspace">
      <section class="container deal-focus-section" aria-labelledby="deal-focus-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Deal-Fokus</p>
            <h2 id="deal-focus-title">Aktuell wichtig</h2>
          </div>
          <RouterLink class="section-action-link" to="/risks-actions">Risiken &amp; Aktionen bearbeiten</RouterLink>
        </div>

        <div class="deal-focus-grid">
          <section class="focus-panel" aria-labelledby="risks-title">
            <div class="focus-panel-heading">
              <div>
                <h3 id="risks-title">Offene Risiken</h3>
                <p>{{ openRiskCount }} im Projekt · maximal 3 priorisiert sichtbar</p>
              </div>
            </div>

            <p v-if="openRisks.length === 0" class="focus-empty">Keine offenen Risiken erfasst.</p>

            <ul v-else class="focus-list">
              <li v-for="risk in openRisks" :key="risk.id" :class="riskClass(risk)">
                <div class="risk-marker" aria-hidden="true">
                  <TriangleAlert :size="17" :stroke-width="2" />
                </div>
                <div class="focus-risk-content">
                  <div class="focus-meta-line">
                    <span class="risk-severity" :class="'risk-severity--' + risk.severity">
                      {{ severityLabels[risk.severity] }}
                    </span>
                    <span>{{ riskStatusLabels[risk.status] }}</span>
                    <span>{{ areaLabels[risk.relatedArea] }}</span>
                  </div>
                  <strong>{{ risk.title }}</strong>
                  <p>{{ risk.impact }}</p>
                  <RouterLink class="source-trace-link" :to="sourceTraceTarget(riskTrace(risk))">
                    {{ sourceTraceLabel(riskTrace(risk)) }}
                  </RouterLink>
                </div>
              </li>
            </ul>
          </section>

          <section class="focus-panel" aria-labelledby="actions-title">
            <div class="focus-panel-heading">
              <div>
                <h3 id="actions-title">Nächste Aktionen</h3>
                <p>{{ openActionCount }} offen · nach Fälligkeit sortiert</p>
              </div>
            </div>

            <p v-if="openActions.length === 0" class="focus-empty">Keine offenen nächsten Aktionen vorhanden.</p>

            <ol v-else class="focus-list focus-action-list">
              <li v-for="action in openActions" :key="action.id" class="focus-action-row">
                <div class="focus-action-content">
                  <strong>{{ action.title }}</strong>
                  <div class="focus-meta-line">
                    <span>{{ areaLabels[action.relatedArea] }}</span>
                    <span>Owner: {{ action.owner ?? 'Unbekannt' }}</span>
                    <span>Fällig: {{ formatDate(action.dueDate) }}</span>
                  </div>
                  <p v-if="action.relatedGap"><strong>Gap:</strong> {{ action.relatedGap }}</p>
                  <p v-if="relatedRiskTitle(action)"><strong>Risiko:</strong> {{ relatedRiskTitle(action) }}</p>
                  <RouterLink class="source-trace-link" :to="sourceTraceTarget(actionTrace(action))">
                    {{ sourceTraceLabel(actionTrace(action)) }}
                  </RouterLink>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </section>

      <section class="container workspace-section" aria-labelledby="workspace-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Weiterarbeiten</p>
            <h2 id="workspace-title">Direkt in den nächsten Arbeitsschritt</h2>
          </div>
        </div>

        <div class="workspace-list">
          <RouterLink class="workspace-link" to="/evidence">
            <strong>Evidenz prüfen</strong>
            <span>Aussagen, Evidence-Qualität und konkrete MEDDPICC-Verknüpfungen bearbeiten</span>
          </RouterLink>
          <RouterLink class="workspace-link" to="/references">
            <strong>Quellen prüfen</strong>
            <span>Reference-Records und Herkunft vorhandener Evidence nachvollziehen</span>
          </RouterLink>
          <RouterLink class="workspace-link" to="/risks-actions">
            <strong>Risiken &amp; Aktionen bearbeiten</strong>
            <span>Deal-Risiken und Qualification Actions pflegen</span>
          </RouterLink>
          <button class="workspace-link workspace-link-button" type="button" @click="openProjectMetaForm">
            <strong>Projekt bearbeiten</strong>
            <span>Opportunity-Kontext und relevante Projektdaten anpassen</span>
          </button>
        </div>
      </section>

      <section class="container qualification-section" aria-labelledby="status-title">
        <div class="section-heading-row">
          <div>
            <p class="eyebrow">Qualification Snapshot</p>
            <h2 id="status-title">MEDDPICC-Kurzstatus</h2>
            <p class="section-note">Evidence-/Qualification Confidence, keine Win Probability.</p>
          </div>
        </div>

        <div class="qualification-list" aria-label="MEDDPICC-Status des aktuellen Projekts">
          <div v-for="item in snapshot" :key="item.label" class="status-row">
            <span class="status-label">{{ item.label }}</span>
            <span class="status-summary">
              <component
                :is="statusIcons[item.status]"
                class="status-icon"
                :class="'status-icon--' + item.status"
                :size="16"
                :stroke-width="2"
                aria-hidden="true"
              />
              <span>{{ qualificationStatusLabels[item.status] }}</span>
              <span class="confidence" :aria-label="String(item.confidence) + ' von 10 Evidence Confidence'">
                {{ item.confidence }}/10
              </span>
            </span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
