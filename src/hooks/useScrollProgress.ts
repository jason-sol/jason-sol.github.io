import { useState } from 'react'
import type { RefObject } from 'react'
import { clamp } from '../lib/math'
import { useScrollFrame } from './useScrollFrame'

/** Progress (0..1) of the viewport through a taller-than-viewport container. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)

  useScrollFrame(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const total = rect.height - window.innerHeight
    setProgress(total > 0 ? clamp(-rect.top / total, 0, 1) : 0)
  })

  return progress
}
