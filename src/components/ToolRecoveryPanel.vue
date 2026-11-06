<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
const props = defineProps<{
  enabled: boolean
  busy: boolean
  conflict: boolean
  candidate: { savedAt: string } | null
  message: string
}>()

const recoveryHeading = ref<HTMLElement | null>(null)
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
