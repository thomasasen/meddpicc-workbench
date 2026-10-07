import type { ReverseTimelinePlan, ReverseTimelineSegment, TimelineOwner } from '../domain/reverseTimeline'

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

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year}`
}

function segmentFill(segment: ReverseTimelineSegment): string {
  switch (segment.area) {
    case 'decision-process':
      return '#dbeafe'
    case 'paper-process':
      return '#e0e7ff'
    case 'implementation':
      return '#dcfce7'
  }
}

export function buildCustomerTimelineSvg(
  plan: ReverseTimelinePlan,
  options: TimelineExportOptions,
): string {
  const width = 1600
  const left = 390
  const right = 80
  const timelineWidth = width - left - right
  const rowHeight = 78
  const top = 220
  const height = top + plan.chronologicalSegments.length * rowHeight + 120

  const planStart = Date.parse(`${plan.latestStartDate}T00:00:00Z`)
  const planEnd = Date.parse(`${plan.targetGoLiveDate}T00:00:00Z`)
  const totalMs = Math.max(86_400_000, planEnd - planStart)
  const xForDate = (isoDate: string) => {
    const value = Date.parse(`${isoDate}T00:00:00Z`)
    return left + ((value - planStart) / totalMs) * timelineWidth
  }

  const rows = plan.chronologicalSegments
    .map((segment, index) => {
      const y = top + index * rowHeight
      const x1 = xForDate(segment.startDate)
      const x2 = xForDate(segment.endDate)
      const barWidth = Math.max(4, x2 - x1)

      return `
        <text x="70" y="${y + 23}" font-size="24" font-weight="650" fill="#172033">${escapeXml(segment.label)}</text>
        <text x="70" y="${y + 49}" font-size="17" fill="#5f6b7a">${escapeXml(ownerLabels[segment.owner])} · ${segment.duration} ${segment.durationUnit === 'business-days' ? 'Arbeitstage' : 'Kalendertage'}</text>
        <rect x="${x1.toFixed(1)}" y="${y + 4}" width="${barWidth.toFixed(1)}" height="36" rx="7" fill="${segmentFill(segment)}" stroke="#94a3b8"/>
        <text x="${Math.max(left, x1).toFixed(1)}" y="${y + 62}" font-size="15" fill="#475569">${formatDate(segment.startDate)}</text>
      `
    })
    .join('')

  const safeTitle = escapeXml(options.title.trim() || 'Go-Live-Plan')
  const safeCustomer = escapeXml(options.customerName.trim())

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="70" y="72" font-size="38" font-weight="700" fill="#172033">${safeTitle}</text>
    ${safeCustomer ? `<text x="70" y="108" font-size="21" fill="#5f6b7a">${safeCustomer}</text>` : ''}
    <text x="70" y="158" font-size="18" font-weight="650" fill="#172033">Rückwärts geplant vom Target Go-Live ${formatDate(plan.targetGoLiveDate)}</text>
    <line x1="${left}" y1="${top - 34}" x2="${left + timelineWidth}" y2="${top - 34}" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="${left}" cy="${top - 34}" r="6" fill="#2563eb"/>
    <circle cx="${left + timelineWidth}" cy="${top - 34}" r="6" fill="#15803d"/>
    <text x="${left}" y="${top - 50}" font-size="16" fill="#475569">${formatDate(plan.latestStartDate)}</text>
    <text x="${left + timelineWidth}" y="${top - 50}" text-anchor="end" font-size="16" fill="#475569">Go-Live ${formatDate(plan.targetGoLiveDate)}</text>
    ${rows}
    <text x="70" y="${height - 46}" font-size="14" fill="#64748b">Hinweis: Arbeitstage berücksichtigen Montag bis Freitag; Feiertage sind nicht eingerechnet.</text>
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
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG konnte nicht erzeugt werden.'))), 'image/png')
    })

    downloadBlob(pngBlob, fileName)
  } finally {
    URL.revokeObjectURL(url)
  }
}
