import { useEffect, useState } from 'react'
import { easeOutCubic } from '../lib/easing'

const DURATION_MS = 1400

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

/** Counts from 0 to `target` over 1400ms with an ease-out cubic curve, starting when `active`. */
export function useCountUp(target: number, active = true): number {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0))

  useEffect(() => {
    if (!active || prefersReducedMotion()) return

    let rafId: number
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / DURATION_MS)
      setValue(Math.round(target * easeOutCubic(p)))
      if (p < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(rafId)
  }, [target, active])

  return value
}
