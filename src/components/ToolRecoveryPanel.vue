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
const compact = computed(() => !props.enabled && !props.candidate && !props.conflict && !props.message)
const statusAnnouncement = ref('')
let lastSavedAnnouncement = 0

// Technische Übergänge (checking/pending/saving) bleiben sichtbar, aber stumm.
// Eine erfolgreiche Sicherung wird höchstens alle 30 Sekunden angesagt.
watch(
  () => props.saveStatus,
  (state) => {
    if (state === 'available') {
      statusAnnouncement.value = 'Ein lokaler Entwurf ist vorhanden. Wiederherstellung nach Bestätigung möglich.'
    } else if (state === 'saved' && Date.now() - lastSavedAnnouncement > 30_000) {
      statusAnnouncement.value = 'Recoverystand ist lokal im Browser gesichert. Es wurde keine Datei gespeichert.'
      lastSavedAnnouncement = Date.now()
    } else if (state === 'error' && !props.message) {
      statusAnnouncement.value = 'Fehler bei der lokalen Recovery-Sicherung.'
    } else {
      statusAnnouncement.value = ''
    }
  },
)

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
        text: 'Nur in diesem Tab',
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
  <Teleport defer to=".site-header .header-inner">
    <span
      class="recovery-header-status"
      role="status"
      aria-live="off"
      aria-atomic="true"
      :data-state="saveStatus"
      data-testid="recovery-header-status"
      :title="statusContent.detail"
    >
      <component :is="statusContent.icon" :size="16" aria-hidden="true" />
      <span>{{ statusContent.text }}</span>
    </span>
  </Teleport>
  <span class="sr-only" role="status" aria-live="polite" aria-atomic="true" data-testid="recovery-announcement">
    {{ statusAnnouncement }}
  </span>
  <section
    class="quick-panel recovery-panel"
    :class="{ 'recovery-panel--compact': compact }"
    role="region"
    aria-labelledby="recovery-heading"
  >
    <div class="recovery-heading">
      <h2 id="recovery-heading" ref="recoveryHeading" tabindex="-1">Optionales lokales Recovery</h2>
      <span v-if="enabled" class="recovery-label">Aktiv</span>
    </div>
    <template v-if="compact">
      <p class="recovery-description recovery-description--short">
        Optional: sieben Tage unverschlüsselt in diesem Browser zwischenspeichern. Keine Cloud, keine Datei. Nicht für
        gemeinsam genutzte Geräte empfohlen.
      </p>
      <details class="recovery-details">
        <summary>Datenschutz- und Speicherhinweise</summary>
        <p>
          Die lokale Sicherung beginnt erst nach ausdrücklicher Aktivierung. Der Stand verfällt nach sieben Tagen und
          wird beim nächsten Zugriff entfernt. Die Daten sind nicht verschlüsselt, werden nicht in eine Cloud übertragen
          und sind weder eine gespeicherte Datei noch eine Bestätigung von Kundenangaben. Auf gemeinsam genutzten
          Geräten nicht empfohlen.
        </p>
      </details>
    </template>
    <p v-else class="recovery-description">
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
    <p v-if="message" class="recovery-status" :role="conflict || saveStatus === 'error' ? 'alert' : undefined">
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
  justify-content: center;
  min-inline-size: 10.75rem;
  min-block-size: 2rem;
  margin-inline-start: auto;
  padding: 0.36rem 0.6rem;
  border: 1px solid var(--color-border, #cbd5e1);
  border-radius: 999px;
  background: var(--color-surface, #fff);
  color: var(--color-text-muted, #475569);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}
.recovery-header-status > svg {
  flex-shrink: 0;
}
.recovery-header-status[data-state='saved'] {
  color: #28664d;
  border-color: #a2cdb9;
}
.recovery-header-status[data-state='error'] {
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
.recovery-panel--compact {
  margin-block: 0.7rem;
  padding: 0.85rem 1rem;
  box-shadow: none;
}
.recovery-panel--compact .recovery-heading h2 {
  font-size: 0.95rem;
}
.recovery-description--short {
  margin-block: 0.3rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.45;
}
.recovery-details {
  color: var(--color-text-muted, #475569);
  font-size: 0.875rem;
}
.recovery-details summary {
  cursor: pointer;
  width: fit-content;
  min-height: 2rem;
}
.recovery-details p {
  max-width: 75ch;
  margin-block: 0.5rem;
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
