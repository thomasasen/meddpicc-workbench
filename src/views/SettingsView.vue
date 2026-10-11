<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, FileText, Settings, ShieldCheck } from '@lucide/vue'

import { loadBrandProfile } from '../services/brandProfileStore'

const loading = ref(true)
const company = ref('')
const loadError = ref(false)

onMounted(async () => {
  try {
    const current = await loadBrandProfile()
    company.value = current.profile?.companyName ?? ''
  } catch {
    loadError.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="site-shell toolbox-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>
    <header class="site-header">
      <div class="container header-inner toolbox-header">
        <RouterLink class="brand" to="/" aria-label="MEDDPICC Toolbox Startseite">
          <span class="brand-mark">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Toolbox</strong>
            <span>Einstellungen</span>
          </span>
        </RouterLink>
        <RouterLink class="button button-quiet button-with-icon" to="/">
          <ArrowLeft :size="17" aria-hidden="true" />
          Zur Startseite
        </RouterLink>
      </div>
    </header>

    <main id="main-content" class="container settings-main">
      <header>
        <p class="eyebrow">Konfiguration</p>
        <h1>Einstellungen</h1>
        <p>
          Verwalte hier die zentralen Konfigurationen der Toolbox. Einstellungen gelten für dieses Browserprofil und
          sind unabhängig von einzelnen Kundenprojekten.
        </p>
      </header>

      <div class="settings-content">
        <section class="settings-panel" aria-labelledby="settings-document-title">
          <div class="settings-panel-heading">
            <FileText :size="22" aria-hidden="true" />
            <div>
              <h2 id="settings-document-title">Dokumente und Exporte</h2>
              <p>
                Firmenname, Logo, Farben und Zusatzangaben für kundenfähige PDFs, SVG- und PNG-Grafiken zentral
                festlegen.
              </p>
            </div>
          </div>
          <p v-if="loading" class="settings-status" role="status">Firmenprofil wird geprüft.</p>
          <p v-else-if="loadError" class="settings-status" role="alert">
            Der Status des Firmenprofils konnte nicht gelesen werden. Du kannst die Konfiguration trotzdem öffnen.
          </p>
          <p v-else class="settings-status" role="status">
            {{ company ? 'Aktives Firmenprofil: ' + company : 'Neutrale Dokumentgestaltung ist aktiv.' }}
          </p>
          <RouterLink class="button button-primary button-with-icon" to="/settings/document-design">
            <Settings :size="17" aria-hidden="true" />
            Dokumentgestaltung öffnen
            <ArrowRight :size="16" aria-hidden="true" />
          </RouterLink>
        </section>

        <section class="settings-panel" aria-labelledby="settings-storage-title">
          <div class="settings-panel-heading">
            <ShieldCheck :size="22" aria-hidden="true" />
            <div>
              <h2 id="settings-storage-title">Lokale Speicherung und Datensicherung</h2>
              <p>
                Die Dokumentgestaltung speichert dein Firmenprofil ausschließlich lokal im Browser. Im Bereich
                Dokumentgestaltung kannst du die Konfiguration als JSON exportieren, auf einem anderen Gerät importieren
                oder vollständig zurücksetzen. Ein Cloud-Konto ist dafür nicht notwendig.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
