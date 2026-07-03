import { site } from '../../content/site'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>{site.footer.copyright}</span>
      <span>{site.footer.location}</span>
      <span>
        {site.footer.credit}
        <span className={styles.cursor} aria-hidden="true" />
      </span>
    </footer>
  )
}
