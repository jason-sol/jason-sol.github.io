import type { ReactNode } from 'react'
import styles from './Marquee.module.css'

export function Marquee({ children }: { children: ReactNode }) {
  return (
    <div className={styles.track}>
      <div className={styles.group}>{children}</div>
      <div className={styles.group} aria-hidden="true">
        {children}
      </div>
    </div>
  )
}
