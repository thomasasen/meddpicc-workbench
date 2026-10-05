<script setup lang="ts">
import { ArrowLeft, ExternalLink, Pencil, Plus, Save } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { ProjectReference } from '../domain/project'
import { ProjectValidationError, type ProjectValidationIssue } from '../domain/projectSchema'
import { downloadTextFile } from '../services/browserFile'
import { useProjectStore } from '../stores/projectStore'

const projectStore = useProjectStore()
const { project, dirty, fileName } = storeToRefs(projectStore)

const typeLabels: Record<ProjectReference['type'], string> = {
  meeting: 'Meeting',
  crm: 'CRM',
  document: 'Dokument',
  email: 'E-Mail',
  rfp: 'RFP',
  contract: 'Vertrag',
  other: 'Sonstige Quelle',
}

const editingReferenceId = ref<string | null>(null)
const statusMessage = ref('')
const issues = ref<ProjectValidationIssue[]>([])
const form = ref({
  type: 'meeting' as ProjectReference['type'],
  title: '',
  date: '',
  externalId: '',
  url: '',
  notes: '',
})

const sortedReferences = computed(() =>
  [...project.value.references].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title)),
)

function evidenceCount(referenceId: string): number {
  return project.value.evidence.filter((item) => item.referenceId === referenceId).length
}

function resetForm() {
  editingReferenceId.value = null
  form.value = {
    type: 'meeting',
    title: '',
    date: '',
    externalId: '',
    url: '',
    notes: '',
  }
}

function clearMessages() {
  statusMessage.value = ''
  issues.value = []
}

function submitReference() {
  clearMessages()

  try {
    const draft = {
      type: form.value.type,
      title: form.value.title,
      date: form.value.date || null,
      externalId: form.value.externalId || null,
      url: form.value.url || null,
      notes: form.value.notes,
    }

    const reference = editingReferenceId.value
      ? projectStore.updateReference(editingReferenceId.value, draft)
      : projectStore.addReference(draft)

    statusMessage.value = `Quelle „${reference.title}“ wurde ${editingReferenceId.value ? 'aktualisiert' : 'angelegt'}.`
    resetForm()
  } catch (error) {
    if (error instanceof ProjectValidationError) {
      issues.value = error.issues
      return
    }

    issues.value = [
      {
        source: 'domain',
        code: 'reference_change_failed',
        path: '/references',
        message: 'Die Quelle konnte nicht gespeichert werden.',
      },
    ]
  }
}

function editReference(reference: ProjectReference) {
  clearMessages()
  editingReferenceId.value = reference.id
  form.value = {
    type: reference.type,
    title: reference.title,
    date: reference.date ?? '',
    externalId: reference.externalId ?? '',
    url: reference.url ?? '',
    notes: reference.notes,
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
          <RouterLink class="icon-link" to="/evidence">Evidenzregister</RouterLink>
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
            <p class="eyebrow">Roadmap 2 · Source Data</p>
            <h1>Quellen &amp; Referenzen</h1>
            <p class="intro-text">
              Reference-Records beschreiben den Ursprung von Evidenz, zum Beispiel Meetings, Dokumente, CRM-Einträge
              oder E-Mails. Sie speichern Metadaten, nicht den eigentlichen Dateiinhalt.
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

      <div v-if="issues.length" class="container project-message project-message--error workbench-message" role="alert">
        <div>
          <strong>Quelle konnte nicht gespeichert werden.</strong>
          <ul>
            <li v-for="issue in issues" :key="`${issue.code}-${issue.path}-${issue.message}`">
              {{ issue.message }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="statusMessage" class="container project-message project-message--success workbench-message" role="status">
        <strong>{{ statusMessage }}</strong>
      </div>

      <section class="section evidence-workspace">
        <div class="container evidence-layout">
          <section class="evidence-form-panel" aria-labelledby="reference-form-title">
            <div>
              <p class="eyebrow">{{ editingReferenceId ? 'Quelle bearbeiten' : 'Neue Quelle' }}</p>
              <h2 id="reference-form-title">Quelleneintrag pflegen</h2>
            </div>

            <form class="evidence-form" @submit.prevent="submitReference">
              <label class="field">
                <span>Typ</span>
                <select v-model="form.type">
                  <option v-for="(label, value) in typeLabels" :key="value" :value="value">{{ label }}</option>
                </select>
              </label>

              <label class="field">
                <span>Datum <small>optional</small></span>
                <input v-model="form.date" type="date" />
              </label>

              <label class="field field--full">
                <span>Titel</span>
                <input v-model="form.title" required maxlength="500" placeholder="Zum Beispiel CFO Steering Committee" />
              </label>

              <label class="field field--full">
                <span>Externe ID <small>optional</small></span>
                <input v-model="form.externalId" maxlength="500" placeholder="CRM-ID, Dokument-ID oder Meeting-ID" />
              </label>

              <label class="field field--full">
                <span>URL <small>optional · http/https</small></span>
                <input v-model="form.url" type="url" maxlength="2000" placeholder="https://…" />
              </label>

              <label class="field field--full">
                <span>Notizen</span>
                <textarea v-model="form.notes" rows="3" maxlength="5000" />
              </label>

              <div class="form-actions field--full">
                <button class="button button-primary button-with-icon" type="submit">
                  <Plus v-if="!editingReferenceId" :size="16" aria-hidden="true" />
                  <Pencil v-else :size="16" aria-hidden="true" />
                  <span>{{ editingReferenceId ? 'Quelle speichern' : 'Quelle anlegen' }}</span>
                </button>
                <button v-if="editingReferenceId" class="button button-secondary" type="button" @click="resetForm">
                  Abbrechen
                </button>
              </div>
            </form>
          </section>

          <section class="evidence-list-panel" aria-labelledby="reference-list-title">
            <div class="evidence-list-heading">
              <div>
                <p class="eyebrow">Projektweite Source Data</p>
                <h2 id="reference-list-title">Gespeicherte Quellen</h2>
              </div>
              <span class="count-badge">{{ sortedReferences.length }} Einträge</span>
            </div>

            <p v-if="sortedReferences.length === 0" class="empty-state">
              Noch keine Quelle hinterlegt. Lege zuerst ein Meeting, Dokument oder einen anderen Reference-Record an.
            </p>

            <article v-for="reference in sortedReferences" :id="`reference-${reference.id}`" :key="reference.id" class="reference-card">
              <div class="work-object-card-heading">
                <div>
                  <strong>{{ reference.title }}</strong>
                  <span>{{ typeLabels[reference.type] }} · {{ reference.date ?? 'Datum offen' }}</span>
                </div>
                <button class="button button-secondary button-with-icon compact-button" type="button" @click="editReference(reference)">
                  <Pencil :size="14" aria-hidden="true" />
                  <span>Bearbeiten</span>
                </button>
              </div>

              <dl class="reference-details">
                <div>
                  <dt>Reference-ID</dt>
                  <dd>{{ reference.id }}</dd>
                </div>
                <div>
                  <dt>Externe ID</dt>
                  <dd>{{ reference.externalId ?? 'Nicht hinterlegt' }}</dd>
                </div>
                <div>
                  <dt>Verknüpfte Evidenz</dt>
                  <dd>{{ evidenceCount(reference.id) }}</dd>
                </div>
              </dl>

              <p v-if="reference.notes" class="evidence-context">{{ reference.notes }}</p>

              <a
                v-if="reference.url"
                class="reference-link heading-with-icon"
                :href="reference.url"
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink :size="14" aria-hidden="true" />
                <span>Externe Quelle öffnen</span>
              </a>
            </article>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>
