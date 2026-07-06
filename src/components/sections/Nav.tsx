import { site } from '../../content/site'
import styles from './Nav.module.css'

export function Nav() {
  return (
    <nav className={styles.nav}>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <a className={styles.brand} href={site.brand.href} aria-label={site.brand.label}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.brandLabel}>{site.brand.label}</span>
      </a>
      <div className={styles.links}>
        {site.nav.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
            {link.arrow && <span aria-hidden="true"> ↗</span>}
          </a>
        ))}
      </div>
    </nav>
  )
}
