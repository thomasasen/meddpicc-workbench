import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'

import { defaultProject } from '../data/defaultProject'
import { createNewProject, type NewProjectInput, type NewProjectOptions } from '../data/newProject'
import type { MeddpiccProject, ProjectMeta, ProjectHistoryEvent, ProjectRisk, ProjectAction } from '../domain/project'
import { createEvidence, type EvidenceCreateOptions, type EvidenceDraft } from '../domain/evidence'
import {
  createAction,
  createRisk,
  updateAction,
  updateRisk,
  type ActionCreateOptions,
  type ActionDraft,
  type RiskCreateOptions,
  type RiskDraft,
} from '../domain/riskAction'
import { prepareProjectForSave, suggestProjectFileName } from '../domain/projectPersistence'
import {
  loadProject,
  serializeProject,
  validateProject,
  ProjectValidationError,
  type ProjectLoadResult,
} from '../domain/projectSchema'

export type ProjectSource = 'demo' | 'file' | 'new'

export type HistoryMutationOptions = {
  now?: Date
  historyId?: string
}

export type RiskMutationOptions = RiskCreateOptions & HistoryMutationOptions
export type ActionMutationOptions = ActionCreateOptions & HistoryMutationOptions

function createHistoryId(type: ProjectHistoryEvent['type'], entityId: string): string {
  return `history_${type}_${entityId}_${globalThis.crypto.randomUUID().replaceAll('-', '_')}`
}

export type PreparedProjectDownload = {
  project: MeddpiccProject
  content: string
  fileName: string
}

export const useProjectStore = defineStore('project', () => {
  const project = ref<MeddpiccProject>(structuredClone(defaultProject))
  const source = ref<ProjectSource>('demo')
  const fileName = ref<string | null>(null)
  const dirty = ref(false)

  function replaceProject(
    nextProject: MeddpiccProject,
    nextSource: ProjectSource = 'file',
    nextFileName: string | null = null,
    nextDirty = false,
  ) {
    project.value = structuredClone(nextProject)
    source.value = nextSource
    fileName.value = nextFileName
    dirty.value = nextDirty
  }

  function resetToDemo() {
    replaceProject(defaultProject, 'demo', null, false)
  }

  function createProject(input: NewProjectInput, options?: NewProjectOptions) {
    const nextProject = createNewProject(input, options)
    replaceProject(nextProject, 'new', suggestProjectFileName(nextProject), true)
  }

  function importProjectText(raw: string, importedFileName: string): ProjectLoadResult {
    const result = loadProject(raw)

    if (result.success) {
      replaceProject(result.project, 'file', importedFileName, result.migration !== null)
    }

    return result
  }

  function commitValidatedProject(nextProject: MeddpiccProject) {
    const validation = validateProject(nextProject)
    if (!validation.success) {
      throw new ProjectValidationError('Die Änderung würde einen ungültigen Projektstand erzeugen.', validation.issues)
    }

    project.value = structuredClone(validation.project)
    dirty.value = true
  }

  function addEvidence(draft: EvidenceDraft, options: EvidenceCreateOptions = {}) {
    const evidence = createEvidence(draft, options)
    const nextProject = structuredClone(toRaw(project.value))
    nextProject.evidence.push(evidence)

    const historyEvent: ProjectHistoryEvent = {
      id: `history_${evidence.id}`,
      timestamp: evidence.createdAt,
      type: 'evidence_added',
      area: evidence.relatedAreas.length === 1 ? evidence.relatedAreas[0] : null,
      entityId: evidence.id,
      summary: `Evidenz hinzugefügt: ${evidence.statement}`,
    }
    nextProject.history.push(historyEvent)

    commitValidatedProject(nextProject)
    return evidence
  }

  function appendHistory(
    nextProject: MeddpiccProject,
    event: Omit<ProjectHistoryEvent, 'id' | 'timestamp'>,
    options: HistoryMutationOptions = {},
    timestamp?: string,
  ) {
    nextProject.history.push({
      id: options.historyId ?? createHistoryId(event.type, event.entityId ?? 'project'),
      timestamp: timestamp ?? (options.now ?? new Date()).toISOString(),
      ...event,
    })
  }

  function addRisk(draft: RiskDraft, options: RiskMutationOptions = {}) {
    const risk = createRisk(draft, options)
    const nextProject = structuredClone(toRaw(project.value))
    nextProject.risks.push(risk)

    if (risk.status === 'open') {
      appendHistory(
        nextProject,
        {
          type: 'risk_opened',
          area: risk.relatedArea,
          entityId: risk.id,
          summary: `Risiko eröffnet: ${risk.title}`,
        },
        options,
        risk.openedAt,
      )
    }

    commitValidatedProject(nextProject)
    return risk
  }

  function updateRiskRecord(riskId: string, draft: RiskDraft, options: HistoryMutationOptions = {}) {
    const nextProject = structuredClone(toRaw(project.value))
    const index = nextProject.risks.findIndex((risk) => risk.id === riskId)

    if (index < 0) {
      throw new ProjectValidationError('Das Risiko existiert nicht.', [
        {
          source: 'domain',
          code: 'missing_risk',
          path: '/risks',
          message: `Risk-ID "${riskId}" existiert nicht.`,
        },
      ])
    }

    const previous = nextProject.risks[index]
    const updated = updateRisk(previous, draft)
    nextProject.risks[index] = updated

    if (previous.status !== 'closed' && updated.status === 'closed') {
      appendHistory(nextProject, {
        type: 'risk_closed',
        area: updated.relatedArea,
        entityId: updated.id,
        summary: `Risiko geschlossen: ${updated.title}`,
      }, options)
    }

    commitValidatedProject(nextProject)
    return updated
  }

  function setRiskStatus(riskId: string, status: ProjectRisk['status'], options: HistoryMutationOptions = {}) {
    const current = project.value.risks.find((risk) => risk.id === riskId)
    if (!current) {
      return updateRiskRecord(
        riskId,
        {
          title: '',
          severity: 'low',
          status,
          relatedArea: 'metrics',
          relatedEntityIds: [],
          impact: '',
        },
        options,
      )
    }

    return updateRiskRecord(
      riskId,
      {
        title: current.title,
        severity: current.severity,
        status,
        relatedArea: current.relatedArea,
        relatedEntityIds: current.relatedEntityIds,
        impact: current.impact,
        mitigation: current.mitigation,
        owner: current.owner,
        dueDate: current.dueDate,
      },
      options,
    )
  }

  function addAction(draft: ActionDraft, options: ActionMutationOptions = {}) {
    const action = createAction(draft, options)
    const nextProject = structuredClone(toRaw(project.value))
    nextProject.actions.push(action)
    commitValidatedProject(nextProject)
    return action
  }

  function updateActionRecord(actionId: string, draft: ActionDraft, options: HistoryMutationOptions = {}) {
    const nextProject = structuredClone(toRaw(project.value))
    const index = nextProject.actions.findIndex((action) => action.id === actionId)

    if (index < 0) {
      throw new ProjectValidationError('Die Aktion existiert nicht.', [
        {
          source: 'domain',
          code: 'missing_action',
          path: '/actions',
          message: `Action-ID "${actionId}" existiert nicht.`,
        },
      ])
    }

    const previous = nextProject.actions[index]
    const updated = updateAction(previous, draft)
    nextProject.actions[index] = updated

    if (previous.status !== 'completed' && updated.status === 'completed') {
      appendHistory(nextProject, {
        type: 'action_completed',
        area: updated.relatedArea,
        entityId: updated.id,
        summary: `Aktion abgeschlossen: ${updated.title}`,
      }, options)
    }

    commitValidatedProject(nextProject)
    return updated
  }

  function setActionStatus(actionId: string, status: ProjectAction['status'], options: HistoryMutationOptions = {}) {
    const current = project.value.actions.find((action) => action.id === actionId)
    if (!current) {
      return updateActionRecord(
        actionId,
        {
          title: '',
          status,
          relatedArea: 'metrics',
          desiredEvidence: '',
          evidenceIds: [],
        },
        options,
      )
    }

    return updateActionRecord(
      actionId,
      {
        title: current.title,
        status,
        owner: current.owner,
        dueDate: current.dueDate,
        relatedArea: current.relatedArea,
        relatedRiskId: current.relatedRiskId,
        relatedGap: current.relatedGap,
        desiredEvidence: current.desiredEvidence,
        evidenceIds: current.evidenceIds,
      },
      options,
    )
  }

  function updateProjectMeta(patch: Partial<ProjectMeta>) {
    project.value.project = {
      ...project.value.project,
      ...patch,
    }

    if ('targetGoLiveDate' in patch) {
      project.value.planning.targetGoLiveDate = patch.targetGoLiveDate ?? null
    }

    dirty.value = true
  }

  function markDirty() {
    dirty.value = true
  }

  function prepareDownload(savedAt: Date = new Date()): PreparedProjectDownload {
    const snapshot = prepareProjectForSave(project.value, savedAt)
    const content = serializeProject(snapshot)

    return {
      project: snapshot,
      content,
      fileName: fileName.value ?? suggestProjectFileName(snapshot),
    }
  }

  function confirmDownloaded(download: PreparedProjectDownload) {
    replaceProject(download.project, 'file', download.fileName, false)
  }

  return {
    project,
    source,
    fileName,
    dirty,
    replaceProject,
    resetToDemo,
    createProject,
    importProjectText,
    updateProjectMeta,
    addEvidence,
    addRisk,
    updateRisk: updateRiskRecord,
    setRiskStatus,
    addAction,
    updateAction: updateActionRecord,
    setActionStatus,
    markDirty,
    prepareDownload,
    confirmDownloaded,
  }
})
