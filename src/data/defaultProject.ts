import demoProjectRaw from '../../examples/demo-opportunity.meddpicc?raw'

import { isMeddpiccProject, type MeddpiccProject } from '../domain/project'

export function parseProject(raw: string): MeddpiccProject {
  const parsed: unknown = JSON.parse(raw)

  if (!isMeddpiccProject(parsed)) {
    throw new Error('Die Demo-Projektdatei entspricht nicht dem erwarteten Pre-Alpha-Format.')
  }

  return parsed
}

export const defaultProject = parseProject(demoProjectRaw)
