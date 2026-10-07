import { describe, expect, it } from 'vitest'

import { calculateReverseTimeline } from '../domain/reverseTimeline'
import { buildCustomerTimelineSvg } from './timelineExport'

describe('buildCustomerTimelineSvg', () => {
  it('erzeugt eine kundenfähige Executive-Timeline mit Achse, Go-Live und Prozessschritten', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: '2027-07-01',
      referenceDate: '2027-01-04',
      steps: [
        {
          id: 'implementation',
          label: 'Implementierung / Rollout',
          duration: 30,
          durationUnit: 'calendar-days',
          owner: 'shared',
          area: 'implementation',
        },
        {
          id: 'legal',
          label: 'Legal / Datenschutz',
          duration: 10,
          durationUnit: 'calendar-days',
          owner: 'customer',
          area: 'paper-process',
        },
      ],
    })

    expect(result.success).toBe(true)
    if (!result.success) return

    const svg = buildCustomerTimelineSvg(result.plan, {
      title: 'Gemeinsamer Go-Live-Plan',
      customerName: 'Beispielwerke GmbH',
    })

    expect(svg).toContain('GEMEINSAMER GO-LIVE-PLAN')
    expect(svg).toContain('Gemeinsamer Go-Live-Plan')
    expect(svg).toContain('Beispielwerke GmbH')
    expect(svg).toContain('TARGET GO-LIVE')
    expect(svg).toContain('01.07.2027')
    expect(svg).toContain('Implementierung / Rollout')
    expect(svg).toContain('Legal / Datenschutz')
    expect(svg).toContain('Kalendertage Planungsfenster')
    expect(svg).toContain('#22c55e')
    expect(svg).toContain('#8b5cf6')
  })

  it('escaped kundenspezifische Texte im SVG', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: '2027-07-01',
      referenceDate: '2027-01-04',
      steps: [
        {
          id: 'one',
          label: 'Legal & Security',
          duration: 5,
          durationUnit: 'calendar-days',
          owner: 'customer',
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
  })
})
