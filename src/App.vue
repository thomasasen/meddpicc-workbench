<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterView } from 'vue-router'

import { useProjectStore } from './stores/projectStore'

const projectStore = useProjectStore()

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
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('wheel', handleSelectWheel, { capture: true })
})
</script>

<template>
  <RouterView />
</template>
