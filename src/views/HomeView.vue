<script setup lang="ts">
import {
  qualificationStatusLabels,
  type QualificationStatusKey,
} from '../domain/qualificationStatus'

type SnapshotItem = {
  label: string
  status: QualificationStatusKey
  confidence: number
}

const snapshot: SnapshotItem[] = [
  { label: 'Metrics', status: 'confirmed', confidence: 7 },
  { label: 'Economic Buyer', status: 'partial', confidence: 5 },
  { label: 'Decision Criteria', status: 'confirmed', confidence: 8 },
  { label: 'Decision Process', status: 'partial', confidence: 6 },
  { label: 'Paper Process', status: 'risk', confidence: 3 },
  { label: 'Pain', status: 'confirmed', confidence: 7 },
  { label: 'Champion', status: 'partial', confidence: 6 },
  { label: 'Competition', status: 'unknown', confidence: 2 },
]
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="#main-content" aria-label="MEDDPICC Workbench Startseite">
          <span class="brand-mark" aria-hidden="true">M</span>
          <span class="brand-copy">
            <strong>MEDDPICC Workbench</strong>
            <span>Local-first Deal Qualification</span>
          </span>
        </a>

        <div class="header-actions">
          <span class="release-badge">Pre-Alpha</span>
          <a
            class="icon-link"
            href="https://github.com/thomasasen/meddpicc-workbench"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>

    <main id="main-content">
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">Komplexe Deals. Belastbar qualifiziert.</p>
            <h1>MEDDPICC als Arbeitsumgebung – nicht als Checkliste.</h1>
            <p class="hero-text">
              Die Workbench bündelt Qualifizierung, Evidenz, Risiken, nächste Aktionen
              und Deal Planning in einer portablen <code>.meddpicc</code>-Projektdatei.
              Die Daten bleiben dabei lokal im Browser.
            </p>

            <div class="hero-actions">
              <button class="button button-primary" type="button" disabled>
                Projekt öffnen
              </button>
              <a class="button button-secondary" href="#arbeitsweise">
                Arbeitsweise ansehen
              </a>
            </div>

            <p class="availability-note">
              Das Öffnen und Speichern von Projektdateien folgt mit Roadmap&nbsp;1.
            </p>

            <ul class="trust-list" aria-label="Technische Grundprinzipien">
              <li>
                <span class="trust-icon" aria-hidden="true"></span>
                Kein Backend erforderlich
              </li>
              <li>
                <span class="trust-icon" aria-hidden="true"></span>
                Keine AI zur Runtime
              </li>
              <li>
                <span class="trust-icon" aria-hidden="true"></span>
                Kundendaten bleiben lokal
              </li>
            </ul>
          </div>

          <aside class="snapshot-card" aria-labelledby="snapshot-title">
            <div class="snapshot-head">
              <div>
                <p class="snapshot-kicker">Opportunity Snapshot</p>
                <h2 id="snapshot-title">ACME CRM Transformation</h2>
              </div>
              <span class="snapshot-value">€ 480k</span>
            </div>

            <dl class="snapshot-meta">
              <div>
                <dt>Forecast</dt>
                <dd>Best Case</dd>
              </div>
              <div>
                <dt>Target Close</dt>
                <dd>31.03.2027</dd>
              </div>
              <div>
                <dt>Target Go-Live</dt>
                <dd>01.07.2027</dd>
              </div>
            </dl>

            <div class="snapshot-divider"></div>

            <div class="status-list" aria-label="Beispielhafter MEDDPICC-Status">
              <div v-for="item in snapshot" :key="item.label" class="status-row">
                <span class="status-label">{{ item.label }}</span>
                <span class="status-summary">
                  <span
                    class="status-dot"
                    :class="`status-dot--${item.status}`"
                    aria-hidden="true"
                  ></span>
                  <span>{{ qualificationStatusLabels[item.status] }}</span>
                  <span class="confidence">{{ item.confidence }}/10</span>
                </span>
              </div>
            </div>

            <div class="snapshot-alert">
              <span class="alert-mark" aria-hidden="true"></span>
              <div>
                <strong>Kritisches Gap</strong>
                <p>Paper Process ist noch nicht belastbar bestätigt.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="section section-muted" aria-labelledby="nutzen-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Fleißarbeit reduzieren</p>
            <h2 id="nutzen-title">Was die Workbench übernehmen soll</h2>
            <p>
              Die Anwendung denkt nicht für den Seller. Sie strukturiert Daten,
              berechnet wiederholbare Ergebnisse und macht fehlende Evidenz sichtbar.
            </p>
          </div>

          <div class="feature-grid">
            <article class="feature-card">
              <span class="feature-number" aria-hidden="true">01</span>
              <h3>Evidenz statt Bauchgefühl</h3>
              <p>
                Aussagen werden mit Quelle, Datum und Evidenztyp verknüpft. Annahmen,
                unbekannte Informationen und bestätigte Fakten bleiben klar getrennt.
              </p>
            </article>

            <article class="feature-card">
              <span class="feature-number" aria-hidden="true">02</span>
              <h3>Prozesse planbar machen</h3>
              <p>
                Decision Process, Paper Process und Go-Live werden als zusammenhängende
                Abhängigkeiten modelliert – inklusive Ownern, Terminen und Risiken.
              </p>
            </article>

            <article class="feature-card">
              <span class="feature-number" aria-hidden="true">03</span>
              <h3>Value reproduzierbar rechnen</h3>
              <p>
                Metrics, ROI, Payback und Cost of Delay werden aus nachvollziehbaren
                Inputs deterministisch berechnet statt in separaten Sheets gepflegt.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="arbeitsweise" class="section" aria-labelledby="arbeitsweise-title">
        <div class="container">
          <div class="section-heading section-heading--compact">
            <p class="eyebrow">Ein Projekt, ein Datenmodell</p>
            <h2 id="arbeitsweise-title">Die geplante Arbeitsweise</h2>
          </div>

          <ol class="workflow-list">
            <li>
              <span class="workflow-step">1</span>
              <div>
                <h3>Projektdatei öffnen</h3>
                <p>
                  Eine portable <code>.meddpicc</code>-Datei enthält den vollständigen
                  Stand einer Opportunity und kann z. B. im CRM abgelegt werden.
                </p>
              </div>
            </li>
            <li>
              <span class="workflow-step">2</span>
              <div>
                <h3>Qualifizieren und planen</h3>
                <p>
                  MEDDPICC-Module und deterministische Tools arbeiten auf demselben
                  Datenmodell. Informationen müssen nicht mehrfach erfasst werden.
                </p>
              </div>
            </li>
            <li>
              <span class="workflow-step">3</span>
              <div>
                <h3>Speichern und wiederverwenden</h3>
                <p>
                  Der aktualisierte Projektstand wird wieder als Datei gespeichert.
                  Deal Reviews und Exporte entstehen aus denselben strukturierten Daten.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section class="privacy-band" aria-labelledby="privacy-title">
        <div class="container privacy-grid">
          <div>
            <p class="eyebrow eyebrow--light">Local-first</p>
            <h2 id="privacy-title">Die Projektdatei bleibt die Source of Truth.</h2>
          </div>
          <p>
            Die geplante Basis benötigt weder Cloud-Datenbank noch Benutzerkonto.
            Projektinhalte werden im Browser verarbeitet; externe Integrationen wären
            später ausschließlich optional.
          </p>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <strong>MEDDPICC Workbench</strong>
          <p>Open Source · MIT · Projektstatus: Pre-Alpha</p>
        </div>
        <a
          href="https://github.com/thomasasen/meddpicc-workbench"
          target="_blank"
          rel="noreferrer"
        >
          Repository auf GitHub
        </a>
      </div>
    </footer>
  </div>
</template>
