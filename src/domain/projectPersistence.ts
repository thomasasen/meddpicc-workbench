import type { MeddpiccProject } from './project'

export type PreparedProjectSave = {
  project: MeddpiccProject
  fileName: string
}

export function cloneProject(project: MeddpiccProject): MeddpiccProject {
  return JSON.parse(JSON.stringify(project)) as MeddpiccProject
}

export function prepareProjectForSave(project: MeddpiccProject, savedAt: Date = new Date()): MeddpiccProject {
  const snapshot = cloneProject(project)
  snapshot.revision += 1
  snapshot.updatedAt = savedAt.toISOString()
  return snapshot
}

export function suggestProjectFileName(project: MeddpiccProject): string {
  const rawName = `${project.project.accountName} - ${project.project.name}`
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const safeName = (rawName || 'MEDDPICC Projekt').slice(0, 180).trim()
  return `${safeName}.meddpicc`
}
