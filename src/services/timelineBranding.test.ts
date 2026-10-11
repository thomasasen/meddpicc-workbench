import { describe, expect, it } from 'vitest'
import { calculateReverseTimeline } from '../domain/reverseTimeline'
import { BRAND_SCHEMA_VERSION, validateBrandProfile } from '../report/brandProfile'
import { buildCustomerTimelineSvg } from './timelineExport'

function plan() {
  const result = calculateReverseTimeline({
    referenceDate: '2027-01-04',
    targetGoLiveDate: '2027-07-01',
    steps: [
      { id: 'legal', label: 'Legal & Datenschutz', duration: 10, durationUnit: 'calendar-days', owner: 'customer', area: 'paper-process' },
      { id: 'rollout', label: 'Rollout', duration: 30, durationUnit: 'calendar-days', owner: 'shared', area: 'implementation' },
    ],
  })
  if (!result.success) throw new Error('Ungültige Testplanung')
  return result.plan
}

const brand = (logo?: { mimeType: 'image/png'; base64: string; width: number; height: number }) =>
  validateBrandProfile({
    version: BRAND_SCHEMA_VERSION, companyName: 'A & B <Consulting> GmbH',
    primaryColor: '#F3EBD7', accentColor: '#E4AC13',
    ...(logo ? { logo } : {}),
  })

describe('Corporate Design SVG/PNG-Export', () => {
  it('behält ohne CI die bisherige Grafik und bietet trotzdem eine Screenreader-Beschreibung', () => {
    const svg = buildCustomerTimelineSvg(plan(), { title: 'Go-Live', customerName: 'Kunde' })
    expect(svg).toContain('GEMEINSAME GO-LIVE-TIMELINE')
    expect(svg).not.toContain('data-brand-name')
    expect(svg).not.toContain('data-brand-logo')
    expect(svg).not.toContain('data-brand-accent')
    expect(svg).toContain('<title id="timeline-svg-title">Go-Live</title>')
    expect(svg).toContain('<desc id="timeline-svg-description">')
    expect(svg).toContain('Legal &amp; Datenschutz')
  })

  it('bringt das validierte CI hinein, schützt XML und lässt Prozessfarben fachlich unverändert', () => {
    const svg = buildCustomerTimelineSvg(plan(), { title: 'Go-Live', customerName: 'Kunde', brand: brand() })
    expect(svg).toContain('A &amp; B &lt;Consulting&gt; GmbH')
    expect(svg).toContain('data-brand-accent="true"')
    expect(svg).toContain('fill="#E4AC13"')
    expect(svg).toContain('fill="#172033"')
    expect(svg).toContain('fill="#22c55e"')
    expect(svg).toContain('fill="#8b5cf6"')
    expect(svg).toContain('fill="#15803d"')
    expect(svg).not.toContain('<Consulting>')
    expect(svg).not.toContain('MEDDPICC TOOLBOX')
  })

  it('verwendet nur validierte, eingebettete PNG-Daten und kein ausführbares SVG', () => {
    const withLogo = brand({ mimeType: 'image/png', base64: 'iVBORw0KGgoAAAANSUhEUgAAAKAAAAAkCAYAAAAO7jHjAAAAmklEQVR42u3b0Q1AMBSG0bqbWMgqZrGKhYzCAkIl2ityzrOn5svfFy0FAACgo6H2w3FadsdFrW2dh1cCFB4tQwzx0dJdQyE+MiMM8ZEZYTgaMoX1I3MFLSDfWkAQIAIEASJAECACBAEiQBAgAgQB8r8Aa//lh6fO2rKAfO8KtoL0WL/LBRQhreO7vYJFSMv4SvEwnaTwAAAAUhw4/SwyqIE0/AAAAABJRU5ErkJggg==', width: 160, height: 36 })
    const svg = buildCustomerTimelineSvg(plan(), { title: 'Beispiel', customerName: 'Kunde', brand: withLogo })
    expect(svg).toContain('data-brand-logo="true"')
    expect(svg).toContain('href="data:image/png;base64,')
    expect(svg).not.toContain('<foreignObject')
  })

  it('verwirft XML- und Datenschema-Fremdeingaben vor der SVG-Erzeugung', () => {
    expect(() => buildCustomerTimelineSvg(plan(), {
      title: 'Export', customerName: 'Kunde',
      brand: { ...brand(), primaryColor: 'url(https://evil.test)' },
    })).toThrow('Hex')
    expect(() => buildCustomerTimelineSvg(plan(), {
      title: 'Export', customerName: 'Kunde',
      brand: { ...brand(), injecting: '<foreignObject />' } as ReturnType<typeof brand>,
    })).toThrow('unbekannte Felder')
  })
})
