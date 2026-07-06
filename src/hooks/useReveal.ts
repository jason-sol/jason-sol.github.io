import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useMediaQuery'

export interface UseRevealResult<T extends Element> {
  ref: React.RefObject<T | null>
  visible: boolean
}

/** Flips `visible` once the ref's element enters the viewport, after an optional delay (ms). */
export function useReveal<T extends Element = HTMLDivElement>(delay = 0): UseRevealResult<T> {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (reduced) return

    const el = ref.current
    if (!el) return

    let timerId: ReturnType<typeof setTimeout> | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          if (delay > 0) {
            timerId = setTimeout(() => setTriggered(true), delay)
          } else {
            setTriggered(true)
          }
        })
      },
      { threshold: 0.15 },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (timerId !== null) clearTimeout(timerId)
    }
  }, [delay, reduced])

  return { ref, visible: triggered || reduced }
}
