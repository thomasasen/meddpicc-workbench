<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { RotateCcw, ShieldCheck, ShieldOff, Trash2 } from '@lucide/vue'

import type { ToolRecoveryController } from '../composables/useToolRecovery'

const props = defineProps<{ recovery: ToolRecoveryController }>()
const dialog = ref<HTMLDialogElement | null>(null)
const panel = ref<HTMLElement | null>(null)

function formattedDate(value: string): string {
  return new Date(value).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })
}

watch(
  () => props.recovery.pending,
  async (pending) => {
    await nextTick()
    if (pending && dialog.value && !dialog.value.open) {
      dialog.value.showModal()
    } else if (!pending) {
      if (dialog.value?.open) dialog.value.close()
      panel.value?.focus()
    }
  },
  { flush: 'post', immediate: true },
)
</script>

<template>
  <section ref="panel" class="recovery-panel" aria-label="Schutz vor Datenverlust" tabindex="-1">
    <div class="recovery-heading">
      <div class="recovery-caption">
        <ShieldCheck v-if="recovery.enabled" :size="19" aria-hidden="true" />
        <ShieldOff v-else :size="19" aria-hidden="true" />
        <div>
          <strong>Lokale Entwurfssicherung</strong>
          <p v-if="recovery.enabled" class="recovery-note">
            Aktiviert. Recovery ist keine gespeicherte Datei und keine Bestätigung von Kundenwerten.
          </p>
          <p v-else class="recovery-note">
            Standardmäßig aus. Ohne Einwilligung werden deine Tool-Eingaben nicht dauerhaft zwischengespeichert.
          </p>
        </div>
      </div>
      <div class="recovery-actions">
        <button
          v-if="!recovery.enabled"
          type="button"
          class="button button-secondary"
          :disabled="!recovery.ready || recovery.invalid || !!recovery.pending"
          @click="recovery.enable"
        >
          Lokale Sicherung aktivieren
        </button>
        <button v-else type="button" class="button button-quiet" :disabled="recovery.saving" @click="recovery.disable">
          <Trash2 :size="16" aria-hidden="true" />
          Sicherung deaktivieren und löschen
        </button>
      </div>
    </div>

    <p v-if="recovery.enabled" class="recovery-note" role="status">
      {{
        recovery.saving
          ? 'Entwurf wird lokal zwischengesichert …'
          : recovery.savedAt
            ? 'Zuletzt lokal zwischengesichert: ' + formattedDate(recovery.savedAt)
            : 'Noch kein Entwurf lokal zwischengesichert.'
      }}
    </p>
    <p v-if="recovery.enabled" class="recovery-note">
      Lokal im Browserprofil, bis zu sieben Tage, nicht verschlüsselt. Andere Nutzer dieses Browserprofils könnten
      Recoverydaten lesen.
    </p>

    <p v-if="recovery.error" class="recovery-error" role="alert">{{ recovery.error }}</p>
    <div v-if="recovery.invalid || recovery.conflict" class="recovery-actions">
      <button v-if="recovery.invalid" type="button" class="button button-secondary" @click="recovery.discard">
        Ungültige Recoverydaten löschen
      </button>
      <button v-else type="button" class="button button-secondary" @click="recovery.inspectConflict">
        <RotateCcw :size="16" aria-hidden="true" />
        Anderen Datenstand prüfen
      </button>
    </div>

    <dialog
      v-if="recovery.pending"
      ref="dialog"
      class="recovery-dialog"
      aria-labelledby="recovery-dialog-title"
      aria-describedby="recovery-dialog-description"
      @cancel.prevent
    >
      <div class="recovery-dialog-content">
        <h2 id="recovery-dialog-title">Lokalen Entwurf gefunden</h2>
        <p id="recovery-dialog-description">
          Ein Recovery-Stand vom {{ formattedDate(recovery.pending.savedAt) }} liegt in diesem Browserprofil. Er wurde
          nicht als Datei gespeichert. Die Werte sind nicht automatisch kundenseitig bestätigt.
        </p>
        <p v-if="recovery.pending.conflict" class="recovery-conflict">
          Achtung: Die aktuellen Eingaben unterscheiden sich vom Recovery-Stand. Wiederherstellen ersetzt den aktuellen
          Arbeitsstand vollständig.
        </p>
        <p v-else>Du kannst den Entwurf übernehmen oder die lokale Sicherung löschen.</p>
        <p v-if="recovery.error" class="recovery-error" role="alert">{{ recovery.error }}</p>
        <div class="recovery-dialog-actions">
          <button type="button" class="button button-secondary" @click="recovery.discard">Recovery verwerfen</button>
          <button type="button" class="button button-primary" @click="recovery.restore">
            Entwurf wiederherstellen
          </button>
        </div>
      </div>
    </dialog>
  </section>
</template>

<style scoped>
.recovery-panel {
  margin-block: 1rem 1.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-surface-muted);
  color: var(--color-text);
}
.recovery-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.8rem 1.2rem;
}
.recovery-caption {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  flex: 1 1 17rem;
}
.recovery-caption > svg {
  flex-shrink: 0;
  margin-top: 0.2rem;
}
.recovery-caption strong {
  font-size: 0.95rem;
}
.recovery-note {
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}
.recovery-actions,
.recovery-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}
.recovery-actions button,
.recovery-dialog-actions button {
  min-height: 44px;
  white-space: normal;
  text-align: center;
}
.recovery-error,
.recovery-conflict {
  margin-block: 0.75rem;
  color: var(--color-risk-text);
  overflow-wrap: anywhere;
}
.recovery-dialog {
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  width: min(32rem, calc(100vw - 2rem));
  max-height: min(85dvh, 40rem);
  margin: auto;
  overflow: auto;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 1.2rem 4rem rgb(0 0 0 / 0.2);
}
.recovery-dialog::backdrop {
  background: rgb(15 23 42 / 0.52);
}
.recovery-dialog-content {
  padding: clamp(1rem, 4vw, 1.5rem);
}
.recovery-dialog h2 {
  margin-top: 0;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
}
.recovery-dialog p {
  line-height: 1.55;
}
.recovery-dialog-actions {
  justify-content: flex-end;
  margin-top: 1.25rem;
}
@media (max-width: 375px) {
  .recovery-actions,
  .recovery-dialog-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
}
@media (prefers-reduced-motion: reduce) {
  .recovery-panel,
  .recovery-dialog {
    scroll-behavior: auto;
  }
}
@media (prefers-contrast: more) {
  .recovery-panel,
  .recovery-dialog {
    border-width: 2px;
  }
}
</style>
