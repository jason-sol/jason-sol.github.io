import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import styles from './IntroOverlay.module.css'

const AUTO_FINISH_MS = 3340
const NAME = 'JASON SOLANKI'
const DOT_GAP = 62
const COLUMN_COUNT = 5

interface IntroOverlayProps {
  onDone: () => void
}

/** Skippable first-load Effect: counter, letter assembly, column wipe. */
export function IntroOverlay({ onDone }: IntroOverlayProps) {
  const reduced = useReducedMotion()
  const hasHash = typeof window !== 'undefined' && window.location.hash !== ''
  const skip = reduced || hasHash

  const dotsHostRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLDivElement>(null)
  const colRefs = useRef<(HTMLDivElement | null)[]>([])
  const finishRef = useRef<() => void>(() => {})
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    if (skip) {
      onDoneRef.current()
      return
    }

    const dotsHost = dotsHostRef.current
    const nameEl = nameRef.current
    if (!dotsHost || !nameEl) return

    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    const anims: Animation[] = []
    const dots: HTMLSpanElement[] = []

    /* dot-grid ripple, staggered from center */
    const W = window.innerWidth
    const H = window.innerHeight
    const cx = W / 2
    const cy = H / 2
    const maxD = Math.hypot(cx, cy) || 1
    for (let y = DOT_GAP / 2; y < H; y += DOT_GAP) {
      for (let x = DOT_GAP / 2; x < W; x += DOT_GAP) {
        const dot = document.createElement('span')
        dot.className = styles.dot
        dot.style.left = `${x}px`
        dot.style.top = `${y}px`
        dotsHost.appendChild(dot)
        dots.push(dot)
        const d = Math.hypot(x - cx, y - cy) / maxD
        anims.push(
          dot.animate(
            [
              { transform: 'scale(0)', opacity: 0 },
              { transform: 'scale(1.6)', opacity: 0.9, offset: 0.16 },
              { transform: 'scale(1)', opacity: 0.5, offset: 0.3 },
              { transform: 'scale(1)', opacity: 0.5, offset: 0.66 },
              { transform: 'scale(0)', opacity: 0 },
            ],
            { duration: 2100, delay: 100 + d * 460, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' },
          ),
        )
      }
    }

    /* letters assemble, rise in then exit up */
    nameEl.textContent = ''
    let letterIndex = 0
    for (const ch of NAME) {
      if (ch === ' ') {
        const spacer = document.createElement('span')
        spacer.style.width = '.35em'
        spacer.style.display = 'inline-block'
        nameEl.appendChild(spacer)
        continue
      }
      const wrap = document.createElement('span')
      wrap.className = styles.letterWrap
      const inner = document.createElement('span')
      inner.className = styles.letterInner
      inner.textContent = ch
      wrap.appendChild(inner)
      nameEl.appendChild(wrap)
      anims.push(
        inner.animate(
          [
            { transform: 'translateY(120%) rotate(7deg)', opacity: 0 },
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
          ],
          { duration: 760, delay: 430 + letterIndex * 36, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' },
        ),
      )
      anims.push(
        inner.animate(
          [
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-130%)', opacity: 0 },
          ],
          { duration: 500, delay: 2030 + letterIndex * 20, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' },
        ),
      )
      letterIndex++
    }

    /* eyebrow + sub fades */
    const fade = (el: HTMLElement | null, delayIn: number, delayOut: number) => {
      if (!el) return
      anims.push(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: delayIn, fill: 'both' }))
      anims.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, delay: delayOut, fill: 'forwards' }))
    }
    fade(eyebrowRef.current, 950, 2000)
    fade(subRef.current, 1150, 2000)

    /* expanding rings */
    if (ringRef.current) {
      anims.push(
        ringRef.current.animate(
          [
            { transform: 'scale(1)', opacity: 0.85 },
            { transform: 'scale(46)', opacity: 0 },
          ],
          { duration: 950, delay: 1520, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' },
        ),
      )
    }
    if (ring2Ref.current) {
      anims.push(
        ring2Ref.current.animate(
          [
            { transform: 'scale(1)', opacity: 0.6 },
            { transform: 'scale(46)', opacity: 0 },
          ],
          { duration: 950, delay: 1720, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' },
        ),
      )
    }

    /* 000 -> 100 counter, driven imperatively to avoid a render per frame */
    const countEl = countRef.current
    const t0 = performance.now()
    let countRaf: number | null = null
    const tickCount = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0 - 260) / 1560))
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      if (countEl) countEl.textContent = String(Math.round(eased * 100)).padStart(3, '0')
      if (p < 1) countRaf = requestAnimationFrame(tickCount)
    }
    countRaf = requestAnimationFrame(tickCount)
    if (countEl) {
      anims.push(countEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 2150, fill: 'forwards' }))
    }
    if (skipRef.current) {
      anims.push(
        skipRef.current.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 2150, fill: 'forwards' }),
      )
    }

    /* column wipe-out */
    colRefs.current.forEach((col, idx) => {
      if (!col) return
      anims.push(
        col.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
          duration: 620,
          delay: 2380 + idx * 70,
          easing: 'cubic-bezier(.76,0,.24,1)',
          fill: 'forwards',
        }),
      )
    })

    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(autoFinishTimer)
      if (countRaf !== null) cancelAnimationFrame(countRaf)
      anims.forEach((anim) => {
        try {
          anim.cancel()
        } catch {
          /* already finished/cancelled */
        }
      })
      dots.forEach((dot) => dot.remove())
      root.style.overflow = prevOverflow
      onDoneRef.current()
    }
    finishRef.current = finish

    const autoFinishTimer = setTimeout(finish, AUTO_FINISH_MS)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      finish()
    }
  }, [skip])

  if (skip) return null

  return (
    // Clicking anywhere skips the intro; Escape is the keyboard equivalent (handled globally above).
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div role="dialog" aria-label="Intro" className={styles.overlay} onClick={() => finishRef.current()}>
      <div className={styles.columns} aria-hidden="true">
        {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              colRefs.current[i] = el
            }}
            className={styles.col}
          />
        ))}
      </div>
      <div ref={dotsHostRef} className={styles.dots} aria-hidden="true" />
      <div className={styles.center}>
        <div ref={ringRef} className={styles.ring} aria-hidden="true" />
        <div ref={ring2Ref} className={styles.ring2} aria-hidden="true" />
        <div ref={eyebrowRef} className={styles.eyebrow}>
          SYDNEY · FULL-STACK ENGINEER
        </div>
        <div ref={nameRef} className={styles.name}>
          {NAME}
        </div>
        <div ref={subRef} className={styles.sub}>
          PORTFOLIO — 2026
        </div>
      </div>
      <div ref={countRef} className={styles.count}>
        000
      </div>
      <div ref={skipRef} className={styles.skip}>
        CLICK TO SKIP
      </div>
    </div>
  )
}
