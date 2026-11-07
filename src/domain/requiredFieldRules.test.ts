import { describe, expect, it } from 'vitest'
import { optionalAmount, requiredAmount, requiredDate, requiredMonth, requiredText } from './requiredFieldRules'

describe('kontextabhängige Pflichtfelder', () => {
  it('unterscheidet eine fehlende Angabe von einer gültigen Null', () => {
    expect(requiredText('   ')).toBeDefined()
    expect(requiredText('  Vorhaben  ')).toBeUndefined()
    expect(requiredAmount('')).toBeDefined()
    expect(requiredAmount(null)).toBeDefined()
    expect(requiredAmount(0)).toBeUndefined()
    expect(requiredAmount(1_000_000_000_001)).toBeDefined()
    expect(optionalAmount(null)).toBeUndefined()
    expect(optionalAmount('')).toBeUndefined()
    expect(optionalAmount(-1)).toBeDefined()
  })

  it('prüft ganze Monate mit den jeweiligen Fachgrenzen', () => {
    expect(requiredMonth('', 1, 60)).toBeDefined()
    expect(requiredMonth(0, 1, 60)).toBeDefined()
    expect(requiredMonth(1, 1, 60)).toBeUndefined()
    expect(requiredMonth(60, 1, 60)).toBeUndefined()
    expect(requiredMonth(3.5, 1, 60)).toBeDefined()
  })

  it('prüft echte ISO-Kalendertage statt nur das Datumsmuster', () => {
    expect(requiredDate('')).toBeDefined()
    expect(requiredDate('2026-02-29')).toBeDefined()
    expect(requiredDate('2024-02-29')).toBeUndefined()
    expect(requiredDate('2026-11-07')).toBeUndefined()
    expect(requiredDate('07.11.2026')).toBeDefined()
  })
})
