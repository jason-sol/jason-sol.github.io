import { Fragment, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { HeadlineSegment } from '../../content/site'
import { formatStat, site } from '../../content/site'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { activePhaseIndex, hintOpacity, phaseStyle } from '../../lib/heroPhases'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { HeroBackdrop } from '../effects/HeroBackdrop'
import { SegmentedText, segmentClass } from '../ui/SegmentedText'
import styles from './Hero.module.css'

const toneClass = {
  high: styles.badgeHigh,
  warn: styles.badgeWarn,
  ok: styles.badgeOk,
} as const

const phaseOrbAnchor: Record<number, string> = { 1: 'p1', 2: 'p2', 3: 'p3' }

// Matches the export: JASON rises at .15s, SOLANKI at .3s.
const NAME_LINE_BASE_DELAY_S = 0.15
const NAME_LINE_STAGGER_S = 0.15

/**
 * The name headline stacks each segment as its own block line (the flat inline
 * rendering used by the other phases overflows the viewport). Each line clips
 * its rise animation inside an overflow-hidden wrapper; the whitespace text
 * node between lines keeps the h1's accessible name "JASON SOLANKI".
 */
function StackedNameLines({ segments }: { segments: HeadlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span data-name-line className={styles.nameLine}>
            <span
              className={seg.style ? `${styles.nameLineInner} ${segmentClass[seg.style]}` : styles.nameLineInner}
              style={{ animationDelay: `${NAME_LINE_BASE_DELAY_S + i * NAME_LINE_STAGGER_S}s` }}
            >
              {'text' in seg ? seg.text : formatStat(seg.statKey)}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  )
}

interface HeroProps {
  /** Bump to remount the phase-0 content, replaying its CSS rise-in entrance. */
  entranceKey?: number
}

export function Hero({ entranceKey = 0 }: HeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(ref)
  const activeIndex = activePhaseIndex(progress)
  const reduced = useReducedMotion()

  return (
    <div id="top" ref={ref} className={styles.hero}>
      <div className={styles.sticky}>
        <HeroBackdrop />

        {site.heroPhases.map((phase, i) => {
          const { opacity, translateY, scale, blur } = phaseStyle(i, progress)
          const style: CSSProperties = {
            opacity,
            // Phase 0 holds the page's only h1: it stays in the accessibility tree even at
            // opacity 0 so a heading-navigation user always has a level-1 heading to reach.
            // It's harmless visually — by the time it's fully faded it has also scrolled off-screen.
            visibility: i === 0 || opacity >= 0.01 ? 'visible' : 'hidden',
            transform: `translateY(${translateY}px) scale(${scale})`,
            filter: reduced ? 'blur(0)' : `blur(${blur}px)`,
          }

          if (i === 0) {
            return (
              <div
                key={`${phase.eyebrow}:${entranceKey}`}
                data-entrance={entranceKey}
                className={styles.phaseName}
                style={style}
              >
                <div className={styles.eyebrowDim}>
                  <span className={styles.riseEyebrow}>{phase.eyebrow}</span>
                </div>
                <h1 data-orb-anchor="hero-name" className={styles.name}>
                  <StackedNameLines segments={phase.headline} />
                </h1>
                {phase.sub && <p className={styles.riseSub}>{phase.sub}</p>}
              </div>
            )
          }

          return (
            <div key={phase.eyebrow} className={styles.phase} style={style}>
              <div className={styles.eyebrowAccent} data-orb-anchor={phaseOrbAnchor[i]}>
                {phase.eyebrow}
              </div>
              <div className={styles.headline}>
                <SegmentedText segments={phase.headline} />
              </div>
              {phase.pipeline && (
                <div className={styles.pipeline}>
                  {phase.pipeline.map((step, idx, steps) => (
                    <span key={step} className={styles.pipelineStepGroup}>
                      <span className={idx === steps.length - 1 ? styles.pipelineActive : styles.pipelineStep}>
                        {step}
                      </span>
                      {idx < steps.length - 1 && (
                        <span className={styles.pipelineArrow} aria-hidden="true">
                          →
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              {phase.sub && <p className={styles.sub}>{phase.sub}</p>}
              {phase.badges && (
                <div className={styles.badges}>
                  {phase.badges.map((badge) => (
                    <span key={badge.text} className={`${styles.badge} ${toneClass[badge.tone]}`}>
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <div className={styles.rail} aria-hidden="true">
          {site.heroPhases.map((phase, i) => (
            <span
              key={phase.eyebrow}
              data-progress-dot
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        <div className={styles.hint} aria-hidden="true" style={{ opacity: hintOpacity(progress) }}>
          <span>SCROLL</span>
          <span className={styles.hintLine} />
        </div>
      </div>
    </div>
  )
}
