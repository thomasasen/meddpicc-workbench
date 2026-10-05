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

onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', handleBeforeUnload))
</script>

<template>
  <RouterView />
</template>
