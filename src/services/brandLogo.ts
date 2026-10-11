import { MAX_LOGO_BYTES, MAX_LOGO_PIXELS, MAX_LOGO_SIDE, validateBrandLogo, type BrandLogo } from '../report/brandProfile'

/**
 * Decode über den Browser, Normalisierung auf PNG ohne EXIF/Quellmetadaten.
 * Keine URL, kein Canvas-Inhalt und keine Datei werden an Dritte übertragen.
 */
export async function normalizeBrandLogo(file: File): Promise<BrandLogo> {
  if (file.size > MAX_LOGO_BYTES || file.size === 0) throw new Error('Logo muss kleiner als 2 MB sein.')
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer())
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => head[i] === v)
  const jpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff
  if (!png && !jpeg) throw new Error('Nur echte PNG- und JPEG-Dateien sind erlaubt.')
  if (file.type && file.type !== (png ? 'image/png' : 'image/jpeg')) {
    throw new Error('Dateityp und Dateisignatur stimmen nicht überein.')
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  // Vor dem Bitmap-Decoder auch Header, Pixelzahl und JPEG-Endmarker prüfen.
  const base64 = btoa(Array.from(bytes, (v) => String.fromCharCode(v)).join(''))
  const format = png ? 'image/png' : 'image/jpeg'
  // Bildheader werden bei einem temporären Testdatensatz validiert.
  // Pixelzahl wird danach mit der tatsächlichen Browserdekodierung verglichen.
  const temporary = { mimeType: format, base64, width: 0, height: 0 } as BrandLogo
  let image: ImageBitmap
  try {
    image = await createImageBitmap(new Blob([bytes], { type: format }))
  } catch { throw new Error('Logo kann nicht als Bild dekodiert werden.') }
  try {
    if (image.width === 0 || image.height === 0 || image.width > MAX_LOGO_SIDE || image.height > MAX_LOGO_SIDE ||
        image.width * image.height > MAX_LOGO_PIXELS) {
      throw new Error('Logo ist zu groß: maximal 4096 Pixel pro Seite und 12 Millionen Pixel insgesamt.')
    }
    temporary.width = image.width
    temporary.height = image.height
    validateBrandLogo(temporary)
    const scale = Math.min(1, 1600 / Math.max(image.width, image.height))
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Bildnormalisierung nicht verfügbar.')
    ctx.drawImage(image, 0, 0, width, height)
    const encoded = canvas.toDataURL('image/png').split(',')[1]
    if (!encoded) throw new Error('Logo konnte nicht normalisiert werden.')
    return validateBrandLogo({ mimeType: 'image/png', base64: encoded, width, height })
  } finally { image.close() }
}
