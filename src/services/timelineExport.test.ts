import { describe, expect, it } from 'vitest'

import { calculateReverseTimeline } from '../domain/reverseTimeline'
import { buildCustomerTimelineSvg } from './timelineExport'

describe('buildCustomerTimelineSvg', () => {
  it('erzeugt eine kundenfähige Executive-Timeline mit Achse, Go-Live und Prozessschritten', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: '2027-07-01',
      referenceDate: '2027-01-04',
      compellingEvent: 'Altvertrag endet am 30.06.',
      steps: [
        {
          id: 'implementation',
          label: 'Implementierung / Rollout',
          duration: 30,
          durationUnit: 'calendar-days',
          owner: 'shared',
          ownerDetail: 'Projektteam',
          area: 'implementation',
        },
        {
          id: 'legal',
          label: 'Legal / Datenschutz',
          duration: 10,
          durationUnit: 'calendar-days',
          owner: 'customer',
          ownerDetail: 'Legal & Datenschutz',
          area: 'paper-process',
        },
      ],
    })

    expect(result.success).toBe(true)
    if (!result.success) return

    const svg = buildCustomerTimelineSvg(result.plan, {
      title: 'Go-Live-Timeline',
      customerName: 'Beispielwerke GmbH',
    })

    expect(svg).toContain('GEMEINSAME GO-LIVE-TIMELINE')
    expect(svg).toContain('Go-Live-Timeline')
    expect(svg).toContain('Beispielwerke GmbH')
    expect(svg).toContain('TARGET GO-LIVE')
    expect(svg).toContain('01.07.2027')
    expect(svg).toContain('Implementierung / Rollout')
    expect(svg).toContain('Legal / Datenschutz')
    expect(svg).toContain('Gemeinsam · Projektteam')
    expect(svg).toContain('Treiber: Altvertrag endet am 30.06.')
    expect(svg).toContain('Prozessdauer: 40 Kalendertage')
    expect(svg).toContain('Puffer zum Start:')
    expect(svg).toContain('#22c55e')
    expect(svg).toContain('#8b5cf6')
    expect(svg).toContain('#15803d')
  })

  it('escaped kundenspezifische Texte im SVG', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: '2027-07-01',
      referenceDate: '2027-01-04',
      compellingEvent: 'Ablösung A & B <kritisch>',
      steps: [
        {
          id: 'one',
          label: 'Legal & Security',
          duration: 5,
          durationUnit: 'calendar-days',
          owner: 'customer',
          ownerDetail: 'Legal & Datenschutz',
          area: 'paper-process',
        },
      ],
    })

    expect(result.success).toBe(true)
    if (!result.success) return

    const svg = buildCustomerTimelineSvg(result.plan, {
      title: 'Plan <Final>',
      customerName: 'A & B GmbH',
    })

    expect(svg).toContain('Plan &lt;Final&gt;')
    expect(svg).toContain('A &amp; B GmbH')
    expect(svg).toContain('Legal &amp; Security')
    expect(svg).toContain('Legal &amp; Datenschutz')
    expect(svg).toContain('Treiber: Ablösung A &amp; B &lt;kritisch&gt;')
  })
})
