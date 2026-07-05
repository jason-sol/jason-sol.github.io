import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { site } from '../../content/site'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { activePhaseIndex, hintOpacity, phaseStyle } from '../../lib/heroPhases'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { HeroBackdrop } from '../effects/HeroBackdrop'
import { SegmentedText } from '../ui/SegmentedText'
import styles from './Hero.module.css'

const toneClass = {
  high: styles.badgeHigh,
  warn: styles.badgeWarn,
  ok: styles.badgeOk,
} as const

export function Hero() {
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
            visibility: opacity < 0.01 ? 'hidden' : 'visible',
            transform: `translateY(${translateY}px) scale(${scale})`,
            filter: reduced ? 'blur(0)' : `blur(${blur}px)`,
          }

          if (i === 0) {
            return (
              <div key={phase.eyebrow} className={styles.phaseName} style={style}>
                <div className={styles.eyebrowDim}>
                  <span className={styles.riseEyebrow}>{phase.eyebrow}</span>
                </div>
                <h1 className={styles.name}>
                  <SegmentedText segments={phase.headline} />
                </h1>
                {phase.sub && <p className={styles.riseSub}>{phase.sub}</p>}
              </div>
            )
          }

          return (
            <div key={phase.eyebrow} className={styles.phase} style={style}>
              <div className={styles.eyebrowAccent}>{phase.eyebrow}</div>
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
