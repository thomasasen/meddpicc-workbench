/**
 * Einheitliche Feldprüfung für die lokal berechneten Microtools.
 * Nur fachlich erforderliche Eingaben erhalten einen Fehlerzustand.
 * Leere optionale Eingaben sind ausdrücklich gültig.
 */
export const MAX_TOOL_AMOUNT = 1_000_000_000_000

export function requiredText(value: string): string | undefined {
  return value.trim() ? undefined : 'Für diesen Arbeitsschritt erforderlich.'
}

export function requiredAmount(value: unknown): string | undefined {
  if (value === '' || value === null || value === undefined) return 'Für die Berechnung erforderlich.'
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > MAX_TOOL_AMOUNT)
    return 'Bitte eine gültige, nicht negative Zahl eingeben.'
  return undefined
}

export function optionalAmount(value: unknown): string | undefined {
  return value === null || value === '' || value === undefined ? undefined : requiredAmount(value)
}

export function requiredMonth(value: unknown, min: number, max: number): string | undefined {
  if (value === '' || value === null || value === undefined) return 'Für die Berechnung erforderlich.'
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max)
    return `Bitte einen ganzen Monat zwischen ${min} und ${max} eingeben.`
  return undefined
}

export function requiredDate(value: string): string | undefined {
  if (!value) return 'Für die Rückwärtsberechnung erforderlich.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Bitte ein gültiges Datum eingeben.'
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
    ? undefined
    : 'Bitte ein gültiges Datum eingeben.'
}
