import { useEffect, useRef } from 'react'

/**
 * Runs `callback` on every animation frame while `active`, pausing when the
 * tab is hidden and resuming when it becomes visible again.
 */
export function usePausableRaf(callback: () => void, active: boolean): void {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (!active) return

    let rafId: number | null = null
    const tick = () => {
      callbackRef.current()
      rafId = requestAnimationFrame(tick)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      } else if (rafId === null) {
        rafId = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    rafId = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [active])
}
