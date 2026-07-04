import { site } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { SectionLabel } from '../ui/SectionLabel'
import styles from './Education.module.css'

export function Education() {
  const { ref: leftRef, visible: leftVisible } = useReveal<HTMLDivElement>()
  const { ref: rightRef, visible: rightVisible } = useReveal<HTMLDivElement>(150)

  return (
    <section className={styles.education}>
      <div>
        <div className={styles.labelWrap}>
          <SectionLabel as="h2">{site.sectionLabels.education}</SectionLabel>
        </div>
        <div ref={leftRef} className={`${styles.reveal} ${leftVisible ? styles.revealVisible : ''}`}>
          <div className={styles.university}>{site.education.institution}</div>
          <div className={styles.degree}>{site.education.degree}</div>
          <div className={styles.period}>{site.education.period}</div>
        </div>
      </div>
      <div
        ref={rightRef}
        className={`${styles.quoteWrap} ${styles.reveal} ${rightVisible ? styles.revealVisible : ''}`}
      >
        <p className={styles.quote}>
          {site.education.reflectionLead}
          <span className={styles.quoteEmphasis}>{site.education.reflectionEmphasis}</span>
        </p>
      </div>
    </section>
  )
}
