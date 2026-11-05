/**
 * Critically damped positional spring for direct-manipulation drop settling.
 * Solves x'' + 2ωx' + ω²x = 0 at discrete display intervals.
 * x: signed visual offset (px), v: signed release velocity (px/s).
 * No overshoot when released at rest; release velocity may produce a brief
 * physical reversal when the user flicks in the opposite direction.
 */
export function criticallyDampedOffsets(
  initialOffset: number,
  initialVelocity = 0,
  durationSeconds = 0.54,
  frames = 32,
  responseSeconds = 0.34,
): number[] {
  const offset = Number.isFinite(initialOffset) ? initialOffset : 0
  const velocity = Number.isFinite(initialVelocity) ? Math.max(-900, Math.min(900, initialVelocity)) : 0
  const count = Math.max(2, Math.min(120, Math.round(frames)))
  const duration = Math.max(0.2, Math.min(1, durationSeconds))
  const response = Math.max(0.2, Math.min(0.7, responseSeconds))
  const omega = 4.6 / response

  return Array.from({ length: count + 1 }, (_, index) => {
    if (index === count) return 0
    const t = (index / count) * duration
    return (offset + (velocity + omega * offset) * t) * Math.exp(-omega * t)
  })
}
