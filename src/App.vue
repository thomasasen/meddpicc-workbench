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
 * Native Selects behalten die Tastaturbedienung. Beim Scrollen über einem
 * fokussierten Select wird der Fokus vor der Browser-Defaultaktion gelöst,
 * damit der Wert nicht versehentlich umgeschaltet wird.
 */
function handleSelectWheel(event: WheelEvent) {
  const target = event.target
  if (target instanceof HTMLSelectElement && document.activeElement === target) {
    target.blur()
  }
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
