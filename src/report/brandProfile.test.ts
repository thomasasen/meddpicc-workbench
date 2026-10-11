import { describe, expect, it } from 'vitest'
import {
  BRAND_SCHEMA_VERSION,
  contrastRatio,
  parseBrandProfileJson,
  validateBrandLogo,
  validateBrandProfile,
} from './brandProfile'

export const WIDE_PNG =
  'iVBORw0KGgoAAAANSUhEUgAAAKAAAAAkCAYAAAAO7jHjAAAAmklEQVR42u3b0Q1AMBSG0bqbWMgqZrGKhYzCAkIl2ityzrOn5svfFy0FAACgo6H2w3FadsdFrW2dh1cCFB4tQwzx0dJdQyE+MiMM8ZEZYTgaMoX1I3MFLSDfWkAQIAIEASJAECACBAEiQBAgAgQB8r8Aa//lh6fO2rKAfO8KtoL0WL/LBRQhreO7vYJFSMv4SvEwnaTwAAAAUhw4/SwyqIE0/AAAAABJRU5ErkJggg=='
export const TALL_JPEG =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCAClAC0DASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAID/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqgDFYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//Z'

export const brandedDark = () =>
  validateBrandProfile({
    version: BRAND_SCHEMA_VERSION,
    companyName: 'Musterindustrie GmbH',
    primaryColor: '#172B49',
    accentColor: '#2764A8',
    logo: { mimeType: 'image/png', base64: WIDE_PNG, width: 160, height: 36 },
  })
export const brandedLight = () =>
  validateBrandProfile({
    version: BRAND_SCHEMA_VERSION,
    companyName: 'Helles Musterunternehmen mit einem außerordentlich langen Firmennamen GmbH',
    primaryColor: '#F6EDD4',
    accentColor: '#FFDD22',
    defaultAuthor: 'Beispielberatung',
    website: 'https://beispiel.de',
    contact: 'kontakt@beispiel.de',
    textColor: '#5B1C6A',
    footerNote: 'Nur für den vereinbarten Zweck',
    logo: { mimeType: 'image/jpeg', base64: TALL_JPEG, width: 45, height: 165 },
  })

describe('CI-Profil-Vertrag, Sicherheit und Kontrast', () => {
  it('akzeptiert breite PNG- und hohe JPEG-Logos mit korrekten Signaturen', () => {
    expect(validateBrandLogo(brandedDark().logo).width).toBe(160)
    expect(validateBrandLogo(brandedLight().logo).height).toBe(165)
  })
  it('verwirft unbekannte Versionen, Felder, Farben und Sonderzeichen', () => {
    const profile = brandedDark()
    expect(() => validateBrandProfile({ ...profile, version: 2 })).toThrow('Profilversion')
    expect(() => validateBrandProfile({ ...profile, customer: 'Geheim' })).toThrow('unbekannte Felder')
    expect(() => validateBrandProfile({ ...profile, primaryColor: 'url(javascript:evil)' })).toThrow('Hex')
    expect(() => validateBrandProfile({ ...profile, companyName: '<script>☠</script>' })).toThrow('Sonderzeichen')
    expect(() => validateBrandProfile({ ...profile, website: 'javascript:alert(1)' })).toThrow('HTTPS')
  })
  it('lehnt beschädigte und übergroße Logos ab, ohne einen bestehenden Datensatz zu mutieren', () => {
    const profile = brandedDark()
    expect(() => validateBrandLogo({ ...profile.logo, base64: 'PGh0bWw+' })).toThrow('PNG')
    expect(() => validateBrandLogo({ ...profile.logo, width: 99 })).toThrow('Abmessungen')
    expect(() => validateBrandLogo({ ...profile.logo, base64: 'A'.repeat(3_000_000) })).toThrow('große')
    expect(profile.logo?.width).toBe(160)
  })
  it('validiert JSON vor Verwendung und lässt keine zusätzlichen Projektfelder zu', () => {
    expect(parseBrandProfileJson(JSON.stringify(brandedDark())).companyName).toBe('Musterindustrie GmbH')
    expect(() => parseBrandProfileJson('{ kaputt }')).toThrow('JSON')
    expect(() => parseBrandProfileJson(JSON.stringify({ ...brandedLight(), project: 'Intern' }))).toThrow()
  })
  it('erkennt kritische Farbkombinationen und wählt lesbare Schrift', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeGreaterThan(20)
    expect(contrastRatio('#F6EDD4', '#FFFFFF')).toBeLessThan(4.5)
  })
})
