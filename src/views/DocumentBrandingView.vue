<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { ArrowLeft, Download, Eye, ImagePlus, RotateCcw, Save, Upload } from '@lucide/vue'
import { createCrmSaasDemo } from '../data/softwarePaybackDemo'
import {
  BRAND_SCHEMA_VERSION,
  DEFAULT_BRAND_COLORS,
  contrastRatio,
  parseBrandProfileJson,
  validateBrandProfile,
  type BrandProfile,
} from '../report/brandProfile'
import { buildCustomerBusinessCasePdf } from '../report/customerBusinessCasePdf'
import { buildSoftwareBusinessCasePdf } from '../report/softwareBusinessCasePdf'
import { normalizeBrandLogo } from '../services/brandLogo'
import { loadBrandProfile, saveBrandProfile } from '../services/brandProfileStore'

const blank = (): BrandProfile => ({
  version: BRAND_SCHEMA_VERSION,
  companyName: '',
  ...DEFAULT_BRAND_COLORS,
})
const draft = ref<BrandProfile>(blank())
const saved = ref<BrandProfile | null>(null)
const revision = ref(0)
const loading = ref(true)
const working = ref(false)
const status = ref('')
const error = ref('')
const previewUrl = ref('')
const previewKind = ref<'customer' | 'finance'>('customer')
const fileInput = ref<HTMLInputElement | null>(null)
const importInput = ref<HTMLInputElement | null>(null)

const dirty = computed(() => JSON.stringify(draft.value) !== JSON.stringify(saved.value ?? blank()))
const logoUrl = computed(() =>
  draft.value.logo ? 'data:' + draft.value.logo.mimeType + ';base64,' + draft.value.logo.base64 : '',
)
const primaryColorInput = computed(() =>
  /^#[0-9a-f]{6}$/i.test(draft.value.primaryColor) ? draft.value.primaryColor : DEFAULT_BRAND_COLORS.primaryColor,
)
const accentColorInput = computed(() =>
  /^#[0-9a-f]{6}$/i.test(draft.value.accentColor) ? draft.value.accentColor : DEFAULT_BRAND_COLORS.accentColor,
)
const primaryContrast = computed(() =>
  /^#[0-9a-f]{6}$/i.test(draft.value.primaryColor)
    ? Math.max(contrastRatio(draft.value.primaryColor, '#FFFFFF'), contrastRatio(draft.value.primaryColor, '#172033'))
    : 0,
)
const textContrast = computed(() =>
  draft.value.textColor && /^#[0-9a-f]{6}$/i.test(draft.value.textColor)
    ? contrastRatio(draft.value.textColor, '#FFFFFF')
    : 0,
)
const accentContrast = computed(() =>
  /^#[0-9a-f]{6}$/i.test(draft.value.accentColor) ? contrastRatio(draft.value.accentColor, '#FFFFFF') : 0,
)

function notifyError(err: unknown): void {
  error.value = err instanceof Error ? err.message : 'Unbekannter Fehler.'
  status.value = ''
}
function releasePreview(): void {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}
function beforeUnload(event: BeforeUnloadEvent): void {
  if (!dirty.value) return
  event.preventDefault()
  event.returnValue = ''
}
onBeforeRouteLeave(() => !dirty.value || window.confirm('Ungespeicherte Änderungen verwerfen?'))
onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnload)
  try {
    const record = await loadBrandProfile()
    revision.value = record.revision
    saved.value = record.profile
    draft.value = record.profile ? structuredClone(record.profile) : blank()
    status.value = record.profile ? 'CI-Profil aus diesem Browser geladen.' : 'Neutrale Dokumentgestaltung ist aktiv.'
  } catch (err) {
    notifyError(err)
    error.value += ' Änderungen können in dieser Sitzung bearbeitet werden, sind aber nicht dauerhaft gespeichert.'
  } finally {
    loading.value = false
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnload)
  releasePreview()
})

async function save(): Promise<void> {
  working.value = true
  error.value = ''
  try {
    const valid = validateBrandProfile(draft.value)
    const newRevision = await saveBrandProfile(valid, revision.value)
    revision.value = newRevision
    saved.value = valid
    draft.value = structuredClone(valid)
    status.value = 'CI-Profil dauerhaft in diesem Browser gespeichert.'
  } catch (err) {
    notifyError(err)
  } finally {
    working.value = false
  }
}
function discard(): void {
  if (dirty.value && !window.confirm('Ungespeicherte Änderungen wirklich verwerfen?')) return
  draft.value = saved.value ? structuredClone(saved.value) : blank()
  error.value = ''
  status.value = 'Nicht gespeicherte Änderungen verworfen.'
}
async function reset(): Promise<void> {
  if (!window.confirm('CI-Profil einschließlich Logo aus diesem Browser entfernen?')) return
  working.value = true
  error.value = ''
  try {
    revision.value = await saveBrandProfile(null, revision.value)
    saved.value = null
    draft.value = blank()
    releasePreview()
    status.value = 'CI-Profil entfernt. Künftige Kunden-PDFs sind neutral.'
  } catch (err) {
    notifyError(err)
  } finally {
    working.value = false
  }
}

async function uploadLogo(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  error.value = ''
  try {
    const valid = await normalizeBrandLogo(file)
    draft.value = { ...draft.value, logo: valid }
    status.value = 'Logo geprüft und vorgemerkt. Zum dauerhaften Speichern bitte „Speichern“ wählen.'
  } catch (err) {
    notifyError(err)
  }
}
function removeLogo(): void {
  const next = { ...draft.value }
  delete next.logo
  draft.value = next
  status.value = 'Logo entfernt. Bitte Änderung speichern.'
}
function exportProfile(): void {
  error.value = ''
  try {
    const valid = validateBrandProfile(draft.value)
    const blob = new Blob([JSON.stringify(valid, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'company-branding.json'
    anchor.click()
    URL.revokeObjectURL(url)
    status.value = 'CI-Profil exportiert. Enthält Firmenangaben und Logo, keine Kundendaten.'
  } catch (err) {
    notifyError(err)
  }
}
async function importProfile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  error.value = ''
  working.value = true
  try {
    if (file.size > 3 * 1024 * 1024) throw new Error('Importdatei ist größer als 3 MB.')
    let valid = parseBrandProfileJson(await file.text())
    if (valid.logo) {
      // Auch importierte JPEGs und PNGs durch denselben Browserdecoder normalisieren.
      const data = Uint8Array.from(atob(valid.logo.base64), (char) => char.charCodeAt(0))
      const fileLogo = new File([data], 'importiertes-logo', { type: valid.logo.mimeType })
      valid = { ...valid, logo: await normalizeBrandLogo(fileLogo) }
    }
    if (!window.confirm('Vorhandenes CI-Profil durch die geprüfte Importdatei ersetzen?')) return
    const newRevision = await saveBrandProfile(valid, revision.value)
    revision.value = newRevision
    saved.value = valid
    draft.value = structuredClone(valid)
    releasePreview()
    status.value = 'CI-Profil vollständig geprüft und dauerhaft importiert.'
  } catch (err) {
    notifyError(err)
  } finally {
    working.value = false
  }
}

async function showPreview(): Promise<void> {
  working.value = true
  error.value = ''
  try {
    const brand = draft.value.companyName.trim() ? validateBrandProfile(draft.value) : null
    if (!brand && dirty.value && (draft.value.logo || draft.value.companyName.trim())) {
      throw new Error('Bitte zuerst gültige Firmenangaben ergänzen.')
    }
    const demo = {
      customer: 'Beispielkunde Industrie GmbH (fiktiv)',
      project: 'Beispielprojekt CRM-Modernisierung',
      preparedBy: brand?.defaultAuthor || 'Musterberatung',
      date: '11.10.2026',
      businessPain: 'Fiktiv: Zeitverluste durch manuelle Bearbeitung und doppelte Datenerfassung.',
      targetOutcome: 'Fiktiv: Weniger Bearbeitungszeit und transparenter Wirtschaftlichkeitsnachweis.',
      input: createCrmSaasDemo(),
    }
    const bytes =
      previewKind.value === 'customer'
        ? await buildCustomerBusinessCasePdf(demo, { brand })
        : await buildSoftwareBusinessCasePdf(demo, { brand })
    const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }))
    releasePreview()
    previewUrl.value = url
    status.value = 'Echtes Beispiel-PDF erzeugt. Alle Zahlen und Kundenangaben sind fiktiv.'
  } catch (err) {
    notifyError(err)
  } finally {
    working.value = false
  }
}
function downloadPreview(): void {
  if (!previewUrl.value) return
  const anchor = document.createElement('a')
  anchor.href = previewUrl.value
  anchor.download = 'ci-vorschau-' + previewKind.value + '.pdf'
  anchor.click()
}
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="MEDDPICC Toolbox Startseite">
          <span class="brand-mark">M</span>
          <span class="brand-copy"><strong>MEDDPICC Toolbox</strong><span>Dokumentgestaltung</span></span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/">
          <ArrowLeft :size="17" aria-hidden="true" /> Alle Microtools
        </RouterLink>
      </div>
    </header>
    <main id="main-content" class="container branding-settings">
      <header class="branding-intro">
        <p class="eyebrow">Einstellungen</p>
        <h1>Dokumentgestaltung</h1>
        <p>
          Ein Firmenprofil für kundenfähige und interne PDFs. Die Einstellungen bleiben ausschließlich in diesem
          Browserprofil; es findet kein Upload statt.
        </p>
      </header>
      <p v-if="loading" role="status">Gespeicherte Einstellungen werden geladen.</p>
      <div v-else class="branding-sections">
        <section class="branding-panel" aria-labelledby="identity-title">
          <h2 id="identity-title">Firmenidentität</h2>
          <div class="branding-fields">
            <label
              >Firmenname
              <input
                v-model="draft.companyName"
                autocomplete="organization"
                maxlength="160"
                placeholder="Beispiel GmbH"
            /></label>
            <label
              >Website (optional)
              <input v-model="draft.website" type="url" maxlength="200" placeholder="https://beispiel.de"
            /></label>
            <label
              >Kontaktinformationen (optional)
              <input v-model="draft.contact" maxlength="240" placeholder="E-Mail oder Kontakt"
            /></label>
            <label
              >Standardverfasser (optional)
              <input v-model="draft.defaultAuthor" maxlength="120" placeholder="Name oder Abteilung"
            /></label>
            <label
              >Zusätzliche Fußzeile (optional)
              <input v-model="draft.footerNote" maxlength="240" placeholder="Vertraulichkeitsvermerk"
            /></label>
          </div>
          <div class="branding-logo">
            <div v-if="logoUrl" class="branding-logo-preview">
              <img :src="logoUrl" alt="Aktuell ausgewähltes Firmenlogo" />
            </div>
            <p v-else>Kein Firmenlogo hinterlegt.</p>
            <input
              ref="fileInput"
              class="branding-hidden-input"
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              aria-label="PNG- oder JPEG-Firmenlogo wählen"
              @change="uploadLogo"
            />
            <button type="button" class="button button-with-icon" :disabled="working" @click="fileInput?.click()">
              <ImagePlus :size="17" aria-hidden="true" /> {{ logoUrl ? 'Logo ersetzen' : 'Logo hochladen' }}
            </button>
            <button v-if="logoUrl" type="button" class="button button-quiet" :disabled="working" @click="removeLogo">
              Logo entfernen
            </button>
            <p class="branding-hint">
              PNG oder JPEG, maximal 2 MB, höchstens 4096 Pixel pro Seite. Bilder werden lokal neu als PNG gespeichert;
              EXIF-Daten werden entfernt.
            </p>
          </div>
        </section>
        <section class="branding-panel" aria-labelledby="design-title">
          <h2 id="design-title">Gestaltung</h2>
          <div class="branding-fields">
            <div class="branding-color-row">
              <label
                >Primärfarbe (Hex)
                <input v-model="draft.primaryColor" spellcheck="false" maxlength="7" placeholder="#172B49"
              /></label>
              <label class="branding-picker-label"
                >Farbauswahl
                <input
                  v-model="draft.primaryColor"
                  type="color"
                  :value="primaryColorInput"
                  aria-label="Primärfarbe auswählen"
              /></label>
            </div>
            <p v-if="primaryContrast < 4.5" class="branding-warning" role="status">
              Bitte eine gültige Hex-Farbe eingeben. Auf dunklem oder hellem Hintergrund wird die Textfarbe automatisch
              kontrastreich gewählt.
            </p>
            <div class="branding-color-row">
              <label
                >Akzentfarbe (Hex)
                <input v-model="draft.accentColor" spellcheck="false" maxlength="7" placeholder="#2764A8"
              /></label>
              <label class="branding-picker-label"
                >Farbauswahl
                <input
                  v-model="draft.accentColor"
                  type="color"
                  :value="accentColorInput"
                  aria-label="Akzentfarbe auswählen"
              /></label>
            </div>
            <p v-if="accentContrast < 4.5" class="branding-warning" role="status">
              Akzentfarbe bietet auf Weiß zu wenig Kontrast für kleine Texte. Sie wird nur dekorativ eingesetzt;
              fachliche Statusfarben bleiben unverändert.
            </p>
            <label
              >Optionale Textfarbe (Hex)
              <input v-model="draft.textColor" spellcheck="false" maxlength="7" placeholder="#172033"
            /></label>
            <p v-if="draft.textColor && textContrast < 4.5" class="branding-warning" role="status">
              Die Textfarbe ist auf Weiß zu kontrastarm. Die PDF-Fußzeile erhält automatisch eine gut lesbare Ersatzfarbe.
            </p>
          </div>
          <p class="branding-hint">
            Hell/Dunkel-Kontrast wird im PDF automatisch berücksichtigt. Warn- und Risikofarben werden nicht umgefärbt.
          </p>
        </section>
        <section class="branding-panel" aria-labelledby="preview-title">
          <h2 id="preview-title">Echte PDF-Vorschau</h2>
          <p>
            Nur fiktive Kundendaten und Beispielzahlen. Die Vorschau nutzt dieselben Generatoren wie der PDF-Download
            und zeigt auch noch nicht gespeicherte Änderungen.
          </p>
          <div class="branding-actions">
            <label
              >Dokumentart
              <select v-model="previewKind" @change="releasePreview">
                <option value="customer">Beispiel-Kundenbericht</option>
                <option value="finance">Beispiel-Finance-Anhang (intern)</option>
              </select>
            </label>
            <button type="button" class="button button-with-icon" :disabled="working" @click="showPreview">
              <Eye :size="17" aria-hidden="true" /> PDF-Vorschau erzeugen
            </button>
            <button type="button" class="button button-with-icon" :disabled="!previewUrl" @click="downloadPreview">
              <Download :size="17" aria-hidden="true" /> Vorschau herunterladen
            </button>
          </div>
          <iframe v-if="previewUrl" class="branding-pdf-frame" :src="previewUrl" title="Fiktive PDF-Vorschau" />
        </section>
        <section class="branding-panel" aria-labelledby="manage-title">
          <h2 id="manage-title">Verwaltung und Speicherung</h2>
          <p>
            Das Profil ist nicht Bestandteil von .meddpicc-Projekten. Browserdaten können gelöscht werden. Für ein
            anderes Gerät das Profil als JSON exportieren und dort importieren.
          </p>
          <div class="branding-actions">
            <button
              type="button"
              class="button button-primary button-with-icon"
              :disabled="working || !dirty"
              @click="save"
            >
              <Save :size="17" aria-hidden="true" /> Änderungen speichern
            </button>
            <button type="button" class="button" :disabled="working || !dirty" @click="discard">
              Änderungen verwerfen
            </button>
            <button type="button" class="button button-with-icon" :disabled="working" @click="exportProfile">
              <Download :size="17" aria-hidden="true" /> CI-Profil exportieren
            </button>
            <input
              ref="importInput"
              class="branding-hidden-input"
              type="file"
              accept=".json,application/json"
              aria-label="CI-Profil-JSON auswählen"
              @change="importProfile"
            />
            <button type="button" class="button button-with-icon" :disabled="working" @click="importInput?.click()">
              <Upload :size="17" aria-hidden="true" /> CI-Profil importieren
            </button>
            <button type="button" class="button button-quiet button-with-icon" :disabled="working" @click="reset">
              <RotateCcw :size="17" aria-hidden="true" /> Auf neutrales Profil zurücksetzen
            </button>
          </div>
          <p v-if="dirty" class="branding-warning" role="status">
            Nicht gespeicherte Änderungen: Neue PDF-Exporte aus anderen Tools verwenden weiterhin das zuletzt
            gespeicherte Profil.
          </p>
          <p v-if="status" class="branding-status" role="status">{{ status }}</p>
          <p v-if="error" class="branding-error" role="alert">{{ error }}</p>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.branding-settings {
  padding-block: 2rem 4rem;
}
.branding-intro {
  max-width: 760px;
  margin-bottom: 1.5rem;
}
.branding-intro h1 {
  margin-block: 0.2rem 0.75rem;
}
.branding-sections {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
  max-width: 960px;
}
.branding-panel {
  min-width: 0;
  padding: clamp(1rem, 2.5vw, 1.75rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
}
.branding-panel h2 {
  margin-top: 0;
}
.branding-fields {
  display: grid;
  gap: 0.9rem;
  max-width: 580px;
}
.branding-fields label,
.branding-actions label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-weight: 600;
}
.branding-fields input,
.branding-actions select {
  min-width: 0;
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-control);
  background: white;
  color: var(--color-text);
}
.branding-fields input:focus-visible,
.branding-actions select:focus-visible,
button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
.branding-color-row {
  display: flex;
  gap: 0.8rem;
  align-items: end;
  flex-wrap: wrap;
}
.branding-color-row > label:first-child {
  width: min(100%, 340px);
}
.branding-picker-label input {
  max-width: 90px;
  min-height: 44px;
}
.branding-logo {
  margin-top: 1.25rem;
}
.branding-logo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  max-width: 320px;
  margin-block: 0.8rem;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  background: white;
}
.branding-logo-preview img {
  display: block;
  max-width: 100%;
  max-height: 90px;
  object-fit: contain;
}
.branding-hidden-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
}
.branding-actions {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-block: 1rem;
}
.branding-hint {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  max-width: 690px;
}
.branding-warning {
  color: #8b4300;
  font-size: 0.9rem;
}
.branding-status {
  color: #15603b;
}
.branding-error {
  color: #ab1f25;
  font-weight: 600;
}
.branding-pdf-frame {
  width: 100%;
  min-height: 540px;
  border: 1px solid var(--color-border);
}
@media (max-width: 600px) {
  .branding-actions > button {
    width: 100%;
    justify-content: center;
  }
  .branding-pdf-frame {
    min-height: 420px;
  }
}
</style>
