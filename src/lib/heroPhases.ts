export interface PhaseStyle {
  opacity: number
  translateY: number
  scale: number
  blur: number
}

const ranges: { in: [number, number]; out: [number, number] }[] = [
  { in: [0, 0], out: [0.2, 0.29] },
  { in: [0.27, 0.35], out: [0.46, 0.54] },
  { in: [0.52, 0.6], out: [0.71, 0.79] },
  { in: [0.77, 0.85], out: [2, 3] },
]

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const sm = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1)

export function phaseStyle(i: number, p: number): PhaseStyle {
  const rg = ranges[i]
  const fin = i === 0 ? 1 : sm(p, rg.in[0], rg.in[1])
  const fout = sm(p, rg.out[0], rg.out[1])
  const opacity = fin * (1 - fout)
  const translateY = (1 - fin) * 70 - fout * 70
  const scale = i === 0 ? 1 + fout * 0.12 : 1
  const blur = ((1 - fin) + fout) * 14
  return { opacity, translateY, scale, blur }
}

export function activePhaseIndex(p: number): number {
  if (p < 0.255) return 0
  if (p < 0.505) return 1
  if (p < 0.755) return 2
  return 3
}
