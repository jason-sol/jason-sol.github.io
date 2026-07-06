import { useEffect, useRef } from 'react'

/**
 * Runs `onFrame` once per animation frame in response to window scroll/resize
 * (rAF-throttled, passive), plus once on mount. Always calls the latest closure.
 */
export function useScrollFrame(onFrame: () => void): void {
  const onFrameRef = useRef(onFrame)

  useEffect(() => {
    onFrameRef.current = onFrame
  })

  useEffect(() => {
    let ticking = false
    let rafId: number | null = null

    const schedule = () => {
      if (ticking) return
      ticking = true
      rafId = requestAnimationFrame(() => {
        ticking = false
        onFrameRef.current()
      })
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])
}
