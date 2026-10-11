/**
 * Organisationsbezogene Daten: keine Opportunity-, Kunden- oder Session-Felder.
 * Importdaten werden vor jeder persistierenden Änderung vollständig geprüft.
 */
export const BRAND_SCHEMA_VERSION = 1 as const
export const MAX_LOGO_BYTES = 2 * 1024 * 1024
export const MAX_PROFILE_JSON_BYTES = 3 * 1024 * 1024
export const MAX_LOGO_PIXELS = 12_000_000
export const MAX_LOGO_SIDE = 4096

export interface BrandLogo {
  mimeType: 'image/png' | 'image/jpeg'
  base64: string
  width: number
  height: number
}

export interface BrandProfile {
  version: typeof BRAND_SCHEMA_VERSION
  companyName: string
  primaryColor: string
  accentColor: string
  textColor?: string
  website?: string
  contact?: string
  defaultAuthor?: string
  footerNote?: string
  logo?: BrandLogo
}

export const DEFAULT_BRAND_COLORS = {
  primaryColor: '#172b49',
  accentColor: '#2764a8',
} as const

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Das CI-Profil muss ein JSON-Objekt sein.')
  }
  return value as Record<string, unknown>
}

function stringField(value: unknown, field: string, max: number, required = false): string | undefined {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error(field + ' ist erforderlich.')
    return undefined
  }
  if (typeof value !== 'string' || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) {
    throw new Error(field + ' enthält ungültige Zeichen oder ist zu lang.')
  }
  const normalized = value.trim()
  if (required && !normalized) throw new Error(field + ' ist erforderlich.')
  // Helvetica/WinAnsi: nicht unterstützte Zeichen nicht stillschweigend durch '?' ersetzen.
  if (/[^\u0020-\u00ff\u20ac]/.test(normalized)) {
    throw new Error(field + ': Ein Sonderzeichen wird von der aktuellen PDF-Schrift nicht unterstützt.')
  }
  return normalized || undefined
}

function color(value: unknown, field: string): string {
  if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(field + ' benötigt einen Hex-Farbwert wie #173A60.')
  }
  return value.toUpperCase()
}

function dimensions(bytes: Uint8Array, mime: BrandLogo['mimeType']): { width: number; height: number } {
  if (mime === 'image/png') {
    const signature = [137, 80, 78, 71, 13, 10, 26, 10]
    if (bytes.length < 45 || !signature.every((v, i) => bytes[i] === v)) {
      throw new Error('Ungültige PNG-Dateisignatur.')
    }
    if (String.fromCharCode(...bytes.slice(12, 16)) !== 'IHDR') {
      throw new Error('PNG-Datei besitzt keinen gültigen IHDR-Block.')
    }
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    return { width: view.getUint32(16), height: view.getUint32(20) }
  }
  if (
    bytes.length < 16 ||
    bytes[0] !== 0xff ||
    bytes[1] !== 0xd8 ||
    bytes[bytes.length - 2] !== 0xff ||
    bytes[bytes.length - 1] !== 0xd9
  ) {
    throw new Error('Ungültige JPEG-Dateisignatur.')
  }
  let offset = 2
  while (offset < bytes.length - 9) {
    if (bytes[offset] !== 0xff) throw new Error('Beschädigter JPEG-Marker.')
    while (bytes[offset] === 0xff) offset++
    const marker = bytes[offset++]!
    if (marker === 0xd9 || marker === 0xda) break
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
    const segmentLength = (bytes[offset]! << 8) | bytes[offset + 1]!
    if (segmentLength < 2 || offset + segmentLength > bytes.length) throw new Error('Beschädigter JPEG-Abschnitt.')
    if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
      return {
        height: (bytes[offset + 3]! << 8) | bytes[offset + 4]!,
        width: (bytes[offset + 5]! << 8) | bytes[offset + 6]!,
      }
    }
    offset += segmentLength
  }
  throw new Error('JPEG-Abmessungen sind nicht lesbar.')
}

export function validateBrandLogo(value: unknown): BrandLogo {
  const input = record(value)
  if (input.mimeType !== 'image/png' && input.mimeType !== 'image/jpeg') {
    throw new Error('Nur PNG und JPEG sind erlaubt.')
  }
  const mimeType = input.mimeType
  if (
    typeof input.base64 !== 'string' ||
    !input.base64 ||
    input.base64.length > Math.ceil(MAX_LOGO_BYTES / 3) * 4 + 4 ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input.base64)
  ) {
    throw new Error('Ungültige oder zu große Logo-Daten.')
  }
  let binary: string
  try {
    binary = atob(input.base64)
  } catch {
    throw new Error('Logo ist nicht gültig Base64-kodiert.')
  }
  if (binary.length > MAX_LOGO_BYTES) throw new Error('Logo überschreitet die Grenze von 2 MB.')
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const size = dimensions(bytes, mimeType)
  if (
    !size.width ||
    !size.height ||
    size.width > MAX_LOGO_SIDE ||
    size.height > MAX_LOGO_SIDE ||
    size.width * size.height > MAX_LOGO_PIXELS
  ) {
    throw new Error('Logo-Abmessungen liegen außerhalb der zulässigen Grenzen.')
  }
  if (input.width !== size.width || input.height !== size.height) {
    throw new Error('Die Logo-Abmessungen stimmen nicht mit den Bilddaten überein.')
  }
  return { mimeType, base64: input.base64, width: size.width, height: size.height }
}

export function validateBrandProfile(value: unknown): BrandProfile {
  const input = record(value)
  if (input.version !== BRAND_SCHEMA_VERSION) {
    throw new Error('Nicht unterstützte CI-Profilversion: ' + String(input.version))
  }
  const allowed = new Set([
    'version',
    'companyName',
    'primaryColor',
    'accentColor',
    'textColor',
    'website',
    'contact',
    'defaultAuthor',
    'footerNote',
    'logo',
  ])
  if (Object.keys(input).some((key) => !allowed.has(key))) {
    throw new Error('Das CI-Profil enthält unbekannte Felder.')
  }
  const companyName = stringField(input.companyName, 'Firmenname', 160, true)!
  const primaryColor = color(input.primaryColor, 'Primärfarbe')
  const accentColor = color(input.accentColor, 'Akzentfarbe')
  const textColor = input.textColor === undefined ? undefined : color(input.textColor, 'Textfarbe')
  const website = stringField(input.website, 'Website', 200)
  if (website && (!/^https:\/\/[a-z0-9.-]+(?:\/[^\s]*)?$/i.test(website) || website.includes('..'))) {
    throw new Error('Die Website muss eine gültige HTTPS-Adresse sein.')
  }
  const contact = stringField(input.contact, 'Kontakt', 240)
  const defaultAuthor = stringField(input.defaultAuthor, 'Standardverfasser', 120)
  const footerNote = stringField(input.footerNote, 'Fußzeile', 240)
  const logo = input.logo === undefined ? undefined : validateBrandLogo(input.logo)
  return {
    version: BRAND_SCHEMA_VERSION,
    companyName,
    primaryColor,
    accentColor,
    ...(textColor ? { textColor } : {}),
    ...(website ? { website } : {}),
    ...(contact ? { contact } : {}),
    ...(defaultAuthor ? { defaultAuthor } : {}),
    ...(footerNote ? { footerNote } : {}),
    ...(logo ? { logo } : {}),
  }
}

export function parseBrandProfileJson(json: string): BrandProfile {
  if (new TextEncoder().encode(json).byteLength > MAX_PROFILE_JSON_BYTES) {
    throw new Error('CI-Profildatei ist zu groß (maximal 3 MB).')
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('Die Datei enthält kein gültiges JSON.')
  }
  return validateBrandProfile(parsed)
}

export function hexToRgb(value: string): { red: number; green: number; blue: number } {
  return {
    red: parseInt(value.slice(1, 3), 16) / 255,
    green: parseInt(value.slice(3, 5), 16) / 255,
    blue: parseInt(value.slice(5, 7), 16) / 255,
  }
}

function linear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const c = hexToRgb(hex)
    return 0.2126 * linear(c.red) + 0.7152 * linear(c.green) + 0.0722 * linear(c.blue)
  }
  const l1 = luminance(a),
    l2 = luminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

export function readableInkOn(hex: string): '#FFFFFF' | '#172033' {
  return contrastRatio(hex, '#FFFFFF') >= 4.5 ? '#FFFFFF' : '#172033'
}
