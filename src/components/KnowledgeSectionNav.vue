<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface SectionLink {
  id: string
  label: string
}

const nav = ref<HTMLElement | null>(null)
const sections = ref<SectionLink[]>([])

onMounted(() => {
  const root = nav.value?.closest('main')
  if (!root) return
  sections.value = Array.from(root.querySelectorAll<HTMLHeadingElement>('section h2[id]'))
    .filter((heading) => heading.textContent?.trim())
    .map((heading) => ({ id: heading.id, label: heading.textContent?.trim() || heading.id }))
})

function navigate(id: string): void {
  const heading = nav.value?.closest('main')?.querySelector<HTMLElement>('[id="' + id + '"]')
  if (!heading) return
  heading.setAttribute('tabindex', '-1')
  heading.scrollIntoView({ behavior: 'auto', block: 'start' })
  heading.focus({ preventScroll: true })
}
</script>

<template>
  <nav
    ref="nav"
    class="container knowledge-section-nav"
    aria-label="Themen auf dieser Seite"
    v-show="sections.length > 0"
  >
    <strong>Auf dieser Seite</strong>
    <ol>
      <li v-for="section in sections" :key="section.id">
        <button type="button" @click="navigate(section.id)">{{ section.label }}</button>
      </li>
    </ol>
  </nav>
</template>
