<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'

import { useProjectStore } from './stores/projectStore'

const projectStore = useProjectStore()
const router = useRouter()
const legacyRoutes = new Set(['/evidence', '/risks-actions', '/references'])
const unregisterGuard = router.beforeEach((to, from) => {
  if (!projectStore.dirty || !legacyRoutes.has(from.path) || legacyRoutes.has(to.path)) return true
  return window.confirm(
    'Das Legacy-Projekt enthält Änderungen, die nicht als .meddpicc-Datei bestätigt sind. Bereich wirklich verlassen?',
  )
})

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (!projectStore.dirty) return
  event.preventDefault()
  event.returnValue = ''
}

/**
 * Beim Scrollen den Fokus eines nativen Selects lösen, bevor der Browser
 * einen Wheel-Impuls als Optionswechsel interpretiert. Das Wheel-Event
 * kann auf einem überlagerten Element oder der Seite eintreffen, auch wenn
 * der Select noch fokussiert ist. Tastaturbedienung bleibt unverändert.
 */
function handleSelectWheel() {
  const active = document.activeElement
  if (active instanceof HTMLSelectElement) active.blur()
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('wheel', handleSelectWheel, { capture: true })
})
onBeforeUnmount(() => {
  unregisterGuard()
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('wheel', handleSelectWheel, { capture: true })
})
</script>

<template>
  <RouterView />
</template>
