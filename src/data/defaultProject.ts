import demoProjectRaw from '../../examples/demo-opportunity.meddpicc?raw'

import { loadProject, ProjectValidationError } from '../domain/projectSchema'

const result = loadProject(demoProjectRaw)

if (!result.success) {
  throw new ProjectValidationError(
    'Die eingebettete Demo-Projektdatei entspricht nicht dem erwarteten Pre-Alpha-Format.',
    result.issues,
  )
}

export const defaultProject = result.project
