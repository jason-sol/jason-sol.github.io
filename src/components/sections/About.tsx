import { useMemo, useRef, useState } from 'react'
import portrait from '../../assets/jason.jpg'
import type { AboutStat } from '../../content/site'
import { site } from '../../content/site'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { useReveal } from '../../hooks/useReveal'
import { useScrollFrame } from '../../hooks/useScrollFrame'
import { portraitProgress, wordsProgress } from '../../lib/aboutProgress'
import { litWordCount, splitWords } from '../../lib/splitWords'
import { quantize, SCROLL_EPSILON } from '../../lib/math'
import { DissolvePortrait } from '../effects/DissolvePortrait'
import { SectionLabel } from '../ui/SectionLabel'
import { StatCounter } from '../ui/StatCounter'
import styles from './About.module.css'

// Dissolve cell thresholds top out around 1.06, so this leaves the portrait fully developed.
const DEVELOPED = 2
// Matches the dissolve redraw epsilon; finer scroll deltas cannot change the drawing.
const PROGRESS_STEP = SCROLL_EPSILON

function RevealedStat({ stat, delay }: { stat: AboutStat; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealVisible : ''}`}>
      <StatCounter
        value={stat.value}
        suffix={stat.suffix}
        accent={stat.accent}
        caption={stat.caption}
        active={visible}
      />
    </div>
  )
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLParagraphElement>(null)
  const words = useMemo(() => splitWords(site.about.statement), [])
  const reduced = useReducedMotion()
  const [developProgress, setDevelopProgress] = useState(() => (reduced ? DEVELOPED : 0))
  const [lit, setLit] = useState(() => (reduced ? words.length : 0))

  useScrollFrame(() => {
    if (reduced) return
    const section = sectionRef.current
    const wordsEl = wordsRef.current
    if (!section || !wordsEl) return
    const vh = window.innerHeight
    const sectionTop = section.getBoundingClientRect().top
    setDevelopProgress(quantize(portraitProgress(sectionTop, vh), PROGRESS_STEP))
    const wordsTop = wordsEl.getBoundingClientRect().top
    setLit(litWordCount(wordsProgress(wordsTop, vh), words.length))
  })

  return (
    <section id="about" ref={sectionRef} className={styles.about}>
      <figure className={styles.figure}>
        <div className={styles.frame} aria-hidden="true" />
        <div data-orb-anchor="about" className={styles.corner} aria-hidden="true" />
        <DissolvePortrait src={portrait} progress={developProgress} />
        <figcaption className={styles.figCaption}>{site.about.figCaption}</figcaption>
      </figure>
      <div>
        <SectionLabel as="h2">{site.sectionLabels.about}</SectionLabel>
        {/* Assistive tech reads this plain copy; the word-by-word animated copy below is decoration. */}
        <p className={styles.srOnly}>{site.about.statement}</p>
        <p ref={wordsRef} aria-hidden="true" className={styles.statement}>
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
