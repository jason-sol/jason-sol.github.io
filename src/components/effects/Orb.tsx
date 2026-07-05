import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { usePausableRaf } from '../../hooks/usePausableRaf'
import { orbEase, orbLerp, orbSegment } from '../../lib/orbPath'
import styles from './Orb.module.css'

type Shape = 'circle' | 'diamond' | 'square'
type Side = 'left' | 'right' | 'center'

interface WaypointDef {
  id: string
  side: Side
  offset: number
  size: number
  shape: Shape
  end?: boolean
}

type AnchorElement = HTMLElement | SVGElement

interface ResolvedWaypoint extends WaypointDef {
  el: AnchorElement
}

interface Point {
  x: number
  y: number
}

const WAYPOINT_DEFS: WaypointDef[] = [
  { id: 'hero-name', side: 'right', offset: 44, size: 18, shape: 'circle' },
  { id: 'p1', side: 'left', offset: 32, size: 14, shape: 'circle' },
  { id: 'p2', side: 'left', offset: 32, size: 14, shape: 'diamond' },
  { id: 'p3', side: 'left', offset: 32, size: 14, shape: 'circle' },
  { id: 'about', side: 'center', offset: 0, size: 13, shape: 'diamond' },
  { id: 'stack', side: 'left', offset: 32, size: 14, shape: 'square' },
  { id: 'experience', side: 'center', offset: 0, size: 12, shape: 'circle' },
  { id: 'projects', side: 'left', offset: 32, size: 14, shape: 'square' },
  { id: 'edu', side: 'left', offset: 32, size: 14, shape: 'circle' },
  { id: 'end', side: 'center', offset: 0, size: 24, shape: 'circle', end: true },
]

// Hero phases don't move like normal document flow, so their Waypoints are placed
// as a fraction of the sticky scroll story's travel distance rather than by rect.
const HERO_PHASE_RATIO: Record<string, number> = {
  'hero-name': 0,
  p1: 0.3,
  p2: 0.555,
  p3: 0.81,
}

const REMEASURE_DELAY_MS = 1200
const FOLLOW_SMOOTHING = 0.16
const GHOST_FOLLOW = 0.3
const GHOST_COUNT = 3
const ZONE_VH_RATIO = 0.65
const PERIOD_NEAR_PX = 26

function radiusFor(shape: Shape): string {
  if (shape === 'circle') return '50%'
  if (shape === 'diamond') return '2px'
  return '4px'
}

function rotationFor(shape: Shape): number {
  return shape === 'diamond' ? 45 : 0
}

function posOf(def: ResolvedWaypoint): Point {
  const rect = def.el.getBoundingClientRect()
  const cy = rect.top + rect.height / 2
  if (def.side === 'left') return { x: rect.left - def.offset, y: cy }
  if (def.side === 'right') return { x: rect.right + def.offset, y: cy }
  return { x: rect.left + rect.width / 2, y: cy }
}

interface OrbProps {
  /** Set once the Intro overlay has finished, to trigger a Waypoint re-measure and start the loop. */
  introDone: boolean
}

interface OrbAnimState {
  resolved: ResolvedWaypoint[]
  ats: number[]
  periodDef: ResolvedWaypoint
  px: number
  py: number
  prevPx: number
  prevPy: number
  ghosts: Point[]
}

/** Accent-colored shape that travels between page Waypoints as the user scrolls. */
export function Orb({ introDone }: OrbProps) {
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([])
  const measureRef = useRef<() => void>(() => {})
  const animRef = useRef<OrbAnimState | null>(null)

  useEffect(() => {
    if (reduced) return

    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!wrap || !inner) return

    const resolved: ResolvedWaypoint[] = WAYPOINT_DEFS.flatMap((def) => {
      const el = document.querySelector<AnchorElement>(`[data-orb-anchor="${def.id}"]`)
      return el ? [{ ...def, el }] : []
    })
    if (resolved.length < 2) return

    // The orb replaces the Experience timeline's own dot while it's active.
    const experienceDot = resolved.find((def) => def.id === 'experience')?.el
    const prevDotOpacity = experienceDot?.style.opacity ?? ''
    if (experienceDot) experienceDot.style.opacity = '0'

    const periodDef = resolved[resolved.length - 1]
    const prevPeriodOpacity = periodDef.el.style.opacity ?? ''

    // Remounted Sections (e.g. Hero's entrance replay) detach anchor nodes;
    // every re-measure heals stale references before positions are read.
    const reresolveDetached = () => {
      resolved.forEach((def) => {
        if (def.el.isConnected) return
        const el = document.querySelector<AnchorElement>(`[data-orb-anchor="${def.id}"]`)
        if (!el) return
        def.el = el
        if (def.id === 'experience') el.style.opacity = '0'
      })
    }

    const measure = () => {
      reresolveDetached()
      const vh = window.innerHeight
      const scrollY = window.scrollY
      const heroEl = document.getElementById('top')
      const heroRect = heroEl?.getBoundingClientRect() ?? { top: 0, height: 0 }
      const heroTop = heroRect.top + scrollY
      const heroH = Math.max(1, heroRect.height - vh)
      const ats = resolved.map((def) => {
        const ratio = HERO_PHASE_RATIO[def.id]
        if (ratio !== undefined) return heroTop + heroH * ratio
        const rect = def.el.getBoundingClientRect()
        return Math.max(heroTop + heroH + 10, rect.top + scrollY - vh * 0.55)
      })
      if (animRef.current) animRef.current.ats = ats
    }
    measureRef.current = measure

    const start = posOf(resolved[0])
    animRef.current = {
      resolved,
      ats: [],
      periodDef,
      px: start.x,
      py: start.y,
      prevPx: start.x,
      prevPy: start.y,
      ghosts: Array.from({ length: GHOST_COUNT }, () => ({ x: start.x, y: start.y })),
    }
    measure()

    const remeasureTimer = setTimeout(measure, REMEASURE_DELAY_MS)
    window.addEventListener('resize', measure)

    return () => {
      clearTimeout(remeasureTimer)
      window.removeEventListener('resize', measure)
      animRef.current = null
      // Restore against the current elements — re-measures may have swapped them.
      const currentDot = resolved.find((def) => def.id === 'experience')?.el
      if (currentDot) currentDot.style.opacity = prevDotOpacity
      if (periodDef.end) periodDef.el.style.opacity = prevPeriodOpacity
    }
  }, [reduced])

  const loop = () => {
    const state = animRef.current
    const wrap = wrapRef.current
    const inner = innerRef.current
    if (!state || !wrap || !inner) return

    const scrollY = window.scrollY
    const vh = window.innerHeight
    const i = orbSegment(scrollY, state.ats)
    const defA = state.resolved[i]
    const defB = state.resolved[i + 1]
    // Read up front, before the style writes below force a layout otherwise.
    const periodPos = posOf(state.periodDef)

    let tx: number
    let ty: number
    let size: number
    let spin = 0
    let shape = defA.shape

    if (!defB) {
      const p = posOf(defA)
      tx = p.x
      ty = p.y
      size = defA.size
    } else {
      const zone = Math.min(vh * ZONE_VH_RATIO, Math.max(1, state.ats[i + 1] - state.ats[i]))
      const u = (scrollY - (state.ats[i + 1] - zone)) / zone
      const eased = orbEase(u)
      const pa = posOf(defA)
      const pb = posOf(defB)
      tx = orbLerp(pa.x, pb.x, u, i)
      ty = pa.y + (pb.y - pa.y) * eased
      size = defA.size + (defB.size - defA.size) * eased
      spin = eased * 180 * (i % 2 ? -1 : 1)
      if (eased > 0.5) shape = defB.shape
    }

    state.px += (tx - state.px) * FOLLOW_SMOOTHING
    state.py += (ty - state.py) * FOLLOW_SMOOTHING
    const vx = state.px - state.prevPx
    const vy = state.py - state.prevPy
    state.prevPx = state.px
    state.prevPy = state.py
    const speed = Math.hypot(vx, vy)
    const stretch = Math.min(speed * 0.016, 0.42)
    const angle = speed > 0.4 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0
    const idle = speed < 0.4 ? 1 + Math.sin(performance.now() * 0.004) * 0.07 : 1

    wrap.style.transform = `translate(${state.px - size / 2}px,${state.py - size / 2}px) rotate(${angle}deg) scale(${(1 + stretch) * idle},${(1 - stretch * 0.65) * idle})`
    inner.style.width = `${size}px`
    inner.style.height = `${size}px`
    inner.style.borderRadius = radiusFor(shape)
    inner.style.transform = `rotate(${spin + rotationFor(shape) - angle}deg)`

    let lx = state.px
    let ly = state.py
    state.ghosts.forEach((ghost, index) => {
      ghost.x += (lx - ghost.x) * GHOST_FOLLOW
      ghost.y += (ly - ghost.y) * GHOST_FOLLOW
      lx = ghost.x
      ly = ghost.y
      const el = ghostRefs.current[index]
      if (!el) return
      const ghostSize = size * (0.55 - index * 0.14)
      el.style.width = `${ghostSize}px`
      el.style.height = `${ghostSize}px`
      el.style.transform = `translate(${ghost.x - ghostSize / 2}px,${ghost.y - ghostSize / 2}px)`
      el.style.opacity = String(Math.min(speed * 0.05, 0.55) * (1 - index * 0.28))
    })

    // The orb "becomes" the closing period once it settles near the final Waypoint.
    if (state.periodDef.end) {
      const near = Boolean(defA.end) && Math.hypot(state.px - periodPos.x, state.py - periodPos.y) < PERIOD_NEAR_PX
      state.periodDef.el.style.opacity = near ? '0' : '1'
    }
  }

  // The orb sits beneath the Intro overlay for its first ~3.3s; no point animating it unseen.
  usePausableRaf(loop, !reduced && introDone)

  useEffect(() => {
    if (introDone) measureRef.current()
  }, [introDone])

  if (reduced) return null

  return (
    <div data-orb-holder className={styles.holder} aria-hidden="true">
      {Array.from({ length: GHOST_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            ghostRefs.current[i] = el
          }}
          className={styles.ghost}
        />
      ))}
      <div ref={wrapRef} className={styles.wrap}>
        <div ref={innerRef} className={styles.inner} />
      </div>
    </div>
  )
}
