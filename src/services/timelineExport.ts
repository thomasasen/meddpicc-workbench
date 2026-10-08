import type { ReverseTimelinePlan, ReverseTimelineSegment, TimelineOwner } from '../domain/reverseTimeline'
import { buildTimelineScale, timelineSegmentPosition, timelineTotalDays } from '../domain/timelinePresentation'

export type TimelineExportOptions = {
  title: string
  customerName: string
}

const EXPORT_FONT_STACK = "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"

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

function bufferColor(plan: ReverseTimelinePlan): string {
  return plan.status === 'ready' ? '#64748b' : '#9a3412'
}

export function buildCustomerTimelineSvg(plan: ReverseTimelinePlan, options: TimelineExportOptions): string {
  const width = 1600
  const contentLeft = 70
  const outerRight = width - 45
  const timelineLeft = 430
  const timelineRight = width - 120
  const timelineWidth = timelineRight - timelineLeft
  const rowHeight = 76

  const summaryY = 194
  const summaryHeight = 84
  const legendY = 318
  const axisLineY = 366
  const rowsTop = 386
  const chartBottom = rowsTop + plan.chronologicalSegments.length * rowHeight
  const footerY = chartBottom + 70
  const noteY = footerY + 32
  const height = noteY + 48

  const ticks = buildTimelineScale(plan)
  const totalDays = timelineTotalDays(plan)

  const tickMarkup = ticks
    .map((tick) => {
      const x = timelineLeft + (tick.position / 100) * timelineWidth
      const anchor = tick.position === 0 ? 'start' : tick.position === 100 ? 'end' : 'middle'
      const lineColor = tick.position === 100 ? '#15803d' : '#e2e8f0'
      const lineWidth = tick.position === 100 ? 2 : 1
      const labelColor = tick.position === 100 ? '#166534' : '#64748b'

      return `
        <line class="export-grid-line" x1="${x.toFixed(1)}" y1="${axisLineY}" x2="${x.toFixed(1)}" y2="${chartBottom}" stroke="${lineColor}" stroke-width="${lineWidth}"/>
        <text x="${x.toFixed(1)}" y="${axisLineY - 15}" text-anchor="${anchor}" font-size="15" font-weight="${tick.position === 100 ? 700 : 500}" fill="${labelColor}">${escapeXml(tick.label)}</text>
      `
    })
    .join('')

  const rows = plan.chronologicalSegments
    .map((segment, index) => {
      const y = rowsTop + index * rowHeight
      const position = timelineSegmentPosition(plan, segment)
      const x = timelineLeft + (position.leftPercent / 100) * timelineWidth
      const barWidth = Math.max(8, (position.widthPercent / 100) * timelineWidth)
      const colors = segmentColors(segment)
      const canShowDuration = barWidth >= 58
      const duration = durationLabel(segment, barWidth >= 150)
      const handoffX = Math.min(timelineRight, x + barWidth)

      return `
        <g class="export-row" id="export-row-${index}" data-row-index="${index}" data-y="${y}">
          <line x1="${contentLeft}" y1="${y + rowHeight}" x2="${timelineRight}" y2="${y + rowHeight}" stroke="#eef1f5"/>
          <text x="${contentLeft}" y="${y + 31}" font-size="21" font-weight="700" fill="#172033">${escapeXml(truncate(segment.label, 34))}</text>
          <text x="${contentLeft}" y="${y + 55}" font-size="15" font-weight="400" fill="#64748b">${escapeXml(ownerDisplay(segment))} · ${escapeXml(formatDate(segment.startDate))} – ${escapeXml(formatDate(segment.endDate))}</text>
          <rect x="${x.toFixed(1)}" y="${y + 20}" width="${barWidth.toFixed(1)}" height="34" rx="8" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="1.5"/>
          ${canShowDuration ? `<text x="${(x + barWidth - 12).toFixed(1)}" y="${y + 42}" text-anchor="end" font-size="14" font-weight="700" fill="${colors.text}">${escapeXml(duration)}</text>` : ''}
          <circle cx="${handoffX.toFixed(1)}" cy="${y + 37}" r="${segment.endDate === plan.targetGoLiveDate ? 6 : 5}" fill="${segment.endDate === plan.targetGoLiveDate ? '#15803d' : '#2563eb'}" stroke="#ffffff" stroke-width="2"/>
        </g>
      `
    })
    .join('')

  const safeTitle = escapeXml(truncate(options.title || 'Go-Live-Timeline', 70))
  const safeCustomer = escapeXml(truncate(options.customerName, 70))
  const goLive = escapeXml(formatDate(plan.targetGoLiveDate))
  const latestStart = escapeXml(formatDate(plan.latestStartDate))
  const buffer = escapeXml(bufferLabel(plan))
  const compellingEvent = plan.compellingEvent ? escapeXml(truncate(plan.compellingEvent, 42)) : ''
  const bufferTextColor = bufferColor(plan)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-export-safe-right="${width - timelineRight}" style="font-family: ${EXPORT_FONT_STACK}; font-synthesis: none; text-rendering: optimizeLegibility;">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <rect x="45" y="36" width="${width - 90}" height="${height - 72}" rx="18" fill="#ffffff" stroke="#d7dee7"/>

    <g id="export-header" data-zone="header">
      <text x="${contentLeft}" y="88" font-size="16" font-weight="700" letter-spacing="1.4" fill="#1d4ed8">GEMEINSAME GO-LIVE-TIMELINE</text>
      <text x="${contentLeft}" y="130" font-size="36" font-weight="700" fill="#172033">${safeTitle}</text>
      ${safeCustomer ? `<text x="${contentLeft}" y="162" font-size="19" font-weight="400" fill="#5f6b7a">${safeCustomer}</text>` : ''}

      <rect x="${width - 390}" y="66" width="300" height="${compellingEvent ? 94 : 72}" rx="10" fill="#f0fdf4" stroke="#bbf7d0"/>
      <text x="${width - 367}" y="92" font-size="13" font-weight="700" fill="#166534">TARGET GO-LIVE</text>
      <text x="${width - 367}" y="120" font-size="22" font-weight="700" fill="#166534">${goLive}</text>
      ${compellingEvent ? `<text x="${width - 367}" y="143" font-size="12" font-weight="400" fill="#166534">Treiber: ${compellingEvent}</text>` : ''}
    </g>

    <g id="export-summary" data-zone="summary" data-y="${summaryY}" data-height="${summaryHeight}">
      <rect x="${contentLeft}" y="${summaryY}" width="${outerRight - contentLeft}" height="${summaryHeight}" rx="10" fill="#f4f7ff" stroke="#cbd9fb"/>
      <text x="96" y="${summaryY + 32}" font-size="17" font-weight="400" fill="#475569">Um den Go-Live am <tspan font-weight="700" fill="#172033">${goLive}</tspan> zu erreichen, sollte der erste Prozessschritt spätestens am</text>
      <text x="96" y="${summaryY + 57}" font-size="17" font-weight="700" fill="#172033">${latestStart}</text>
      <text x="${width - 96}" y="${summaryY + 31}" text-anchor="end" font-size="14" font-weight="500" fill="#64748b">Prozessdauer: ${totalDays} Kalendertage</text>
      <text x="${width - 96}" y="${summaryY + 57}" text-anchor="end" font-size="14" font-weight="600" fill="${bufferTextColor}">Puffer zum Start: ${buffer}</text>
    </g>

    <g id="export-legend" data-zone="legend" data-y="${legendY}">
      <text x="${contentLeft}" y="${legendY + 5}" font-size="13" font-weight="700" letter-spacing="0.8" fill="#64748b">PROZESSSCHRITT</text>

      <circle cx="${timelineLeft + 6}" cy="${legendY}" r="5" fill="#3b82f6"/>
      <text x="${timelineLeft + 20}" y="${legendY + 5}" font-size="14" font-weight="500" fill="#64748b">Decision Process</text>
      <circle cx="${timelineLeft + 174}" cy="${legendY}" r="5" fill="#8b5cf6"/>
      <text x="${timelineLeft + 188}" y="${legendY + 5}" font-size="14" font-weight="500" fill="#64748b">Paper Process</text>
      <circle cx="${timelineLeft + 326}" cy="${legendY}" r="5" fill="#22c55e"/>
      <text x="${timelineLeft + 340}" y="${legendY + 5}" font-size="14" font-weight="500" fill="#64748b">Implementierung</text>
    </g>

    <g id="export-axis" data-zone="axis" data-y="${axisLineY}">
      <line class="export-axis-baseline" x1="${timelineLeft}" y1="${axisLineY}" x2="${timelineRight}" y2="${axisLineY}" stroke="#bbc6d4"/>
      ${tickMarkup}
    </g>

    <g id="export-rows" data-zone="rows" data-y="${rowsTop}" data-bottom="${chartBottom}">
      ${rows}
    </g>

    <g id="export-footer" data-zone="footer" data-y="${footerY}">
      <text x="${contentLeft}" y="${footerY}" font-size="14" font-weight="400" fill="#64748b">Start ${latestStart}</text>
      <text x="${timelineRight}" y="${footerY}" text-anchor="end" font-size="14" font-weight="700" fill="#166534">Go-Live ${goLive}</text>
      <text x="${contentLeft}" y="${noteY}" font-size="13" font-weight="400" fill="#64748b">Arbeitstage berücksichtigen Montag bis Freitag; Feiertage und kundenspezifische Sperrzeiten sind nicht automatisch eingerechnet.</text>
    </g>
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
  await document.fonts.ready

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
