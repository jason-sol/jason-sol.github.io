import { useEffect, useState } from 'react'
import { easeOutCubic } from '../lib/easing'
import { useReducedMotion } from './useMediaQuery'

const DURATION_MS = 1400

/** Counts from 0 to `target` over 1400ms with an ease-out cubic curve, starting when `active`. */
export function useCountUp(target: number, active = true): number {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active || reduced) return

    let rafId: number
    const t0 = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / DURATION_MS)
      setValue(Math.round(target * easeOutCubic(p)))
      if (p < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(rafId)
  }, [target, active, reduced])

  return reduced ? target : value
}
