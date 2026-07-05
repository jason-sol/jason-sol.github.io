import { clamp } from './math'

const SWING_PX = 70

/** Index of the last Waypoint at or before `scrollY`; 0 if none qualify. */
export function orbSegment(scrollY: number, waypointYs: number[]): number {
  let index = 0
  for (let k = 0; k < waypointYs.length; k++) {
    if (waypointYs[k] <= scrollY) index = k
  }
  return index
}

/** Cubic ease-in-out, clamping `u` to 0..1. */
export function orbEase(u: number): number {
  const t = clamp(u, 0, 1)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Eased interpolation between two Waypoint coordinates, plus a sine-shaped
 * lateral swing whose direction alternates with the segment's parity.
 */
export function orbLerp(a: number, b: number, u: number, segmentIndex: number): number {
  const t = clamp(u, 0, 1)
  const eased = orbEase(t)
  const direction = segmentIndex % 2 === 0 ? 1 : -1
  return a + (b - a) * eased + Math.sin(t * Math.PI) * SWING_PX * direction
}
