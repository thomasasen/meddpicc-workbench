import type { ReverseTimelinePlan, ReverseTimelineSegment, TimelineOwner } from '../domain/reverseTimeline'
import { buildTimelineScale, timelineSegmentPosition, timelineTotalDays } from '../domain/timelinePresentation'

export type TimelineExportOptions = {
  title: string
  customerName: string
}

const ownerLabels: Record<TimelineOwner, string> = {
  customer: 'Kunde',
  seller: 'Anbieter',
  shared: 'Gemeinsam',
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function truncate(value: string, maxLength: number): string {
  const trimmed = value.trim()
  return trimmed.length <= maxLength ? trimmed : `${trimmed.slice(0, maxLength - 1)}…`
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year}`
}

function segmentColors(segment: ReverseTimelineSegment): { fill: string; stroke: string; text: string } {
  switch (segment.area) {
    case 'decision-process':
      return { fill: '#dbeafe', stroke: '#60a5fa', text: '#1e3a8a' }
    case 'paper-process':
      return { fill: '#ede9fe', stroke: '#a78bfa', text: '#4c1d95' }
    case 'implementation':
      return { fill: '#dcfce7', stroke: '#4ade80', text: '#14532d' }
  }
}

function ownerDisplay(segment: ReverseTimelineSegment): string {
  const detail = segment.ownerDetail?.trim()
  return detail ? `${ownerLabels[segment.owner]} · ${detail}` : ownerLabels[segment.owner]
}

function durationLabel(segment: ReverseTimelineSegment, full = false): string {
  const fullUnit = segment.durationUnit === 'business-days' ? 'Arbeitstage' : 'Kalendertage'
  const shortUnit = segment.durationUnit === 'business-days' ? 'AT' : 'KT'
  return `${segment.duration} ${full ? fullUnit : shortUnit}`
}

function bufferLabel(plan: ReverseTimelinePlan): string {
  if (plan.status === 'target-before-reference') return 'Target vor Planungsdatum'
  if (plan.status === 'compression-required') {
    return `Fehlen ${Math.abs(plan.calendarDaysToLatestStart)} Kalendertage`
  }
  return `${plan.calendarDaysToLatestStart} Kalendertage`
}

export function buildCustomerTimelineSvg(plan: ReverseTimelinePlan, options: TimelineExportOptions): string {
  const width = 1600
  const left = 430
  const right = 90
  const timelineWidth = width - left - right
  const rowHeight = 76
  const chartTop = 330
  const chartBottom = chartTop + plan.chronologicalSegments.length * rowHeight
  const height = chartBottom + 150
  const ticks = buildTimelineScale(plan)
  const totalDays = timelineTotalDays(plan)

  const tickMarkup = ticks
    .map((tick) => {
      const x = left + (tick.position / 100) * timelineWidth
      const anchor = tick.position === 0 ? 'start' : tick.position === 100 ? 'end' : 'middle'
      const lineColor = tick.position === 100 ? '#15803d' : '#e2e8f0'
      const lineWidth = tick.position === 100 ? 2 : 1
      const labelColor = tick.position === 100 ? '#166534' : '#64748b'
      return `
        <line x1="${x.toFixed(1)}" y1="${chartTop - 42}" x2="${x.toFixed(1)}" y2="${chartBottom}" stroke="${lineColor}" stroke-width="${lineWidth}"/>
        <text x="${x.toFixed(1)}" y="${chartTop - 55}" text-anchor="${anchor}" font-size="15" font-weight="${tick.position === 100 ? 700 : 500}" fill="${labelColor}">${escapeXml(tick.label)}</text>
      `
    })
    .join('')

  const rows = plan.chronologicalSegments
    .map((segment, index) => {
      const y = chartTop + index * rowHeight
      const position = timelineSegmentPosition(plan, segment)
      const x = left + (position.leftPercent / 100) * timelineWidth
      const barWidth = Math.max(8, (position.widthPercent / 100) * timelineWidth)
      const colors = segmentColors(segment)
      const canShowDuration = barWidth >= 58
      const duration = durationLabel(segment, barWidth >= 150)
      const handoffX = Math.min(width - right, x + barWidth)

      return `
        <line x1="70" y1="${y + rowHeight}" x2="${width - right}" y2="${y + rowHeight}" stroke="#eef1f5"/>
        <text x="70" y="${y + 29}" font-size="21" font-weight="650" fill="#172033">${escapeXml(truncate(segment.label, 34))}</text>
        <text x="70" y="${y + 53}" font-size="15" fill="#64748b">${escapeXml(ownerDisplay(segment))} · ${escapeXml(formatDate(segment.startDate))} – ${escapeXml(formatDate(segment.endDate))}</text>
        <rect x="${x.toFixed(1)}" y="${y + 18}" width="${barWidth.toFixed(1)}" height="34" rx="8" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="1.5"/>
        ${canShowDuration ? `<text x="${(x + barWidth - 12).toFixed(1)}" y="${y + 40}" text-anchor="end" font-size="14" font-weight="700" fill="${colors.text}">${escapeXml(duration)}</text>` : ''}
        <circle cx="${handoffX.toFixed(1)}" cy="${y + 35}" r="${segment.endDate === plan.targetGoLiveDate ? 6 : 5}" fill="${segment.endDate === plan.targetGoLiveDate ? '#15803d' : '#2563eb'}" stroke="#ffffff" stroke-width="2"/>
      `
    })
    .join('')

  const safeTitle = escapeXml(truncate(options.title || 'Go-Live-Timeline', 70))
  const safeCustomer = escapeXml(truncate(options.customerName, 70))
  const goLive = escapeXml(formatDate(plan.targetGoLiveDate))
  const latestStart = escapeXml(formatDate(plan.latestStartDate))
  const buffer = escapeXml(bufferLabel(plan))
  const compellingEvent = plan.compellingEvent ? escapeXml(truncate(plan.compellingEvent, 42)) : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <rect x="45" y="36" width="${width - 90}" height="${height - 72}" rx="18" fill="#ffffff" stroke="#d7dee7"/>
    <text x="70" y="88" font-size="16" font-weight="750" letter-spacing="1.4" fill="#1d4ed8">GEMEINSAME GO-LIVE-TIMELINE</text>
    <text x="70" y="130" font-size="36" font-weight="700" fill="#172033">${safeTitle}</text>
    ${safeCustomer ? `<text x="70" y="163" font-size="19" fill="#5f6b7a">${safeCustomer}</text>` : ''}
    
    <rect x="${width - 390}" y="66" width="300" height="${compellingEvent ? 94 : 72}" rx="10" fill="#f0fdf4" stroke="#bbf7d0"/>
    <text x="${width - 367}" y="92" font-size="13" font-weight="700" fill="#166534">TARGET GO-LIVE</text>
    <text x="${width - 367}" y="120" font-size="22" font-weight="700" fill="#166534">${goLive}</text>
    ${compellingEvent ? `<text x="${width - 367}" y="143" font-size="12" fill="#166534">Treiber: ${compellingEvent}</text>` : ''}

    <rect x="70" y="198" width="${width - 160}" height="70" rx="10" fill="#f4f7ff" stroke="#cbd9fb"/>
    <text x="96" y="228" font-size="17" fill="#475569">Um den Go-Live am <tspan font-weight="700" fill="#172033">${goLive}</tspan> zu erreichen, sollte der erste Prozessschritt spätestens am</text>
    <text x="96" y="251" font-size="17" font-weight="700" fill="#172033">${latestStart}</text>
    <text x="${width - 96}" y="226" text-anchor="end" font-size="14" fill="#64748b">Prozessdauer: ${totalDays} Kalendertage</text>
    <text x="${width - 96}" y="249" text-anchor="end" font-size="14" fill="#64748b">Puffer zum Start: ${buffer}</text>

    <circle cx="76" cy="296" r="5" fill="#3b82f6"/>
    <text x="90" y="301" font-size="14" fill="#64748b">Decision Process</text>
    <circle cx="238" cy="296" r="5" fill="#8b5cf6"/>
    <text x="252" y="301" font-size="14" fill="#64748b">Paper Process</text>
    <circle cx="390" cy="296" r="5" fill="#22c55e"/>
    <text x="404" y="301" font-size="14" fill="#64748b">Implementierung</text>

    <text x="70" y="${chartTop - 55}" font-size="13" font-weight="700" letter-spacing="0.8" fill="#64748b">PROZESSSCHRITT</text>
    <line x1="${left}" y1="${chartTop - 42}" x2="${width - right}" y2="${chartTop - 42}" stroke="#bbc6d4"/>
    ${tickMarkup}
    ${rows}

    <text x="70" y="${height - 76}" font-size="14" fill="#64748b">Start ${latestStart}</text>
    <text x="${width - right}" y="${height - 76}" text-anchor="end" font-size="14" font-weight="700" fill="#166534">Go-Live ${goLive}</text>
    <text x="70" y="${height - 46}" font-size="13" fill="#64748b">Arbeitstage berücksichtigen Montag bis Freitag; Feiertage und kundenspezifische Sperrzeiten sind nicht automatisch eingerechnet.</text>
  </svg>`
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadTimelineSvg(svg: string, fileName: string): void {
  downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), fileName)
}

export async function downloadTimelinePng(svg: string, fileName: string): Promise<void> {
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = url

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('SVG konnte nicht für den PNG-Export gerendert werden.'))
    })

    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth || 1600
    canvas.height = image.naturalHeight || 900
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas-Kontext ist nicht verfügbar.')

    context.drawImage(image, 0, 0)
    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('PNG konnte nicht erzeugt werden.'))),
        'image/png',
      )
    })

    downloadBlob(pngBlob, fileName)
  } finally {
    URL.revokeObjectURL(url)
  }
}
