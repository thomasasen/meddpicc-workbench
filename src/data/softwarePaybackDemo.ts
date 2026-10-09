import {
  calculateSoftwarePayback,
  newMetric,
  type CustomerMetric,
  type SoftwarePaybackInput,
} from '../domain/softwarePayback'

/**
 * Ausschließlich fiktives CRM-/SaaS-Projekt. Die MEDDPICC-Demodatei verwendet
 * denselben Fall als Story, ist aber kein Datentransfer in diesen Microtool-State.
 *
 * 480.000 EUR einmalige Kosten, 96.000 EUR/Jahr neues SaaS;
 * 36.000 EUR/Jahr Altsoftware entfallen erst ab Monat 10.
 * 320.000 EUR/Jahr anrechenbarer Nutzen bei vollständigem Hochlauf,
 * dazu getrennte, NICHT angerechnete Kapazität und Risikoeinschätzung.
 */
export function createCrmSaasDemo(): SoftwarePaybackInput {
  const external = newMetric('demo-external', 'direct')
  const process = newMetric('demo-service', 'process')
  const conversion = newMetric('demo-conversion', 'conversion')
  const capacity = newMetric('demo-capacity', 'time')
  const risk = newMetric('demo-risk', 'risk')

  const metrics: CustomerMetric[] = [
    {
      ...external,
      name: 'Wegfall externer Vertriebsunterstützung',
      annualAmountEur: 110000,
      included: true,
      treatment: 'realized',
      evidence: 'hypothesis',
      effectGroup: 'externe-vertriebskosten',
      startMonth: 7,
      rampMonths: 3,
      evidenceNote:
        'Fiktive Annahme: Externe Leistungen entfallen erst nach erfolgreicher Prozessumstellung. Vertragskündigung und Vollkosten sind noch zu prüfen.',
    },
    {
      ...process,
      name: 'Geringere Bearbeitungskosten im Service',
      annualVolume: 30000,
      before: 6,
      after: 4,
      included: true,
      treatment: 'realized',
      evidence: 'hypothesis',
      effectGroup: 'service-vorgangskosten',
      startMonth: 7,
      rampMonths: 3,
      evidenceNote:
        'Fiktiv: 30.000 Vorgänge pro Jahr × 2 EUR tatsächlich vermeidbare Fremd-/Prozesskosten. Mengen und Realisierung nicht bestätigt.',
    },
    {
      ...conversion,
      name: 'Mehr Abschlüsse durch bessere Conversion',
      annualVolume: 2500,
      before: 20,
      after: 25,
      valuePerEventEur: 1200,
      included: true,
      treatment: 'realized',
      evidence: 'hypothesis',
      effectGroup: 'angebotsconversion-deckungsbeitrag',
      startMonth: 9,
      rampMonths: 6,
      evidenceNote:
        'Fiktiv: 125 zusätzliche Aufträge/Jahr × 1.200 EUR Deckungsbeitrag (nicht Umsatz). Vertriebskapazität und Kannibalisierung sind ungeprüft.',
    },
    {
      ...capacity,
      name: 'CRM-Nacharbeit: 9 auf 3 Stunden pro Woche',
      annualVolume: 85 * 46,
      before: 9 * 60,
      after: 3 * 60,
      hourlyCostEur: 58,
      included: false,
      treatment: 'capacity',
      evidence: 'hypothesis',
      effectGroup: 'crm-nacharbeit-kapazitaet',
      startMonth: 7,
      rampMonths: 6,
      evidenceNote:
        '85 Mitarbeitende × 46 Wochen; 23.460 Stunden jährliche potenzielle Zeitersparnis. 1.360.680 EUR rechnerischer Kapazitätswert, keine belegte Geldersparnis. Nicht zusätzlich zu bereits enthaltenen Wirkungen anrechnen.',
    },
    {
      ...risk,
      name: 'Weniger Service-/Compliance-Risiken',
      annualAmountEur: 40000,
      included: false,
      treatment: 'risk',
      evidence: 'hypothesis',
      effectGroup: 'risiko-erwartungswert',
      startMonth: 10,
      rampMonths: 1,
      evidenceNote:
        'Reine fiktive Risikoschätzung, weder sichere Ersparnis noch verifizierter Erwartungswert. Außerhalb des Basis-Payback.',
    },
  ]

  return {
    horizonMonths: 36,
    costs: [
      {
        id: 'demo-implementation',
        name: 'Einführung und Customizing',
        kind: 'one-time',
        amountEur: 360000,
        period: 'monthly',
        startMonth: 0,
      },
      {
        id: 'demo-migration',
        name: 'Datenmigration und Integration',
        kind: 'one-time',
        amountEur: 90000,
        period: 'monthly',
        startMonth: 4,
      },
      {
        id: 'demo-training',
        name: 'Training und Change Management',
        kind: 'one-time',
        amountEur: 30000,
        period: 'monthly',
        startMonth: 6,
      },
      {
        id: 'demo-saas',
        name: 'Neue CRM-SaaS-Lizenzen',
        kind: 'saas',
        amountEur: 8000,
        period: 'monthly',
        startMonth: 1,
      },
      {
        id: 'demo-old-crm',
        name: 'Entfall alte CRM-Lizenzen',
        kind: 'avoided-legacy',
        amountEur: 3000,
        period: 'monthly',
        startMonth: 10,
        effectGroup: 'alt-crm-lizenzkosten',
      },
    ],
    metrics,
  }
}

export function calculateCrmSaasDemo() {
  return calculateSoftwarePayback(createCrmSaasDemo())
}
