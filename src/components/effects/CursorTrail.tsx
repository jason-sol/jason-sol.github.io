import { useEffect, useRef } from 'react'
import { usePrefersFinePointer, useReducedMotion } from '../../hooks/useMediaQuery'
import styles from './CursorTrail.module.css'

const POINT_LIFE_MS = 650
const MOVE_THRESHOLD_PX = 3
const MAX_DPR = 2

interface TrailPoint {
  x: number
  y: number
  t: number
}

/** Fading accent stroke that follows fine-pointer movement across the whole page. */
export function CursorTrail() {
  const reduced = useReducedMotion()
  const fine = usePrefersFinePointer()
  const active = fine && !reduced
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const fit = () => {
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()
    window.addEventListener('resize', fit)

    const points: TrailPoint[] = []
    const handlePointerMove = (event: PointerEvent) => {
      const last = points[points.length - 1]
      if (!last || Math.hypot(event.clientX - last.x, event.clientY - last.y) > MOVE_THRESHOLD_PX) {
        points.push({ x: event.clientX, y: event.clientY, t: performance.now() })
      }
    }
    window.addEventListener('pointermove', handlePointerMove)

    let rafId: number | null = null
    const loop = () => {
      const now = performance.now()
      while (points.length && now - points[0].t > POINT_LIFE_MS) points.shift()
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (points.length > 1) {
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#57e6e0'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.shadowColor = accent
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1]
          const b = points[i]
          const age = (now - b.t) / POINT_LIFE_MS
          const alpha = Math.max(0, 1 - age)
          ctx.strokeStyle = accent
          ctx.globalAlpha = alpha * 0.9
          ctx.lineWidth = 1 + alpha * 2.2
          ctx.shadowBlur = 12 * alpha
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          ctx.quadraticCurveTo(a.x, a.y, mx, my)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
      }

      rafId = requestAnimationFrame(loop)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      } else if (rafId === null) {
        rafId = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    rafId = requestAnimationFrame(loop)

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', fit)
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [active])

  if (!active) return null

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
