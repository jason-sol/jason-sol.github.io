import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

export interface UseRevealResult<T extends Element> {
  ref: React.RefObject<T | null>
  visible: boolean
}

/** Flips `visible` once the ref's element enters the viewport, after an optional delay (ms). */
export function useReveal<T extends Element = HTMLDivElement>(delay = 0): UseRevealResult<T> {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return

    const el = ref.current
    if (!el) return

    let timerId: ReturnType<typeof setTimeout> | null = null
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          observer.unobserve(entry.target)
          if (delay > 0) {
            timerId = setTimeout(() => setVisible(true), delay)
          } else {
            setVisible(true)
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
  }, [delay])

  return { ref, visible }
}
