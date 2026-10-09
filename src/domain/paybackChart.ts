/** Round chart limits to readable EUR values without changing the underlying financial model. */
export function paybackAxisBounds(values: readonly number[]): { min: number; max: number } {
  if (!values.length || values.some((value) => !Number.isFinite(value))) {
    throw new Error('Chart benötigt endliche Monatswerte.')
  }
  const lowest = Math.min(0, ...values)
  const highest = Math.max(0, ...values)
  const span = Math.max(1, highest - lowest)
  const rawStep = span / 7
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step = ([1, 2, 2.5, 5, 10].find((n) => n * magnitude >= rawStep) ?? 10) * magnitude
  const padding = 0.08 * span
  return {
    min: Math.floor((lowest - padding) / step) * step,
    max: Math.ceil((highest + padding) / step) * step,
  }
}
