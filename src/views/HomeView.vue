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

const nextActions = [
  {
    title: 'Procurement-Ablauf bestätigen',
    context: 'Paper Process',
    due: 'Nächster Kundentermin',
  },
  {
    title: 'Investitionspriorität mit Economic Buyer validieren',
    context: 'Economic Buyer',
    due: 'Offen',
  },
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
            <span>Local-first Deal-Qualifizierung</span>
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
      <section class="intro">
        <div class="container intro-grid">
          <div class="intro-copy">
            <p class="eyebrow">MEDDPICC für komplexe B2B-Opportunities</p>
            <h1>Qualifizierung, Evidenz und Deal Planning in einer Arbeitsumgebung.</h1>
            <p class="intro-text">
              Die Workbench strukturiert MEDDPICC-Informationen, macht Gaps sichtbar
              und übernimmt wiederholbare Berechnungs- und Planungsarbeit. Der
              Opportunity-Stand liegt in einer portablen <code>.meddpicc</code>-Datei.
            </p>

            <div class="release-panel" aria-label="Aktueller Funktionsstand">
              <div>
                <span class="release-panel-label">Aktueller Stand</span>
                <strong>Projektdatei-Funktionen folgen mit Roadmap 1</strong>
              </div>
              <a class="button button-secondary" href="#arbeitsweise">
                Arbeitsweise ansehen
              </a>
            </div>

            <ul class="principle-list" aria-label="Technische Grundprinzipien">
              <li>Kein Backend erforderlich</li>
              <li>Keine AI zur Runtime</li>
              <li>Projektinhalte werden lokal im Browser verarbeitet</li>
            </ul>
          </div>

          <section class="opportunity-panel" aria-labelledby="opportunity-title">
            <div class="panel-header">
              <div>
                <p class="panel-kicker">Beispiel-Opportunity</p>
                <h2 id="opportunity-title">ACME CRM Transformation</h2>
              </div>
              <span class="deal-value">€ 480k</span>
            </div>

            <dl class="opportunity-meta">
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

            <div class="workbench-grid">
              <section class="workbench-block" aria-labelledby="gaps-title">
                <div class="block-heading">
                  <h3 id="gaps-title">Kritische Gaps</h3>
                  <span class="count-badge">2 offen</span>
                </div>

                <div class="risk-item">
                  <span class="risk-indicator" aria-hidden="true"></span>
                  <div>
                    <strong>Paper Process nicht belastbar bestätigt</strong>
                    <p>Owner, Procurement-Schritte und Lead Time fehlen.</p>
                  </div>
                </div>

                <div class="risk-item risk-item--warning">
                  <span class="warning-indicator" aria-hidden="true"></span>
                  <div>
                    <strong>Economic-Buyer-Priorität nur teilweise belegt</strong>
                    <p>Direkte Bestätigung der Investitionspriorität fehlt.</p>
                  </div>
                </div>
              </section>

              <section class="workbench-block" aria-labelledby="actions-title">
                <div class="block-heading">
                  <h3 id="actions-title">Nächste Aktionen</h3>
                  <span class="count-badge">2</span>
                </div>

                <ol class="action-list">
                  <li v-for="action in nextActions" :key="action.title">
                    <div>
                      <strong>{{ action.title }}</strong>
                      <span>{{ action.context }}</span>
                    </div>
                    <span class="action-due">{{ action.due }}</span>
                  </li>
                </ol>
              </section>
            </div>

            <section class="status-section" aria-labelledby="status-title">
              <div class="block-heading block-heading--status">
                <div>
                  <h3 id="status-title">MEDDPICC-Status</h3>
                  <p>Evidenzgrad, keine Gewinnwahrscheinlichkeit</p>
                </div>
                <span class="status-scale">0–10</span>
              </div>

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
                    <span
                      class="confidence"
                      :aria-label="`${item.confidence} von 10 Evidenzgrad`"
                    >
                      {{ item.confidence }}/10
                    </span>
                  </span>
                </div>
              </div>
            </section>
          </section>
        </div>
      </section>

      <section class="section section-muted" aria-labelledby="aufgaben-title">
        <div class="container compact-section-grid">
          <div class="section-heading">
            <p class="eyebrow">Deterministische Unterstützung</p>
            <h2 id="aufgaben-title">Welche Arbeit die Workbench übernehmen soll</h2>
            <p>
              Sie ersetzt keine Seller-Beurteilung. Sie reduziert administrative
              Fleißarbeit und hält Qualifizierungslogik nachvollziehbar.
            </p>
          </div>

          <div class="capability-list">
            <article>
              <span class="capability-label">Evidenz</span>
              <div>
                <h3>Wissen und Annahmen trennen</h3>
                <p>
                  Quelle, Datum und Evidenztyp bleiben mit einer Aussage verknüpft.
                  Unbekanntes muss nicht künstlich „grün“ gemacht werden.
                </p>
              </div>
            </article>

            <article>
              <span class="capability-label">Prozess</span>
              <div>
                <h3>Decision Process und Paper Process planbar machen</h3>
                <p>
                  Owner, Termine, Abhängigkeiten und Go-Live-Auswirkungen werden
                  strukturiert statt in parallelen Notizen gepflegt.
                </p>
              </div>
            </article>

            <article>
              <span class="capability-label">Value</span>
              <div>
                <h3>Metrics und Business Case reproduzierbar berechnen</h3>
                <p>
                  ROI, Payback und Cost of Delay entstehen aus dokumentierten Inputs
                  und lassen sich jederzeit nachvollziehbar neu berechnen.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="arbeitsweise" class="section" aria-labelledby="arbeitsweise-title">
        <div class="container compact-section-grid">
          <div class="section-heading">
            <p class="eyebrow">Ein Projekt, ein Datenmodell</p>
            <h2 id="arbeitsweise-title">Geplanter Project File Lifecycle</h2>
            <p>
              Die <code>.meddpicc</code>-Datei bleibt der kanonische Projektstand.
              Browser Storage dient höchstens als Recovery- oder Komfortebene.
            </p>
          </div>

          <ol class="workflow-list">
            <li>
              <span class="workflow-step">1</span>
              <div>
                <h3>Projektdatei öffnen</h3>
                <p>
                  Eine portable Datei enthält den strukturierten Stand der Opportunity
                  und kann beispielsweise beim CRM-Datensatz abgelegt werden.
                </p>
              </div>
            </li>
            <li>
              <span class="workflow-step">2</span>
              <div>
                <h3>Qualifizieren und planen</h3>
                <p>
                  MEDDPICC-Module, Evidenz, Risiken, Aktionen und Tools arbeiten
                  auf demselben Datenmodell.
                </p>
              </div>
            </li>
            <li>
              <span class="workflow-step">3</span>
              <div>
                <h3>Validiert speichern und wiederverwenden</h3>
                <p>
                  Der aktualisierte Stand wird nach Schema-Validierung wieder als
                  Projektdatei gespeichert; Reviews und Exporte nutzen dieselben Daten.
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
            <h2 id="privacy-title">Projektverarbeitung ohne verpflichtendes Backend.</h2>
          </div>
          <p>
            Die geplante Basis verarbeitet Projektinhalte lokal im Browser. Die
            Anwendung benötigt dafür weder Cloud-Datenbank noch Benutzerkonto.
            Spätere externe Integrationen wären ausdrücklich optional.
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
