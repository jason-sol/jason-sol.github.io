import { Fragment } from 'react'
import type { HeadlineStyle } from '../../content/site'
import { site } from '../../content/site'
import { LinkButton } from '../ui/LinkButton'
import { SectionLabel } from '../ui/SectionLabel'
import styles from './Contact.module.css'

const segmentClass: Record<HeadlineStyle, string> = {
  accent: styles.accent,
  outline: styles.outline,
  'outline-accent': styles.outlineAccent,
  'serif-accent': styles.serifAccent,
}

export function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <SectionLabel>{site.sectionLabels.contact}</SectionLabel>
        <h2 className={styles.title}>
          {site.contact.title.map((seg, i) => {
            const text =
              'text' in seg ? seg.text : `${site.stats[seg.statKey].value} ${site.stats[seg.statKey].label}`
            return seg.style ? (
              <span key={i} className={segmentClass[seg.style]}>
                {text}
              </span>
            ) : (
              <Fragment key={i}>{text}</Fragment>
            )
          })}
        </h2>
        <p className={styles.tagline}>{site.contact.tagline}</p>
        <div className={styles.actions}>
          <LinkButton href={`mailto:${site.contact.email}`} variant="solid">
            {site.contact.email}
          </LinkButton>
          <LinkButton href={site.contact.github} external>
            GitHub ↗
          </LinkButton>
          <LinkButton href={site.contact.linkedin} external>
            LinkedIn ↗
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
