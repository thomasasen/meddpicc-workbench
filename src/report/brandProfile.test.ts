import { describe, expect, it } from 'vitest'
import {
  BRAND_SCHEMA_VERSION,
  contrastRatio,
  parseBrandProfileJson,
  validateBrandLogo,
  validateBrandProfile,
} from './brandProfile'

export const WIDE_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAKAAAAAkCAYAAAAO7jHjAAAAfUlEQVR42u3csQ2AIBBAUTFMo2thYVgHY8FczCMjmFhAYt6rr7r8HB1hS+VZYJLVChAgAgQBIkAQIAKEEeLbQKv5tia+2I/rdAHxBIMAESAIEAGCABEgCBABIkAQIAIEASJAECACBAEiQBAg/xN8ToQLiABBgAgQBIgAYYQONr0Ii/7q2EkAAAAASUVORK5CYII='
export const TALL_JPEG = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAClAC0DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6ArJ/4Srw9/0HtM/8C4/8a1q+Ua68NQVa93scmIrujay3Ppj/AISrw9/0HtM/8C4/8aP+Eq8Pf9B7TP8AwLj/AMa+Z6K6/qEe5y/Xpdj6etfEGjX1ytvaatY3E752xxXCOzYGTgA56A1oV8+/DH/ko2l/9tf/AEU9fQVcOIoqjLlTO3D1XVjzNBXyjX1dXyjXXgPtfL9Tkx/2fn+gUUUV6h5h1nwx/wCSjaX/ANtf/RT19BV8+/DH/ko2l/8AbX/0U9fQVePjv4i9P8z2MD/Dfr/kFfKNfV1fKNaYD7Xy/Uyx/wBn5/oFFFFeoeYdZ8Mf+SjaX/21/wDRT19BV8+/DH/ko2l/9tf/AEU9fQVePjv4i9P8z2MD/Dfr/kFfKNfV1fKNaYD7Xy/Uyx/2fn+gUUUV6h5h1nwx/wCSjaX/ANtf/RT19BV8+/DH/ko2l/9tf/AEU9fQVePjv4i9P8z2MD/Dfr/kFfKNfV1fKNaYD7Xy/Uyx/2fn+gUUUV6h5h1nwx/wCSjaX/21/wDRT19BV8+/DH/ko2l/9tf/AEU9fQVePjv4i9P8z2MD/Dfr/kFfKNfV1fKNaYD7Xy/Uyx/wBn5/oFFFFeoeYdZ8Mf+SjaX/21/wDRT19BV8+/DH/ko2l/9tf/AEU9fQVePjv4i9P8z2MD/Dfr/kFfKNfV1fKNaYD7Xy/Uyx/2fn+gUUUV6h5h1nwx/wCSjaX/ANtf/RT19BV8+/DH/ko2l/9tf/AEU9fQVePjv4i9P8z2MD/Dfr/kFfKNfV1eUf8KR/6mD/AMk//s6MHVhT5udhi6U6nLyI8oor1f8A4Uj/ANTB/wCSf/2dH/Ckf+pg/wDJP/7Ou763R7/mcP1St2/I5T4Y/wDJRtL/AO2v/op6+gq8+8MfCz/hHPEdrqv9sfafs+/939m2btyFeu84656V6DXm4upGpNOL6Ho4WnKnBqS6hRRRXIdYUUUUAFFFFAH/2Q=='

export const brandedDark = () => validateBrandProfile({
  version: BRAND_SCHEMA_VERSION,
  companyName: 'Musterindustrie GmbH',
  primaryColor: '#172B49', accentColor: '#2764A8',
  logo: { mimeType: 'image/png', base64: WIDE_PNG, width: 160, height: 36 },
})
export const brandedLight = () => validateBrandProfile({
  version: BRAND_SCHEMA_VERSION,
  companyName: 'Helles Musterunternehmen mit einem außerordentlich langen Firmennamen GmbH',
  primaryColor: '#F6EDD4', accentColor: '#FFDD22',
  defaultAuthor: 'Beispielberatung',
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
