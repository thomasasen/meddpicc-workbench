<script setup lang="ts">
import { ArrowLeft, CircleCheck, ListTodo, Pencil, Plus, Save, TriangleAlert } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { ProjectAction, ProjectAreaKey, ProjectRisk } from '../domain/project'
import { ProjectValidationError, type ProjectValidationIssue } from '../domain/projectSchema'
import { downloadTextFile } from '../services/browserFile'
import { useProjectStore } from '../stores/projectStore'

const projectStore = useProjectStore()
const { project, dirty, fileName } = storeToRefs(projectStore)

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
const areaEntries = Object.entries(areaLabels) as Array<[ProjectAreaKey, string]>
const riskSeverityLabels: Record<ProjectRisk['severity'], string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
  critical: 'Kritisch',
}
const riskStatusLabels: Record<ProjectRisk['status'], string> = {
  open: 'Offen',
  mitigating: 'In Bearbeitung',
  closed: 'Geschlossen',
  accepted: 'Akzeptiert',
}
const actionStatusLabels: Record<ProjectAction['status'], string> = {
  open: 'Offen',
  completed: 'Abgeschlossen',
  cancelled: 'Abgebrochen',
}

const riskForm = ref({
  title: '',
  severity: 'medium' as ProjectRisk['severity'],
  status: 'open' as ProjectRisk['status'],
  relatedArea: 'metrics' as ProjectAreaKey,
  relatedEntityIds: [] as string[],
  impact: '',
  mitigation: '',
  owner: '',
  dueDate: '',
})
const actionForm = ref({
  title: '',
  status: 'open' as ProjectAction['status'],
  owner: '',
  dueDate: '',
  relatedArea: 'metrics' as ProjectAreaKey,
  relatedRiskId: '',
  relatedGap: '',
  desiredEvidence: '',
  evidenceIds: [] as string[],
})
const editingRiskId = ref<string | null>(null)
const editingActionId = ref<string | null>(null)
const issues = ref<ProjectValidationIssue[]>([])
const statusMessage = ref('')

const stakeholderById = computed(() => new Map(project.value.stakeholders.map((item) => [item.id, item])))
const riskById = computed(() => new Map(project.value.risks.map((item) => [item.id, item])))

const riskEntityOptions = computed(() => {
  const p = project.value
  switch (riskForm.value.relatedArea) {
    case 'metrics':
      return p.meddpicc.metrics.metrics.map((item) => ({ id: item.id, label: item.name }))
    case 'economicBuyer':
      return p.meddpicc.economicBuyer.candidates.map((item) => ({
        id: item.stakeholderId,
        label: stakeholderById.value.get(item.stakeholderId)?.name ?? item.stakeholderId,
      }))
    case 'decisionCriteria':
      return p.meddpicc.decisionCriteria.criteria.map((item) => ({ id: item.id, label: item.name }))
    case 'decisionProcess':
      return p.meddpicc.decisionProcess.steps.map((item) => ({ id: item.id, label: item.title }))
    case 'paperProcess':
      return p.meddpicc.paperProcess.steps.map((item) => ({ id: item.id, label: item.title }))
    case 'pain':
      return p.meddpicc.pain.items.map((item) => ({ id: item.id, label: item.statement }))
    case 'champions':
      return p.meddpicc.champions.people.map((item) => ({
        id: item.stakeholderId,
        label: stakeholderById.value.get(item.stakeholderId)?.name ?? item.stakeholderId,
      }))
    case 'competition':
      return p.meddpicc.competition.knownAlternatives.map((item) => ({ id: item.id, label: item.name }))
  }
})

function resetRiskForm() {
  editingRiskId.value = null
  riskForm.value = {
    title: '',
    severity: 'medium',
    status: 'open',
    relatedArea: 'metrics',
    relatedEntityIds: [],
    impact: '',
    mitigation: '',
    owner: '',
    dueDate: '',
  }
}
function resetActionForm() {
  editingActionId.value = null
  actionForm.value = {
    title: '',
    status: 'open',
    owner: '',
    dueDate: '',
    relatedArea: 'metrics',
    relatedRiskId: '',
    relatedGap: '',
    desiredEvidence: '',
    evidenceIds: [],
  }
}
function clearMessages() {
  issues.value = []
  statusMessage.value = ''
}
function handleError(error: unknown, fallback: string) {
  if (error instanceof ProjectValidationError) {
    issues.value = error.issues
  } else {
    issues.value = [{ source: 'domain', code: 'workbench_change_failed', path: '/', message: fallback }]
  }
}
function toggleRiskEntity(id: string) {
  riskForm.value.relatedEntityIds = riskForm.value.relatedEntityIds.includes(id)
    ? riskForm.value.relatedEntityIds.filter((value) => value !== id)
    : [...riskForm.value.relatedEntityIds, id]
}
function toggleEvidence(id: string) {
  actionForm.value.evidenceIds = actionForm.value.evidenceIds.includes(id)
    ? actionForm.value.evidenceIds.filter((value) => value !== id)
    : [...actionForm.value.evidenceIds, id]
}
function changeRiskArea() {
  riskForm.value.relatedEntityIds = []
}
function submitRisk() {
  clearMessages()
  try {
    const draft = {
      ...riskForm.value,
      mitigation: riskForm.value.mitigation || null,
      owner: riskForm.value.owner || null,
      dueDate: riskForm.value.dueDate || null,
    }
    const risk = editingRiskId.value
      ? projectStore.updateRisk(editingRiskId.value, draft)
      : projectStore.addRisk(draft)
    statusMessage.value = `Risiko „${risk.title}“ wurde ${editingRiskId.value ? 'aktualisiert' : 'angelegt'}.`
    resetRiskForm()
  } catch (error) {
    handleError(error, 'Das Risiko konnte nicht gespeichert werden.')
  }
}
function editRisk(risk: ProjectRisk) {
  clearMessages()
  editingRiskId.value = risk.id
  riskForm.value = {
    title: risk.title,
    severity: risk.severity,
    status: risk.status,
    relatedArea: risk.relatedArea,
    relatedEntityIds: [...risk.relatedEntityIds],
    impact: risk.impact,
    mitigation: risk.mitigation ?? '',
    owner: risk.owner ?? '',
    dueDate: risk.dueDate ?? '',
  }
}
function changeRiskStatus(risk: ProjectRisk, event: Event) {
  clearMessages()
  try {
    projectStore.setRiskStatus(risk.id, (event.target as HTMLSelectElement).value as ProjectRisk['status'])
  } catch (error) {
    handleError(error, 'Der Risk-Status konnte nicht geändert werden.')
  }
}
function submitAction() {
  clearMessages()
  try {
    const draft = {
      ...actionForm.value,
      owner: actionForm.value.owner || null,
      dueDate: actionForm.value.dueDate || null,
      relatedRiskId: actionForm.value.relatedRiskId || null,
      relatedGap: actionForm.value.relatedGap || null,
    }
    const action = editingActionId.value
      ? projectStore.updateAction(editingActionId.value, draft)
      : projectStore.addAction(draft)
    statusMessage.value = `Aktion „${action.title}“ wurde ${editingActionId.value ? 'aktualisiert' : 'angelegt'}.`
    resetActionForm()
  } catch (error) {
    handleError(error, 'Die Aktion konnte nicht gespeichert werden.')
  }
}
function editAction(action: ProjectAction) {
  clearMessages()
  editingActionId.value = action.id
  actionForm.value = {
    title: action.title,
    status: action.status,
    owner: action.owner ?? '',
    dueDate: action.dueDate ?? '',
    relatedArea: action.relatedArea,
    relatedRiskId: action.relatedRiskId ?? '',
    relatedGap: action.relatedGap ?? '',
    desiredEvidence: action.desiredEvidence,
    evidenceIds: [...action.evidenceIds],
  }
}
function changeActionStatus(action: ProjectAction, event: Event) {
  clearMessages()
  try {
    projectStore.setActionStatus(action.id, (event.target as HTMLSelectElement).value as ProjectAction['status'])
  } catch (error) {
    handleError(error, 'Der Action-Status konnte nicht geändert werden.')
  }
}
function saveProject() {
  clearMessages()
  try {
    const download = projectStore.prepareDownload()
    downloadTextFile(download.content, download.fileName)
    projectStore.confirmDownloaded(download)
    statusMessage.value = `${download.fileName} wurde als validierte Projektdatei heruntergeladen.`
  } catch (error) {
    handleError(error, 'Das Projekt konnte nicht gespeichert werden.')
  }
}
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header class="site-header">
      <div class="container header-inner">
        <RouterLink class="brand" to="/" aria-label="Zur MEDDPICC Workbench">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="brand-copy"><strong>MEDDPICC Workbench</strong><span>Local-first Deal-Qualifizierung</span></span>
        </RouterLink>
        <div class="header-actions">
          <RouterLink class="icon-link heading-with-icon" to="/"><ArrowLeft :size="16" aria-hidden="true" /><span>Dashboard</span></RouterLink>
          <RouterLink class="icon-link" to="/evidence">Evidenzregister</RouterLink>
          <button class="button button-primary button-with-icon" type="button" @click="saveProject"><Save :size="16" aria-hidden="true" /><span>Projekt speichern</span></button>
        </div>
      </div>
    </header>

    <main id="main-content">
      <section class="evidence-hero">
        <div class="container evidence-hero-inner">
          <div>
            <p class="eyebrow">Roadmap 2 · Gemeinsame Arbeitsobjekte</p>
            <h1>Risiken &amp; Aktionen</h1>
            <p class="intro-text">Risiken beschreiben konkrete Deal-Gefahren. Aktionen schließen Qualification- oder Execution-Lücken und halten fest, welche Evidenz danach vorliegen soll.</p>
          </div>
          <div class="evidence-project-state">
            <span class="project-context-label">Aktuelles Projekt</span>
            <strong>{{ project.project.accountName }} · {{ project.project.name }}</strong>
            <span>{{ fileName ?? 'Noch keine Projektdatei' }}</span>
            <span class="project-save-state" :class="{ 'project-save-state--dirty': dirty }">{{ dirty ? 'Ungespeicherte Änderungen' : 'Gespeicherter Stand' }}</span>
          </div>
        </div>
      </section>

      <div v-if="issues.length" class="container project-message project-message--error workbench-message" role="alert">
        <TriangleAlert :size="18" aria-hidden="true" />
        <div><strong>Änderung konnte nicht gespeichert werden.</strong><ul><li v-for="issue in issues" :key="`${issue.code}-${issue.path}-${issue.message}`">{{ issue.message }}</li></ul></div>
      </div>
      <div v-else-if="statusMessage" class="container project-message project-message--success workbench-message" role="status">
        <CircleCheck :size="18" aria-hidden="true" /><strong>{{ statusMessage }}</strong>
      </div>

      <section class="section">
        <div class="container risk-action-grid">
          <section class="risk-action-column" aria-labelledby="risk-editor-title">
            <div class="risk-action-heading">
              <div><p class="eyebrow">Deal Risk</p><h2 id="risk-editor-title">Risiken</h2></div>
              <span class="count-badge">{{ project.risks.length }} Einträge</span>
            </div>
            <form class="work-object-form" @submit.prevent="submitRisk">
              <label class="field field--full"><span>Titel</span><input v-model="riskForm.title" required maxlength="500" /></label>
              <label class="field"><span>Severity</span><select v-model="riskForm.severity"><option v-for="(label, value) in riskSeverityLabels" :key="value" :value="value">{{ label }}</option></select></label>
              <label class="field"><span>Status</span><select v-model="riskForm.status"><option v-for="(label, value) in riskStatusLabels" :key="value" :value="value">{{ label }}</option></select></label>
              <label class="field"><span>MEDDPICC-Bereich</span><select v-model="riskForm.relatedArea" @change="changeRiskArea"><option v-for="[value, label] in areaEntries" :key="value" :value="value">{{ label }}</option></select></label>
              <label class="field"><span>Due Date <small>optional</small></span><input v-model="riskForm.dueDate" type="date" /></label>
              <label class="field field--full"><span>Impact</span><textarea v-model="riskForm.impact" rows="3" maxlength="5000" /></label>
              <label class="field field--full"><span>Mitigation <small>optional</small></span><textarea v-model="riskForm.mitigation" rows="2" maxlength="5000" /></label>
              <label class="field field--full"><span>Owner <small>optional</small></span><input v-model="riskForm.owner" maxlength="300" /></label>
              <fieldset v-if="riskEntityOptions.length" class="field field--full evidence-area-fieldset">
                <legend>Verknüpfte Entities / Process Steps <small>optional</small></legend>
                <div class="entity-option-list">
                  <label v-for="option in riskEntityOptions" :key="option.id" class="evidence-area-option">
                    <input type="checkbox" :checked="riskForm.relatedEntityIds.includes(option.id)" @change="toggleRiskEntity(option.id)" /><span>{{ option.label }}</span>
                  </label>
                </div>
              </fieldset>
              <div class="form-actions field--full">
                <button class="button button-primary button-with-icon" type="submit"><Plus v-if="!editingRiskId" :size="16" aria-hidden="true" /><Pencil v-else :size="16" aria-hidden="true" /><span>{{ editingRiskId ? 'Risiko speichern' : 'Risiko anlegen' }}</span></button>
                <button v-if="editingRiskId" class="button button-secondary" type="button" @click="resetRiskForm">Abbrechen</button>
              </div>
            </form>

            <div class="work-object-list">
              <article v-for="risk in project.risks" :key="risk.id" class="work-object-card">
                <div class="work-object-card-heading"><div><strong>{{ risk.title }}</strong><span>{{ areaLabels[risk.relatedArea] }} · {{ riskSeverityLabels[risk.severity] }}</span></div><button class="button button-secondary button-with-icon compact-button" type="button" @click="editRisk(risk)"><Pencil :size="14" aria-hidden="true" /><span>Bearbeiten</span></button></div>
                <p>{{ risk.impact || 'Impact noch nicht beschrieben.' }}</p>
                <label class="inline-status"><span>Status</span><select :value="risk.status" :aria-label="`Status für Risiko ${risk.title}`" @change="changeRiskStatus(risk, $event)"><option v-for="(label, value) in riskStatusLabels" :key="value" :value="value">{{ label }}</option></select></label>
              </article>
            </div>
          </section>

          <section class="risk-action-column" aria-labelledby="action-editor-title">
            <div class="risk-action-heading">
              <div><p class="eyebrow">Next Step</p><h2 id="action-editor-title">Nächste Aktionen</h2></div>
              <span class="count-badge">{{ project.actions.length }} Einträge</span>
            </div>
            <form class="work-object-form" @submit.prevent="submitAction">
              <label class="field field--full"><span>Titel</span><input v-model="actionForm.title" required maxlength="500" /></label>
              <label class="field"><span>Status</span><select v-model="actionForm.status"><option v-for="(label, value) in actionStatusLabels" :key="value" :value="value">{{ label }}</option></select></label>
              <label class="field"><span>MEDDPICC-Bereich</span><select v-model="actionForm.relatedArea"><option v-for="[value, label] in areaEntries" :key="value" :value="value">{{ label }}</option></select></label>
              <label class="field"><span>Owner <small>optional</small></span><input v-model="actionForm.owner" maxlength="300" /></label>
              <label class="field"><span>Due Date <small>optional</small></span><input v-model="actionForm.dueDate" type="date" /></label>
              <label class="field field--full"><span>Related Risk <small>optional</small></span><select v-model="actionForm.relatedRiskId"><option value="">Kein verknüpftes Risiko</option><option v-for="risk in project.risks" :key="risk.id" :value="risk.id">{{ risk.title }}</option></select></label>
              <label class="field field--full"><span>Related Gap <small>optional</small></span><textarea v-model="actionForm.relatedGap" rows="2" maxlength="2000" /></label>
              <label class="field field--full"><span>Desired Evidence</span><textarea v-model="actionForm.desiredEvidence" rows="3" maxlength="5000" required placeholder="Welches Wissen oder welcher Nachweis soll nach der Aktion vorliegen?" /></label>
              <fieldset v-if="project.evidence.length" class="field field--full evidence-area-fieldset">
                <legend>Vorhandene Evidenz verknüpfen <small>optional</small></legend>
                <div class="entity-option-list">
                  <label v-for="evidence in project.evidence" :key="evidence.id" class="evidence-area-option">
                    <input type="checkbox" :checked="actionForm.evidenceIds.includes(evidence.id)" @change="toggleEvidence(evidence.id)" /><span>{{ evidence.statement }}</span>
                  </label>
                </div>
              </fieldset>
              <div class="form-actions field--full">
                <button class="button button-primary button-with-icon" type="submit"><Plus v-if="!editingActionId" :size="16" aria-hidden="true" /><Pencil v-else :size="16" aria-hidden="true" /><span>{{ editingActionId ? 'Aktion speichern' : 'Aktion anlegen' }}</span></button>
                <button v-if="editingActionId" class="button button-secondary" type="button" @click="resetActionForm">Abbrechen</button>
              </div>
            </form>

            <div class="work-object-list">
              <article v-for="action in project.actions" :key="action.id" class="work-object-card action-card">
                <div class="work-object-card-heading"><div><strong>{{ action.title }}</strong><span>{{ areaLabels[action.relatedArea] }}</span></div><button class="button button-secondary button-with-icon compact-button" type="button" @click="editAction(action)"><Pencil :size="14" aria-hidden="true" /><span>Bearbeiten</span></button></div>
                <p v-if="action.relatedRiskId"><strong>Verknüpftes Risiko:</strong> {{ riskById.get(action.relatedRiskId)?.title ?? action.relatedRiskId }}</p>
                <p><strong>Desired Evidence:</strong> {{ action.desiredEvidence || 'Noch nicht beschrieben.' }}</p>
                <label class="inline-status"><span>Status</span><select :value="action.status" :aria-label="`Status für Aktion ${action.title}`" @change="changeActionStatus(action, $event)"><option v-for="(label, value) in actionStatusLabels" :key="value" :value="value">{{ label }}</option></select></label>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>
