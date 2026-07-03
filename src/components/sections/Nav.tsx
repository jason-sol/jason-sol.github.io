import { site } from '../../content/site'
import styles from './Nav.module.css'

export function Nav() {
  return (
    <nav className={styles.nav}>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <a className={styles.brand} href={site.brand.href}>
        <span className={styles.dot} aria-hidden="true" />
        {site.brand.label}
      </a>
      <div className={styles.links}>
        {site.nav.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
