<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Clock3, FileClock, LoaderCircle, SaveCheck, SaveOff, TriangleAlert } from '@lucide/vue'
import type { ToolSaveState } from '../composables/useToolRecovery'
const props = defineProps<{
  enabled: boolean
  busy: boolean
  conflict: boolean
  candidate: { savedAt: string } | null
  message: string
  saveStatus: ToolSaveState
}>()

const recoveryHeading = ref<HTMLElement | null>(null)

const statusContent = computed(() => {
  switch (props.saveStatus) {
    case 'checking':
      return { text: 'Prüfe Speicher', detail: 'Vorhandene lokale Recoverydaten werden geprüft.', icon: LoaderCircle }
    case 'available':
      return {
        text: 'Entwurf vorhanden',
        detail: 'Ein lokaler Stand ist vorhanden. Wiederherstellung erst nach Bestätigung.',
        icon: FileClock,
      }
    case 'unsaved':
      return {
        text: 'Nicht gesichert',
        detail: 'Recovery ist aus. Änderungen bleiben nur im aktuellen Tab.',
        icon: SaveOff,
      }
    case 'pending':
      return { text: 'Nicht gesichert', detail: 'Änderungen warten auf die lokale Sicherung.', icon: Clock3 }
    case 'saving':
      return { text: 'Sichert lokal', detail: 'Schreibvorgang im lokalen Browserspeicher läuft.', icon: LoaderCircle }
    case 'saved':
      return {
        text: 'Lokal gesichert',
        detail: 'Recovery-Snapshot im Browser geschrieben. Keine gespeicherte Datei.',
        icon: SaveCheck,
      }
    case 'error':
      return {
        text: 'Speicherproblem',
        detail: 'Aktuelle Änderungen sind nicht zuverlässig gesichert. Hinweise im Recovery-Bereich beachten.',
        icon: TriangleAlert,
      }
    default:
      return {
        text: 'Recovery aus',
        detail: 'Lokale Zwischensicherung ist für dieses Tool nicht aktiviert.',
        icon: SaveOff,
      }
  }
})
watch(
  () => props.candidate,
  async (value) => {
    if (!value) return
    await nextTick()
    if (document.activeElement === document.body) recoveryHeading.value?.focus()
  },
)

defineEmits<{
  activate: []
  recover: []
  discard: []
}>()
</script>

<template>
  <Teleport to=".site-header .header-inner">
    <span
      class="recovery-header-status"
      :data-state="saveStatus"
      data-testid="recovery-header-status"
      role="status"
      aria-live="polite"
      :title="statusContent.detail"
    >
      <component :is="statusContent.icon" :size="16" aria-hidden="true" />
      <span>{{ statusContent.text }}</span>
    </span>
  </Teleport>
  <section class="quick-panel recovery-panel" role="region" aria-labelledby="recovery-heading">
    <div class="recovery-heading">
      <h2 id="recovery-heading" ref="recoveryHeading" tabindex="-1">Optionales lokales Recovery</h2>
      <span v-if="enabled" class="recovery-label">Aktiv</span>
    </div>
    <p class="recovery-description">
      Nur nach Aktivierung werden Eingaben in diesem Browser zwischengespeichert. Der Stand verfällt nach sieben Tagen
      und wird beim nächsten Zugriff entfernt. Die Daten sind nicht verschlüsselt und keine gespeicherte Datei oder
      Bestätigung von Kundenangaben. Auf gemeinsam genutzten Geräten nicht empfohlen.
    </p>
    <p v-if="candidate" class="recovery-description">
      Lokaler Arbeitsstand vom <strong>{{ new Date(candidate.savedAt).toLocaleString('de-DE') }}</strong> vorhanden.
      Wiederherstellen ersetzt die aktuell sichtbaren Eingaben. Übertragene Tool-Daten werden nicht automatisch
      zusammengeführt.
    </p>
    <div class="recovery-actions">
      <template v-if="candidate">
        <button class="button button-primary" type="button" :disabled="busy || conflict" @click="$emit('recover')">
          Wiederherstellen
        </button>
        <button class="button button-secondary" type="button" :disabled="busy" @click="$emit('discard')">
          Verwerfen und löschen
        </button>
      </template>
      <template v-else>
        <button
          v-if="!enabled"
          class="button button-secondary"
          type="button"
          :disabled="busy || conflict"
          @click="$emit('activate')"
        >
          Lokales Recovery aktivieren
        </button>
        <button
          v-if="enabled || message"
          class="button button-quiet"
          type="button"
          :disabled="busy"
          @click="$emit('discard')"
        >
          Recoverydaten löschen und deaktivieren
        </button>
      </template>
    </div>
    <p v-if="message" class="recovery-status" :role="conflict ? 'alert' : 'status'" aria-live="polite">
      {{ message }}
    </p>
  </section>
</template>

<style scoped>
.recovery-header-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  flex: 0 0 auto;
  margin-inline-start: auto;
  padding: 0.36rem 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: var(--color-surface, #fff);
  color: #475569;
  font-size: 0.76rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}
.recovery-header-status[data-state='saved'] {
  color: #28664d;
  border-color: #a2cdb9;
}
.recovery-header-status[data-state='error'],
.recovery-header-status[data-state='unsaved'] {
  color: #97402c;
  border-color: #d9ab9d;
}
.recovery-header-status[data-state='saving'] svg,
.recovery-header-status[data-state='checking'] svg {
  animation: recovery-header-rotate 1.4s linear infinite;
}
@keyframes recovery-header-rotate {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .recovery-header-status svg {
    animation: none !important;
  }
}
@media (prefers-contrast: more) {
  .recovery-header-status {
    border-color: currentColor;
  }
}
@media (forced-colors: active) {
  .recovery-header-status {
    border-color: CanvasText;
    color: CanvasText;
  }
}
.recovery-panel {
  margin-block: 1.25rem;
  min-width: 0;
}
.recovery-heading,
.recovery-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
.recovery-heading {
  justify-content: space-between;
}
.recovery-heading h2 {
  margin: 0;
  font-size: 1.1rem;
}
.recovery-label {
  border-radius: 999px;
  border: 1px solid currentColor;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
}
.recovery-description,
.recovery-status {
  margin-block: 0.75rem;
  overflow-wrap: anywhere;
}
.recovery-actions > button {
  min-height: 2.75rem;
  max-width: 100%;
  white-space: normal;
}
@media (max-width: 375px) {
  .recovery-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
