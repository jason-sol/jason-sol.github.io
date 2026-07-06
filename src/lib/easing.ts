import { clamp } from './math'

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

/** Cubic ease-in-out, clamping `t` to 0..1. */
export function easeInOutCubic(t: number): number {
  const u = clamp(t, 0, 1)
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2
}

/** Quadratic ease-in-out, clamping `t` to 0..1. */
export function easeInOutQuad(t: number): number {
  const u = clamp(t, 0, 1)
  return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
}
