# Security und Privacy

## Security-Modell

MEDDPICC Workbench ist als statische local-first Browser-Anwendung konzipiert.

Vorgesehener Standard-Datenfluss:

```text
lokale .meddpicc-Datei
        ↓
Browser Memory
        ↓
lokales Speichern / Download
```

Opportunity-Inhalte benötigen kein Backend und keine externe API.

## Realistische Privacy-Aussage

Die Anwendung soll so gebaut werden, dass sie im normalen lokalen Betrieb geladene Opportunity-Daten **nicht absichtlich überträgt**.

Das bedeutet nicht, dass eine Webanwendung absolute Vertraulichkeit garantieren kann. Browser Extensions, kompromittierte Geräte, Developer Tools, veränderte Builds, Hosting-Änderungen oder Nutzeraktionen können Privacy beeinflussen.

Dokumentation und UI dürfen deshalb keine absoluten Aussagen wie „Daten können niemals den Rechner verlassen“ machen.

## Runtime-Netzwerkpolicy

Die Produktionsanwendung sendet Projektinhalte standardmäßig nicht an:

- Analytics Services
- AI Services
- Error Reporting Services
- Werbenetzwerke
- Remote-Datenbanken
- CRM-Systeme

Eine spätere Integration muss explizit vom Nutzer aktiviert und klar vom lokalen Standardmodus getrennt sein.

## Statische Assets

Runtime-Assets möglichst mit der Anwendung bundlen.

Externe Fonts, Scripts und Tracker vermeiden, wenn das gleiche Ergebnis mit gebündelten Assets möglich ist.

## Importierte Projektdateien sind untrusted

Loader muss absichern gegen:

- fehlerhaftes JSON
- übergroße Dateien
- unerwartete Datentypen
- Prototype-Pollution-artige Objekte
- unsichere URLs
- HTML-/Script-Strings
- nicht unterstützte Schema-Versionen

Projektinhalt ist Datenmaterial und darf niemals ausgeführt werden.

## Speichern

Vor Save:

1. aktuellen Projektstand validieren
2. über kanonisches Schema/Model serialisieren
3. Revision-Metadaten aktualisieren
4. kompatible unbekannte Daten gemäß Policy erhalten
5. Projekt erst als gespeichert markieren, wenn Save/Download erfolgreich war

## Vulnerability Reporting

Sensible Exploit-Details nicht in einem öffentlichen Issue veröffentlichen.

GitHub Private Security Reporting / Security Advisory verwenden, sofern verfügbar. Andernfalls nur ein minimales nicht sensibles Issue eröffnen, das um einen privaten Meldekanal bittet.

## Dependency Security

Sobald Dependencies hinzukommen:

- Dependency Surface klein halten
- Lockfiles verwenden
- automatisierte Dependency Alerts aktivieren
- Runtime Dependencies strenger prüfen als reine Dev Dependencies
- Dependencies mit Telemetrie oder Runtime Remote Code vermeiden

## Projektsprache

Security-Dokumentation und Nutzerwarnungen sind deutsch. Etablierte technische Security-Begriffe können Englisch bleiben, wenn das präziser und üblicher ist.
