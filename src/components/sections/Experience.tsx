import { useRef, useState } from 'react'
import type { ImpactItem, Role } from '../../content/site'
import { site } from '../../content/site'
import { useReducedMotion } from '../../hooks/useMediaQuery'
import { useReveal } from '../../hooks/useReveal'
import { useScrollFrame } from '../../hooks/useScrollFrame'
import { quantize, SCROLL_EPSILON } from '../../lib/math'
import { timelineProgress } from '../../lib/timeline'
import { SectionLabel } from '../ui/SectionLabel'
import styles from './Experience.module.css'

// Finer scroll deltas cannot visibly move the 1000-unit timeline path.
const PROGRESS_STEP = SCROLL_EPSILON

function resolveImpactItem(item: ImpactItem): { label: string; value: string } {
  if ('statKey' in item) {
    const stat = site.stats[item.statKey]
    return { label: stat.label, value: stat.value }
  }
  return item
}

function RoleEntry({ role }: { role: Role }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const layoutClass = role.impactLog ? styles.roleWithImpact : styles.roleSimple
  return (
    <div ref={ref} className={`${styles.role} ${layoutClass} ${visible ? styles.roleVisible : ''}`}>
      <div>
        <div className={styles.roleHeader}>
          <span className={styles.company}>{role.company}</span>
          <span className={styles.title}>{role.title}</span>
        </div>
        <div className={styles.meta}>
          {role.period} · {role.location}
        </div>
        <ul className={styles.bullets}>
          {role.bullets.map((bullet, i) => (
            <li key={i}>
              <span aria-hidden="true" className={styles.marker}>
                ▸
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
      {role.impactLog && (
        <div className={styles.impactCard}>
          <div className={styles.impactLabel}>IMPACT LOG</div>
          <div className={styles.impactRows}>
            {role.impactLog.map((item, i) => {
              const { label, value } = resolveImpactItem(item)
              return (
                <div key={i} data-impact-row className={styles.impactRow}>
                  <span className={styles.impactRowKey}>{label}</span>
                  <span className={item.accent ? styles.impactValueAccent : undefined}>{value}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(() => (reduced ? 1 : 0))

  useScrollFrame(() => {
    if (reduced) return
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    setProgress(quantize(timelineProgress(rect.top, rect.height, window.innerHeight), PROGRESS_STEP))
  })

  return (
    <section id="experience" ref={sectionRef} className={styles.experience}>
      <div className={styles.labelWrap}>
        <SectionLabel as="h2">{site.sectionLabels.experience}</SectionLabel>
      </div>
      <div className={styles.grid}>
        <div className={styles.lineWrap}>
          <svg data-tl-svg aria-hidden="true" viewBox="0 0 24 1000" preserveAspectRatio="none" className={styles.svg}>
            <path d="M12 0 L12 1000" className={styles.baseLine} />
            <path
              d="M12 0 L12 1000"
              className={styles.progressLine}
              style={{ strokeDasharray: 1000, strokeDashoffset: 1000 * (1 - progress) }}
            />
            <circle data-orb-anchor="experience" cx={12} cy={1000 * progress} r={5} className={styles.dot} />
          </svg>
        </div>
        <div className={styles.roles}>
          {site.roles.map((role) => (
            <RoleEntry key={role.company} role={role} />
          ))}
        </div>
      </div>
    </section>
  )
}
