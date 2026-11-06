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

/**
 * Native Fragment-Links würden bei createWebHashHistory() die Vue-Route
 * verändern. Das Skip-Link-Ziel bleibt stattdessen in der aktiven View.
 */
function handleSkipLinkClick(event: MouseEvent) {
  const source = event.target
  if (!(source instanceof Element) || !source.closest('a.skip-link[href="#main-content"]')) return

  event.preventDefault()

  const main = document.getElementById('main-content')
  if (!(main instanceof HTMLElement)) return

  if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1')
  main.focus({ preventScroll: true })

  const sectionMargin = Number.parseFloat(window.getComputedStyle(main).scrollMarginTop) || 0
  const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
  const scrollOffset = Math.max(sectionMargin, headerHeight + 16)
  window.scrollTo({
    top: Math.max(0, window.scrollY + main.getBoundingClientRect().top - scrollOffset),
    behavior: 'auto',
  })
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('wheel', handleSelectWheel, { capture: true })
  document.addEventListener('click', handleSkipLinkClick, { capture: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('wheel', handleSelectWheel, { capture: true })
  document.removeEventListener('click', handleSkipLinkClick, { capture: true })
})
</script>

<template>
  <RouterView />
</template>
