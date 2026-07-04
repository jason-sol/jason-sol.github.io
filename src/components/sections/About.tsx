import { useEffect, useMemo, useRef, useState } from 'react'
import portrait from '../../assets/jason.jpg'
import type { AboutStat } from '../../content/site'
import { site } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { litWordCount, splitWords } from '../../lib/splitWords'
import { smoothstep } from '../../lib/math'
import { DissolvePortrait } from '../effects/DissolvePortrait'
import { SectionLabel } from '../ui/SectionLabel'
import { StatCounter } from '../ui/StatCounter'
import styles from './About.module.css'

// Dissolve cell thresholds top out around 1.06, so this leaves the portrait fully developed.
const DEVELOPED = 2

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false
}

function RevealedStat({ stat, delay }: { stat: AboutStat; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealVisible : ''}`}>
      <StatCounter value={stat.value} suffix={stat.suffix} caption={stat.caption} active={visible} />
    </div>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLParagraphElement>(null)
  const [portraitProgress, setPortraitProgress] = useState(() => (prefersReducedMotion() ? DEVELOPED : 0))
  const [wordsFraction, setWordsFraction] = useState(() => (prefersReducedMotion() ? 1 : 0))

  const words = useMemo(() => splitWords(site.about.statement), [])
  const lit = litWordCount(wordsFraction, words.length)

  useEffect(() => {
    if (prefersReducedMotion()) return

    let ticking = false
    let rafId: number | null = null
    const onScroll = () => {
      if (ticking) return
      ticking = true
      rafId = requestAnimationFrame(() => {
        ticking = false
        const section = sectionRef.current
        const wordsEl = wordsRef.current
        if (!section || !wordsEl) return
        const vh = window.innerHeight
        const sectionTop = section.getBoundingClientRect().top
        setPortraitProgress(smoothstep(vh * 0.92 - sectionTop, 0, vh * 0.85) * 1.35)
        const wordsTop = wordsEl.getBoundingClientRect().top
        setWordsFraction(smoothstep(vh * 0.85 - wordsTop, 0, vh * 0.55))
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className={styles.about}>
      <figure className={styles.figure}>
        <div className={styles.frame} aria-hidden="true" />
        <div className={styles.corner} aria-hidden="true" />
        <DissolvePortrait src={portrait} progress={portraitProgress} />
        <figcaption className={styles.figCaption}>{site.about.figCaption}</figcaption>
      </figure>
      <div>
        <SectionLabel as="h2">{site.sectionLabels.about}</SectionLabel>
        <p ref={wordsRef} className={styles.statement}>
          {words.map((word, i) => (
            <span key={i} data-word className={i < lit ? styles.wordLit : styles.word}>
              {word}{' '}
            </span>
          ))}
        </p>
        <div className={styles.stats}>
          {site.about.stats.map((stat, i) => (
            <RevealedStat key={stat.caption} stat={stat} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}
