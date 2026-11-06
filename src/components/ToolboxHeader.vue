<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, FileText, ListChecks, Wrench } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'

withDefaults(
  defineProps<{
    area: string
    backTo?: string
    backLabel?: string
    documentDesign?: boolean
  }>(),
  {
    backTo: '/',
    backLabel: 'Zur Übersicht',
    documentDesign: false,
  },
)

const route = useRoute()
const currentSection = computed(() => {
  if (route.path.startsWith('/tools/')) return 'tools'
  if (route.path.startsWith('/checklists/')) return 'checklists'
  if (route.path.startsWith('/knowledge/')) return 'knowledge'
  return ''
})
</script>

<template>
  <header class="site-header" data-testid="toolbox-header">
    <!-- Der Teleport des Recovery-Status benötigt genau diesen Zielcontainer. -->
    <div class="container header-inner toolbox-header">
      <RouterLink class="brand" to="/" aria-label="MEDDPICC Toolbox Startseite">
        <span class="brand-mark" aria-hidden="true">M</span>
        <span class="brand-copy">
          <strong>MEDDPICC Toolbox</strong>
          <span>{{ area }}</span>
        </span>
      </RouterLink>

      <nav class="toolbox-secondary-nav" aria-label="Toolbox-Bereiche">
        <RouterLink
          :to="{ name: 'start', hash: '#tools' }"
          :aria-current="currentSection === 'tools' ? 'page' : undefined"
        >
          <Wrench :size="16" aria-hidden="true" />Tools
        </RouterLink>
        <RouterLink
          :to="{ name: 'start', hash: '#checklists' }"
          :aria-current="currentSection === 'checklists' ? 'page' : undefined"
        >
          <ListChecks :size="16" aria-hidden="true" />Checklists
        </RouterLink>
        <RouterLink
          :to="{ name: 'start', hash: '#knowledge' }"
          :aria-current="currentSection === 'knowledge' ? 'page' : undefined"
        >
          <FileText :size="16" aria-hidden="true" />Wissen
        </RouterLink>
      </nav>

      <RouterLink v-if="documentDesign" class="button button-quiet" to="/settings/document-design">
        Dokumentgestaltung
      </RouterLink>
      <RouterLink class="button button-quiet button-with-icon" :to="backTo">
        <ArrowLeft :size="17" aria-hidden="true" />
        {{ backLabel }}
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.toolbox-secondary-nav {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  margin-inline-start: auto;
}
.toolbox-secondary-nav a {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding-inline: 0.7rem;
  border-radius: var(--radius-control);
  font-size: 0.875rem;
  font-weight: 650;
  text-decoration: none;
  color: var(--color-text-muted);
}
.toolbox-secondary-nav a:hover,
.toolbox-secondary-nav a[aria-current='page'] {
  color: var(--color-accent-strong);
  background: var(--color-accent-soft);
}
@media (max-width: 1100px) {
  .toolbox-secondary-nav {
    display: none;
  }
}
</style>
