import { site } from '../../content/site'
import { LinkButton } from '../ui/LinkButton'
import { SectionLabel } from '../ui/SectionLabel'
import { SegmentedText } from '../ui/SegmentedText'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <SectionLabel>{site.sectionLabels.contact}</SectionLabel>
        <h2 className={styles.title}>
          <SegmentedText segments={site.contact.title} />
        </h2>
        <p className={styles.tagline}>{site.contact.tagline}</p>
        <div className={styles.actions}>
          <LinkButton href={`mailto:${site.contact.email}`} variant="solid">
            {site.contact.email}
          </LinkButton>
          <LinkButton href={site.contact.github} external>
            GitHub<span aria-hidden="true"> ↗</span>
          </LinkButton>
          <LinkButton href={site.contact.linkedin} external>
            LinkedIn<span aria-hidden="true"> ↗</span>
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
