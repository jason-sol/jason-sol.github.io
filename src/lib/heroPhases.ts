import { linearStep } from './math'

export interface PhaseStyle {
  opacity: number
  translateY: number
  scale: number
  blur: number
}

// Phase 3's out-range starts past p=1, so it never fades out within the scroll.
const ranges: { in: [number, number]; out: [number, number] }[] = [
  { in: [0, 0], out: [0.2, 0.29] },
  { in: [0.27, 0.35], out: [0.46, 0.54] },
  { in: [0.52, 0.6], out: [0.71, 0.79] },
  { in: [0.77, 0.85], out: [2, 3] },
]

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

export function activePhaseIndex(p: number): number {
  if (p < 0.255) return 0
  if (p < 0.505) return 1
  if (p < 0.755) return 2
  return 3
}

export function hintOpacity(p: number): number {
  return 1 - linearStep(p, 0.02, 0.1)
}
