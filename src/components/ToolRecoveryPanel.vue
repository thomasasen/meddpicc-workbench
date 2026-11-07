<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronDown, Clock3, FileClock, LoaderCircle, SaveCheck, SaveOff, TriangleAlert } from '@lucide/vue'
import type { ToolSaveState } from '../composables/useToolRecovery'
const props = defineProps<{
  enabled: boolean
  busy: boolean
  conflict: boolean
  candidate: { savedAt: string } | null
  message: string
  saveStatus: ToolSaveState
}>()

const expanded = ref(false)
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
// Bei einem Speicherfehler müssen die Warnung und die Löschoption sichtbar sein.
// Ein wiederherstellbarer Stand wird dagegen ohne automatischen Fokuswechsel angekündigt.
watch(
  () => props.conflict || props.saveStatus === 'error',
  (error) => {
    if (error) expanded.value = true
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
    class="recovery-panel"
    :class="{ 'recovery-panel--compact': compact, 'recovery-panel--open': expanded }"
    role="region"
    aria-labelledby="recovery-heading"
  >
    <h2 id="recovery-heading" class="recovery-summary-heading">
      <button
        type="button"
        class="recovery-toggle"
        data-testid="recovery-toggle"
        :aria-expanded="expanded"
        aria-controls="recovery-body"
        @click="expanded = !expanded"
      >
        <span class="recovery-toggle-title">Optionales lokales Recovery</span>
        <span class="recovery-toggle-status">
          <FileClock v-if="candidate" :size="17" aria-hidden="true" />
          <TriangleAlert v-else-if="conflict || saveStatus === 'error'" :size="17" aria-hidden="true" />
          <SaveCheck v-else-if="enabled" :size="17" aria-hidden="true" />
          <SaveOff v-else :size="17" aria-hidden="true" />
          <span v-if="candidate">
            Lokaler Arbeitsstand vom
            <strong>{{ new Date(candidate.savedAt).toLocaleString('de-DE') }}</strong>
          </span>
          <span v-else-if="conflict || saveStatus === 'error'">Speicherproblem · Details prüfen</span>
          <span v-else-if="enabled">Aktiv · {{ statusContent.text }}</span>
          <span v-else>Nicht aktiviert</span>
        </span>
        <ChevronDown class="recovery-toggle-chevron" :size="19" aria-hidden="true" />
      </button>
    </h2>

    <div v-show="expanded" id="recovery-body" class="recovery-expanded">
      <div class="recovery-layout">
        <div class="recovery-copy">
          <div v-if="candidate" class="recovery-snapshot">
            <TriangleAlert :size="19" aria-hidden="true" class="recovery-snapshot-icon" />
            <p class="recovery-snapshot-warning">
              Wiederherstellen ersetzt die aktuell sichtbaren Eingaben. Eine Zusammenführung findet nicht statt.
            </p>
          </div>
          <p v-else-if="compact" class="recovery-description">
            Optional: sieben Tage unverschlüsselt im Browser zwischenspeichern. Keine Cloud, keine Datei. Nicht für
            gemeinsam genutzte Geräte empfohlen.
          </p>
          <p v-else class="recovery-description">
            Die lokale Zwischensicherung ist optional und bleibt auf diesen Browser beschränkt. Sie ersetzt keine
            gespeicherte Datei oder Bestätigung von Kundenangaben.
          </p>

          <p v-if="candidate || !compact" class="recovery-privacy-summary">
            Unverschlüsselt im Browser · maximal sieben Tage · nicht für gemeinsam genutzte Geräte
          </p>
          <details class="recovery-details">
            <summary>
              Datenschutz- und Speicherhinweise
              <ChevronDown :size="15" aria-hidden="true" />
            </summary>
            <p>
              Die lokale Sicherung beginnt erst nach ausdrücklicher Aktivierung. Der Stand verfällt nach sieben Tagen
              und wird beim nächsten Zugriff entfernt. Die Daten sind nicht verschlüsselt, werden nicht in eine Cloud
              übertragen und sind keine gespeicherte Datei oder Bestätigung von Kundenangaben. Auf gemeinsam genutzten
              Geräten nicht empfohlen.
            </p>
          </details>
        </div>

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
      </div>

      <p v-if="message" class="recovery-status" :role="conflict || saveStatus === 'error' ? 'alert' : undefined">
        {{ message }}
      </p>
    </div>
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
  min-width: 0;
  margin-block: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--color-border, #dce3ee);
  border-radius: var(--radius-panel, 1rem);
  background: var(--color-surface, #fff);
  box-shadow: var(--apple-shadow-card, 0 4px 18px rgb(22 40 68 / 0.05));
}

.recovery-panel--compact {
  box-shadow: none;
}

.recovery-summary-heading {
  margin: 0;
  font-size: inherit;
  line-height: inherit;
}

.recovery-toggle {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr) 20px;
  align-items: center;
  column-gap: 1rem;
  width: 100%;
  min-height: 56px;
  padding: 0.65rem 1rem;
  border: 0;
  background: transparent;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
}

.recovery-toggle:hover {
  background: var(--color-surface-muted, #f6f8fb);
}

.recovery-toggle:focus-visible {
  outline: 3px solid var(--color-focus, #175cd3);
  outline-offset: -4px;
  border-radius: inherit;
}

.recovery-toggle-title {
  min-width: 0;
  font-size: 1rem;
  font-weight: 720;
  line-height: 1.4;
}

.recovery-toggle-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
  min-width: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 450;
  line-height: 1.45;
}

.recovery-toggle-status svg {
  flex: 0 0 auto;
  color: var(--color-accent-strong);
}

.recovery-toggle-status strong {
  color: var(--color-text);
  font-weight: 680;
  font-variant-numeric: tabular-nums;
}

.recovery-toggle-chevron {
  justify-self: end;
  transition: transform var(--apple-motion-gentle, 180ms ease);
}

.recovery-panel--open .recovery-toggle-chevron {
  transform: rotate(180deg);
}

.recovery-expanded {
  border-top: 1px solid var(--color-divider);
  padding: 0.85rem 1rem 1rem;
}

.recovery-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem 1.5rem;
}

.recovery-copy {
  display: grid;
  min-width: 0;
  gap: 0.45rem;
}

.recovery-description,
.recovery-snapshot-warning,
.recovery-privacy-summary,
.recovery-status {
  margin: 0;
  overflow-wrap: anywhere;
}

.recovery-description {
  max-width: 72ch;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

.recovery-snapshot {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  max-width: 76ch;
}

.recovery-snapshot-icon {
  flex: 0 0 auto;
  color: var(--color-accent-strong);
  margin-top: 0.15rem;
}

.recovery-snapshot-warning {
  color: var(--color-text);
  font-size: 0.875rem;
  line-height: 1.5;
}

.recovery-privacy-summary {
  max-width: 80ch;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.45;
}

.recovery-details {
  min-width: 0;
  max-width: 80ch;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.recovery-details summary {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 36px;
  width: fit-content;
  border-radius: var(--radius-control);
  padding: 0.2rem 0.35rem;
  color: var(--color-accent-strong);
  font-size: 0.875rem;
  font-weight: 620;
  cursor: pointer;
  list-style: none;
}

.recovery-details summary::-webkit-details-marker {
  display: none;
}

.recovery-details summary svg {
  flex: 0 0 auto;
  transition: transform var(--apple-motion-gentle, 180ms ease);
}

.recovery-details[open] summary svg {
  transform: rotate(180deg);
}

.recovery-details p {
  margin-block: 0.3rem 0.35rem;
  padding-inline: 0.35rem;
  line-height: 1.55;
}

.recovery-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  max-width: 24rem;
}

.recovery-actions > button {
  min-height: 44px;
  max-width: 100%;
  white-space: normal;
  text-align: center;
}

.recovery-status {
  max-width: 90ch;
  margin-top: 0.7rem;
  border-top: 1px solid var(--color-divider);
  padding-top: 0.7rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

.recovery-status[role='alert'] {
  color: var(--color-risk-text, #7a271a);
}

@media (max-width: 950px) {
  .recovery-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.7rem;
  }

  .recovery-actions {
    max-width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .recovery-toggle {
    grid-template-columns: minmax(0, 1fr) 20px;
    gap: 0.2rem 0.65rem;
    min-height: 62px;
    padding: 0.65rem 0.85rem;
  }

  .recovery-toggle-title {
    grid-column: 1;
    grid-row: 1;
  }

  .recovery-toggle-status {
    grid-column: 1;
    grid-row: 2;
    justify-content: flex-start;
  }

  .recovery-toggle-chevron {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}

@media (max-width: 480px) {
  .recovery-expanded {
    padding: 0.8rem;
  }

  .recovery-actions {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }

  .recovery-actions > button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .recovery-toggle-chevron,
  .recovery-details summary svg {
    transition: none;
  }
}
</style>
