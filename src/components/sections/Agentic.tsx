import type { Practice } from '../../content/site'
import { site } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { SectionLabel } from '../ui/SectionLabel'
import styles from './Agentic.module.css'

function PracticeEntry({ practice, index, delay }: { practice: Practice; index: number; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} data-practice className={`${styles.practice} ${visible ? styles.practiceVisible : ''}`}>
      <span data-practice-index aria-hidden="true" className={styles.index}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className={styles.title}>{practice.title}</h3>
      <p className={styles.body}>{practice.body}</p>
    </div>
  )
}

export function Agentic() {
  return (
    <section id="agentic" className={styles.agentic}>
      <div data-orb-anchor="agentic" className={styles.labelWrap}>
        <SectionLabel as="h2">{site.sectionLabels.agentic}</SectionLabel>
      </div>
      <div className={styles.grid}>
        {site.practices.map((practice, i) => (
          <PracticeEntry key={practice.title} practice={practice} index={i} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}
