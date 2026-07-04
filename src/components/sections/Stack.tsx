import type { StackGroup } from '../../content/site'
import { site } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { SectionLabel } from '../ui/SectionLabel'
import { Tag } from '../ui/Tag'
import styles from './Stack.module.css'

function StackRow({ group, delay }: { group: StackGroup; delay: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} data-stack-row className={`${styles.row} ${visible ? styles.rowVisible : ''}`}>
      <span className={group.highlight ? `${styles.groupName} ${styles.groupNameAccent}` : styles.groupName}>
        {group.title}
      </span>
      <div className={styles.tags}>
        {group.items.map((item) => (
          <Tag key={item} variant={group.highlight ? 'accent' : 'default'}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  )
}

export function Stack() {
  return (
    <section id="stack" className={styles.stack}>
      <div data-stack-glow aria-hidden="true" className={styles.glowLine} />
      <div className={styles.labelWrap}>
        <SectionLabel as="h2">{site.sectionLabels.stack}</SectionLabel>
      </div>
      <div className={styles.rows}>
        {site.stackGroups.map((group, i) => (
          <StackRow key={group.title} group={group} delay={i * 80} />
        ))}
      </div>
    </section>
  )
}
