import { linearStep } from './math'

export interface PhaseStyle {
  opacity: number
  translateY: number
  scale: number
  blur: number
}

// Phase 3's out-range starts past p=1, so it never fades out within the scroll.
// This table is the single source of Hero phase timing: the anchor ratios (Orb
// Waypoints) and the active-phase thresholds (progress rail) both derive from it.
const ranges: { in: [number, number]; out: [number, number] }[] = [
  { in: [0, 0], out: [0.2, 0.29] },
  { in: [0.27, 0.35], out: [0.46, 0.54] },
  { in: [0.52, 0.6], out: [0.71, 0.79] },
  { in: [0.77, 0.85], out: [2, 3] },
]

/** Scroll-story ratio each phase is anchored at: the midpoint of its fade-in window. */
export const phaseAnchorRatios: readonly number[] = ranges.map(({ in: [start, end] }) => (start + end) / 2)

export function phaseStyle(i: number, p: number): PhaseStyle {
  const range = ranges[i]
  const fadeIn = i === 0 ? 1 : linearStep(p, range.in[0], range.in[1])
  const fadeOut = linearStep(p, range.out[0], range.out[1])
  const opacity = fadeIn * (1 - fadeOut)
  const translateY = (1 - fadeIn) * 70 - fadeOut * 70
  const scale = i === 0 ? 1 + fadeOut * 0.12 : 1
  const blur = (1 - fadeIn + fadeOut) * 14
  return { opacity, translateY, scale, blur }
}

/** Index of the phase active at progress `p`: switches at the midpoint of each crossfade window. */
export function activePhaseIndex(p: number): number {
  for (let i = ranges.length - 1; i >= 1; i--) {
    const crossfadeMidpoint = (ranges[i - 1].out[0] + ranges[i].in[1]) / 2
    if (p >= crossfadeMidpoint) return i
  }
  return 0
}

export function hintOpacity(p: number): number {
  return 1 - linearStep(p, 0.02, 0.1)
}
