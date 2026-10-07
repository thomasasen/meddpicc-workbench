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

export function safeExportFileName(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[ä]/g, 'ae')
    .replace(/[ö]/g, 'oe')
    .replace(/[ü]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'meddpicc-export'
}

export function downloadSvgElement(svg: SVGSVGElement, fileName: string): void {
  const source = new XMLSerializer().serializeToString(svg)
  downloadBlob(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }), fileName)
}

export async function downloadSvgElementAsPng(
  svg: SVGSVGElement,
  fileName: string,
  scale = 2,
): Promise<void> {
  const source = new XMLSerializer().serializeToString(svg)
  const svgUrl = URL.createObjectURL(new Blob([source], { type: 'image/svg+xml;charset=utf-8' }))
  const image = new Image()

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('SVG konnte nicht für PNG gerendert werden.'))
      image.src = svgUrl
    })

    const viewBox = svg.viewBox.baseVal
    const width = Math.max(1, viewBox.width || svg.clientWidth)
    const height = Math.max(1, viewBox.height || svg.clientHeight)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)

    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas-Kontext ist nicht verfügbar.')

    context.scale(scale, scale)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG konnte nicht erzeugt werden.'))), 'image/png')
    })

    downloadBlob(png, fileName)
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}
