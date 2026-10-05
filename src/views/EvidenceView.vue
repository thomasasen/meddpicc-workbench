<script setup lang="ts">
import { ArrowLeft, CircleCheck, Pencil, Plus, Save } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { ProjectAreaKey, ProjectEvidence, ProjectReference } from '../domain/project'
import {
  listQualificationEvidenceTargets,
  qualificationAreaLabels,
  qualificationEvidenceLinksForEvidence,
  qualificationTargetsForEvidence,
  type QualificationEvidenceTarget,
} from '../domain/qualificationEvidence'
import { ProjectValidationError, type ProjectValidationIssue } from '../domain/projectSchema'
import { downloadTextFile } from '../services/browserFile'
import { useProjectStore } from '../stores/projectStore'

const projectStore = useProjectStore()
const { project, dirty, fileName } = storeToRefs(projectStore)

const areaLabels = qualificationAreaLabels
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

const referenceTypeLabels: Record<ProjectReference['type'], string> = {
  meeting: 'Meeting',
  crm: 'CRM',
  document: 'Dokument',
  email: 'E-Mail',
  rfp: 'RFP',
  contract: 'Vertrag',
  other: 'Sonstige Quelle',
}

const form = ref({
  statement: '',
  classification: 'customer_statement' as ProjectEvidence['classification'],
  quality: 'unknown' as ProjectEvidence['quality'],
  verification: 'unconfirmed' as ProjectEvidence['verification'],
  sourceStakeholderId: '',
  sourceDate: '',
  referenceId: '',
  context: '',
  relatedAreas: [] as ProjectAreaKey[],
  entityTargetKeys: [] as string[],
})

const statusMessage = ref('')
const issues = ref<ProjectValidationIssue[]>([])
const linkIssues = ref<ProjectValidationIssue[]>([])
const editingEvidenceId = ref<string | null>(null)
const editEntityTargetKeys = ref<string[]>([])

const targetGroups = computed(() => listQualificationEvidenceTargets(project.value))
const sortedEvidence = computed(() =>
  [...project.value.evidence].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
)

function stakeholderName(id: string | null): string {
  if (!id) return 'Keine Person hinterlegt'
  return project.value.stakeholders.find((stakeholder) => stakeholder.id === id)?.name ?? id
}

function referenceTitle(id: string | null): string {
  if (!id) return 'Keine Reference hinterlegt'
  return project.value.references.find((reference) => reference.id === id)?.title ?? id
}

function targetKey(target: QualificationEvidenceTarget): string {
  return `${target.area}::${target.entityId}`
}

function targetsFromKeys(keys: readonly string[]): QualificationEvidenceTarget[] {
  const byKey = new Map<string, QualificationEvidenceTarget>()

  for (const group of targetGroups.value) {
    for (const target of group.targets) {
      byKey.set(targetKey(target), {
        area: target.area,
        entityId: target.entityId,
      })
    }
  }

  return [...new Set(keys)].flatMap((key) => {
    const target = byKey.get(key)
    return target ? [target] : []
  })
}

function linkedEntityLabels(evidenceId: string) {
  return qualificationEvidenceLinksForEvidence(project.value, evidenceId)
}

function startLinkEdit(evidenceId: string) {
  editingEvidenceId.value = evidenceId
  editEntityTargetKeys.value = qualificationTargetsForEvidence(project.value, evidenceId).map(targetKey)
  linkIssues.value = []
  statusMessage.value = ''
}

function cancelLinkEdit() {
  editingEvidenceId.value = null
  editEntityTargetKeys.value = []
  linkIssues.value = []
}

function saveEvidenceLinks(evidenceId: string) {
  linkIssues.value = []
  statusMessage.value = ''

  try {
    projectStore.setEvidenceQualificationLinks(evidenceId, targetsFromKeys(editEntityTargetKeys.value))
    editingEvidenceId.value = null
    editEntityTargetKeys.value = []
    statusMessage.value = 'Konkrete Qualification-Entity-Verknüpfungen wurden aktualisiert.'
  } catch (error) {
    if (error instanceof ProjectValidationError) {
      linkIssues.value = error.issues
      return
    }

    linkIssues.value = [
      {
        source: 'domain',
        code: 'evidence_entity_link_failed',
        path: '/meddpicc',
        message: 'Die konkreten Qualification-Entity-Verknüpfungen konnten nicht aktualisiert werden.',
      },
    ]
  }
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
    referenceId: '',
    context: '',
    relatedAreas: [],
    entityTargetKeys: [],
  }
}

function submitEvidence() {
  statusMessage.value = ''
  issues.value = []

  try {
    const evidence = projectStore.addEvidence(
      {
        statement: form.value.statement,
        classification: form.value.classification,
        quality: form.value.quality,
        verification: form.value.verification,
        sourceStakeholderId: form.value.sourceStakeholderId || null,
        sourceDate: form.value.sourceDate || null,
        context: form.value.context || null,
        referenceId: form.value.referenceId || null,
        relatedAreas: form.value.relatedAreas,
      },
      {
        entityTargets: targetsFromKeys(form.value.entityTargetKeys),
      },
    )

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
          <RouterLink class="icon-link" to="/references">Quellen</RouterLink>
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
                <span>Quellenreferenz <small>optional</small></span>
                <select v-model="form.referenceId">
                  <option value="">Keine Reference hinterlegt</option>
                  <option v-for="reference in project.references" :key="reference.id" :value="reference.id">
                    {{ reference.title }} · {{ referenceTypeLabels[reference.type] }}
                  </option>
                </select>
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
                <legend>MEDDPICC-Bereiche <small>grobe Zuordnung</small></legend>
                <div class="evidence-area-grid">
                  <label v-for="[area, label] in areaEntries" :key="area" class="evidence-area-option">
                    <input type="checkbox" :checked="form.relatedAreas.includes(area)" @change="toggleArea(area)" />
                    <span>{{ label }}</span>
                  </label>
                </div>
              </fieldset>

              <fieldset class="field field--full evidence-entity-fieldset">
                <legend>Konkrete Qualification-Entities <small>optional</small></legend>
                <p class="field-help">
                  Diese Links sagen konkret, welche Metric, welcher Process Step oder welche andere Qualification-Entity
                  durch die Evidenz gestützt wird. Sie sind nicht dasselbe wie die grobe Bereichszuordnung oben.
                </p>
                <div class="entity-target-groups">
                  <details v-for="group in targetGroups" :key="group.area" class="entity-target-group">
                    <summary>
                      <span>{{ group.label }}</span>
                      <small>{{ group.targets.length }} verfügbar</small>
                    </summary>
                    <p v-if="group.unsupportedReason" class="entity-target-note">{{ group.unsupportedReason }}</p>
                    <p v-else-if="group.targets.length === 0" class="entity-target-note">
                      In diesem Projekt ist noch keine konkrete Entity vorhanden.
                    </p>
                    <div v-else class="entity-option-list">
                      <label v-for="target in group.targets" :key="targetKey(target)" class="evidence-area-option">
                        <input v-model="form.entityTargetKeys" type="checkbox" :value="targetKey(target)" />
                        <span>{{ target.label }}</span>
                      </label>
                    </div>
                  </details>
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
              :id="`evidence-${evidence.id}`"
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
                  <dt>Reference</dt>
                  <dd>{{ referenceTitle(evidence.referenceId) }}</dd>
                </div>
                <div>
                  <dt>MEDDPICC-Bereiche</dt>
                  <dd>
                    {{
                      evidence.relatedAreas.length
                        ? evidence.relatedAreas.map((area) => areaLabels[area]).join(', ')
                        : 'Noch nicht zugeordnet'
                    }}
                  </dd>
                </div>
              </dl>

              <section class="evidence-entity-links" :aria-label="`Konkrete Verknüpfungen für ${evidence.statement}`">
                <div class="evidence-entity-links-heading">
                  <div>
                    <strong>Konkrete Qualification-Entities</strong>
                    <p>Explizite Evidence-Links, getrennt von der groben MEDDPICC-Bereichszuordnung.</p>
                  </div>
                  <button
                    class="button button-secondary button-with-icon compact-button"
                    type="button"
                    @click="startLinkEdit(evidence.id)"
                  >
                    <Pencil :size="14" aria-hidden="true" />
                    <span>Links bearbeiten</span>
                  </button>
                </div>

                <div v-if="linkedEntityLabels(evidence.id).length" class="evidence-entity-chip-list">
                  <span
                    v-for="link in linkedEntityLabels(evidence.id)"
                    :key="`${link.area}-${link.label}`"
                    class="evidence-entity-chip"
                  >
                    <strong>{{ areaLabels[link.area] }}</strong>
                    <span>{{ link.label }}</span>
                    <small v-if="!link.editable">bestehender Behavior-Link · nur lesbar</small>
                  </span>
                </div>
                <p v-else class="entity-target-note">Noch keine konkrete Qualification-Entity verknüpft.</p>

                <div v-if="editingEvidenceId === evidence.id" class="evidence-link-editor">
                  <div class="entity-target-groups">
                    <details v-for="group in targetGroups" :key="group.area" class="entity-target-group">
                      <summary>
                        <span>{{ group.label }}</span>
                        <small>{{ group.targets.length }} verfügbar</small>
                      </summary>
                      <p v-if="group.unsupportedReason" class="entity-target-note">{{ group.unsupportedReason }}</p>
                      <p v-else-if="group.targets.length === 0" class="entity-target-note">
                        In diesem Projekt ist noch keine konkrete Entity vorhanden.
                      </p>
                      <div v-else class="entity-option-list">
                        <label v-for="target in group.targets" :key="targetKey(target)" class="evidence-area-option">
                          <input
                            v-model="editEntityTargetKeys"
                            type="checkbox"
                            :value="targetKey(target)"
                          />
                          <span>{{ target.label }}</span>
                        </label>
                      </div>
                    </details>
                  </div>

                  <div class="form-actions evidence-link-actions">
                    <button
                      class="button button-primary compact-button"
                      type="button"
                      @click="saveEvidenceLinks(evidence.id)"
                    >
                      Links speichern
                    </button>
                    <button class="button button-secondary compact-button" type="button" @click="cancelLinkEdit">
                      Abbrechen
                    </button>
                  </div>

                  <div v-if="linkIssues.length" class="project-message project-message--error" role="alert">
                    <div>
                      <strong>Verknüpfungen wurden nicht geändert.</strong>
                      <ul>
                        <li v-for="issue in linkIssues" :key="`${issue.code}-${issue.path}`">
                          {{ issue.message }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <p v-if="evidence.context" class="evidence-context">{{ evidence.context }}</p>
            </article>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>
