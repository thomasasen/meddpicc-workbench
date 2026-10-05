import { defineStore } from 'pinia'
import { ref } from 'vue'

import { defaultProject } from '../data/defaultProject'
import type { MeddpiccProject } from '../domain/project'

export const useProjectStore = defineStore('project', () => {
  const project = ref<MeddpiccProject>(structuredClone(defaultProject))
  const source = ref<'demo' | 'file'>('demo')
  const dirty = ref(false)

  function replaceProject(nextProject: MeddpiccProject, nextSource: 'demo' | 'file' = 'file') {
    project.value = structuredClone(nextProject)
    source.value = nextSource
    dirty.value = false
  }

  function resetToDemo() {
    replaceProject(defaultProject, 'demo')
  }

  return {
    project,
    source,
    dirty,
    replaceProject,
    resetToDemo,
  }
})
