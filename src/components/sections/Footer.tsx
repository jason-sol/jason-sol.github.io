import { site } from '../../content/site'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        © {new Date().getFullYear()} {site.footer.copyrightName}
      </span>
      <span>{site.footer.location}</span>
      <span>
        <a href={site.repoUrl} target="_blank" rel="noreferrer" className={styles.credit}>
          {site.footer.credit}
        </a>
        <span className={styles.cursor} aria-hidden="true" />
      </span>
    </footer>
  )
}
