import { defineStore } from 'pinia'
import { ref } from 'vue'

import { defaultProject } from '../data/defaultProject'
import { createNewProject, type NewProjectInput, type NewProjectOptions } from '../data/newProject'
import type { MeddpiccProject, ProjectMeta, ProjectHistoryEvent } from '../domain/project'
import { createEvidence, type EvidenceCreateOptions, type EvidenceDraft } from '../domain/evidence'
import { prepareProjectForSave, suggestProjectFileName } from '../domain/projectPersistence'
import {
  loadProject,
  serializeProject,
  validateProject,
  ProjectValidationError,
  type ProjectLoadResult,
} from '../domain/projectSchema'

export type ProjectSource = 'demo' | 'file' | 'new'

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
    const nextProject = structuredClone(project.value)
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
    markDirty,
    prepareDownload,
    confirmDownloaded,
  }
})
