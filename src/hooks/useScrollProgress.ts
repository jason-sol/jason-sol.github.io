import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { clamp } from '../lib/math'

export function useScrollProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)
  const tickingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const compute = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      setProgress(total > 0 ? clamp(-rect.top / total, 0, 1) : 0)
    }

    const onScrollOrResize = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      rafIdRef.current = requestAnimationFrame(() => {
        tickingRef.current = false
        compute()
      })
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    onScrollOrResize()

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
    }
  }, [ref])

  return progress
}
