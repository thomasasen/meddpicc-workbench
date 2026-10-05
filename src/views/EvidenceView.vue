<script setup lang="ts">
import { ArrowLeft, CircleCheck, Plus, Save } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { ProjectAreaKey, ProjectEvidence } from '../domain/project'
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

const classificationLabels: Record<ProjectEvidence['classification'], string> = {
  fact: 'Fakt',
  customer_statement: 'Kundenaussage',
  seller_interpretation: 'Seller-Interpretation',
  assumption: 'Annahme',
  confirmed_evidence: 'Bestätigte Evidenz',
  unknown: 'Unbekannt',
}

const qualityLabels: Record<ProjectEvidence['quality'], string> = {
  unknown: 'Qualität unbekannt',
  low: 'Niedrige Qualität',
  medium: 'Mittlere Qualität',
  high: 'Hohe Qualität',
}

const verificationLabels: Record<ProjectEvidence['verification'], string> = {
  unconfirmed: 'Unbestätigt',
  single_source: 'Eine Quelle',
  corroborated: 'Mehrfach gestützt',
  confirmed: 'Bestätigt',
  observed: 'Beobachtet',
}

const form = ref({
  statement: '',
  classification: 'customer_statement' as ProjectEvidence['classification'],
  quality: 'unknown' as ProjectEvidence['quality'],
  verification: 'unconfirmed' as ProjectEvidence['verification'],
  sourceStakeholderId: '',
  sourceDate: '',
  context: '',
  relatedAreas: [] as ProjectAreaKey[],
})

const statusMessage = ref('')
const issues = ref<ProjectValidationIssue[]>([])

const sortedEvidence = computed(() =>
  [...project.value.evidence].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
)

function stakeholderName(id: string | null): string {
  if (!id) return 'Keine Person hinterlegt'
  return project.value.stakeholders.find((stakeholder) => stakeholder.id === id)?.name ?? id
}

function evidenceTone(evidence: ProjectEvidence): string {
  if (evidence.classification === 'confirmed_evidence' || evidence.verification === 'confirmed') {
    return 'evidence-card--confirmed'
  }
  if (evidence.classification === 'assumption' || evidence.classification === 'seller_interpretation') {
    return 'evidence-card--assumption'
  }
  if (evidence.classification === 'unknown') return 'evidence-card--unknown'
  return ''
}

function toggleArea(area: ProjectAreaKey) {
  form.value.relatedAreas = form.value.relatedAreas.includes(area)
    ? form.value.relatedAreas.filter((candidate) => candidate !== area)
    : [...form.value.relatedAreas, area]
}

function resetForm() {
  form.value = {
    statement: '',
    classification: 'customer_statement',
    quality: 'unknown',
    verification: 'unconfirmed',
    sourceStakeholderId: '',
    sourceDate: '',
    context: '',
    relatedAreas: [],
  }
}

function submitEvidence() {
  statusMessage.value = ''
  issues.value = []

  try {
    const evidence = projectStore.addEvidence({
      statement: form.value.statement,
      classification: form.value.classification,
      quality: form.value.quality,
      verification: form.value.verification,
      sourceStakeholderId: form.value.sourceStakeholderId || null,
      sourceDate: form.value.sourceDate || null,
      context: form.value.context || null,
      referenceId: null,
      relatedAreas: form.value.relatedAreas,
    })

    statusMessage.value = `Evidenz „${evidence.statement}“ wurde angelegt.`
    resetForm()
  } catch (error) {
    if (error instanceof ProjectValidationError) {
      issues.value = error.issues
      return
    }

    issues.value = [
      {
        source: 'domain',
        code: 'evidence_create_failed',
        path: '/evidence',
        message: 'Die Evidenz konnte nicht angelegt werden.',
      },
    ]
  }
}

function saveProject() {
  statusMessage.value = ''
  issues.value = []

  try {
    const download = projectStore.prepareDownload()
    downloadTextFile(download.content, download.fileName)
    projectStore.confirmDownloaded(download)
    statusMessage.value = `${download.fileName} wurde als validierte Projektdatei heruntergeladen.`
  } catch (error) {
    if (error instanceof ProjectValidationError) {
      issues.value = error.issues
      return
    }

    issues.value = [
      {
        source: 'file',
        code: 'download_failed',
        path: '/',
        message: 'Das Projekt konnte nicht gespeichert werden.',
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
        <RouterLink class="brand" to="/" aria-label="Zur MEDDPICC Workbench">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Workbench</strong>
            <span>Local-first Deal-Qualifizierung</span>
          </span>
        </RouterLink>

        <div class="header-actions">
          <RouterLink class="icon-link heading-with-icon" to="/">
            <ArrowLeft :size="16" aria-hidden="true" />
            <span>Dashboard</span>
          </RouterLink>
          <button class="button button-primary button-with-icon" type="button" @click="saveProject">
            <Save :size="16" aria-hidden="true" />
            <span>Projekt speichern</span>
          </button>
        </div>
      </div>
    </header>

    <main id="main-content">
      <section class="evidence-hero">
        <div class="container evidence-hero-inner">
          <div>
            <p class="eyebrow">Roadmap 2 · Gemeinsames Qualifizierungsmodell</p>
            <h1>Evidenzregister</h1>
            <p class="intro-text">
              Aussagen werden mit Klassifikation, Verifikation, Quelle und MEDDPICC-Bezug gespeichert. Eine
              Kundenaussage wird dabei nicht automatisch zu einem bestätigten Fakt.
            </p>
          </div>
          <div class="evidence-project-state">
            <span>Aktuelles Projekt</span>
            <strong>{{ project.project.accountName }} · {{ project.project.name }}</strong>
            <small>{{ fileName ?? 'Noch nicht gespeichert' }}</small>
            <span class="project-save-state" :class="{ 'project-save-state--dirty': dirty }">
              {{ dirty ? 'Ungespeicherte Änderungen' : 'Gespeicherter Stand' }}
            </span>
          </div>
        </div>
      </section>

      <section class="section evidence-workspace">
        <div class="container evidence-layout">
          <section class="evidence-form-panel" aria-labelledby="evidence-form-title">
            <div>
              <p class="eyebrow">Neue Evidenz</p>
              <h2 id="evidence-form-title">Beobachtung oder Aussage erfassen</h2>
            </div>

            <form class="evidence-form" @submit.prevent="submitEvidence">
              <label class="field field--full">
                <span>Aussage</span>
                <textarea
                  v-model="form.statement"
                  required
                  maxlength="5000"
                  rows="4"
                  placeholder="Was wissen wir konkret – und was wurde tatsächlich gesagt oder beobachtet?"
                />
              </label>

              <label class="field">
                <span>Klassifikation</span>
                <select v-model="form.classification">
                  <option v-for="(label, value) in classificationLabels" :key="value" :value="value">
                    {{ label }}
                  </option>
                </select>
              </label>

              <label class="field">
                <span>Verifikation</span>
                <select v-model="form.verification">
                  <option v-for="(label, value) in verificationLabels" :key="value" :value="value">{{ label }}</option>
                </select>
              </label>

              <label class="field">
                <span>Evidenzqualität</span>
                <select v-model="form.quality">
                  <option v-for="(label, value) in qualityLabels" :key="value" :value="value">{{ label }}</option>
                </select>
              </label>

              <label class="field">
                <span>Quelle / Stakeholder</span>
                <select v-model="form.sourceStakeholderId">
                  <option value="">Keine Person hinterlegt</option>
                  <option v-for="stakeholder in project.stakeholders" :key="stakeholder.id" :value="stakeholder.id">
                    {{ stakeholder.name }} · {{ stakeholder.role || 'Rolle offen' }}
                  </option>
                </select>
              </label>

              <label class="field">
                <span>Quelldatum</span>
                <input v-model="form.sourceDate" type="date" />
              </label>

              <label class="field field--full">
                <span>Kontext</span>
                <textarea
                  v-model="form.context"
                  maxlength="2000"
                  rows="2"
                  placeholder="Zum Beispiel Meeting, Gesprächssituation oder Einschränkung."
                />
              </label>

              <fieldset class="field field--full evidence-area-fieldset">
                <legend>MEDDPICC-Bezug</legend>
                <div class="evidence-area-grid">
                  <label v-for="[area, label] in areaEntries" :key="area" class="evidence-area-option">
                    <input type="checkbox" :checked="form.relatedAreas.includes(area)" @change="toggleArea(area)" />
                    <span>{{ label }}</span>
                  </label>
                </div>
              </fieldset>

              <button class="button button-primary button-with-icon evidence-submit" type="submit">
                <Plus :size="17" aria-hidden="true" />
                <span>Evidenz hinzufügen</span>
              </button>
            </form>

            <div v-if="issues.length" class="project-message project-message--error" role="alert">
              <div>
                <strong>Evidenz konnte nicht gespeichert werden.</strong>
                <ul>
                  <li v-for="issue in issues" :key="`${issue.code}-${issue.path}`">
                    {{ issue.message }}
                  </li>
                </ul>
              </div>
            </div>

            <div v-else-if="statusMessage" class="project-message project-message--success" role="status">
              <CircleCheck :size="18" aria-hidden="true" />
              <strong>{{ statusMessage }}</strong>
            </div>
          </section>

          <section class="evidence-list-panel" aria-labelledby="evidence-list-title">
            <div class="evidence-list-heading">
              <div>
                <p class="eyebrow">Projektweite Source of Truth</p>
                <h2 id="evidence-list-title">Gespeicherte Evidenz</h2>
              </div>
              <span class="count-badge">{{ sortedEvidence.length }} Einträge</span>
            </div>

            <p v-if="sortedEvidence.length === 0" class="empty-state">
              Noch keine Evidenz hinterlegt. Erfasse links die erste Aussage oder Beobachtung.
            </p>

            <article
              v-for="evidence in sortedEvidence"
              :key="evidence.id"
              class="evidence-card"
              :class="evidenceTone(evidence)"
            >
              <div class="evidence-card-meta">
                <span class="evidence-badge">{{ classificationLabels[evidence.classification] }}</span>
                <span>{{ verificationLabels[evidence.verification] }}</span>
                <span>{{ qualityLabels[evidence.quality] }}</span>
              </div>

              <p class="evidence-statement">{{ evidence.statement }}</p>

              <dl class="evidence-details">
                <div>
                  <dt>Quelle</dt>
                  <dd>{{ stakeholderName(evidence.sourceStakeholderId) }}</dd>
                </div>
                <div>
                  <dt>Datum</dt>
                  <dd>{{ evidence.sourceDate ?? 'Nicht hinterlegt' }}</dd>
                </div>
                <div>
                  <dt>MEDDPICC</dt>
                  <dd>
                    {{
                      evidence.relatedAreas.length
                        ? evidence.relatedAreas.map((area) => areaLabels[area]).join(', ')
                        : 'Noch nicht zugeordnet'
                    }}
                  </dd>
                </div>
              </dl>

              <p v-if="evidence.context" class="evidence-context">{{ evidence.context }}</p>
            </article>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>
