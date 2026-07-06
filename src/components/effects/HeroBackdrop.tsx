import styles from './HeroBackdrop.module.css'

export function HeroBackdrop() {
  return (
    <div data-hero-backdrop aria-hidden="true" className={styles.backdrop}>
      <div className={styles.grid}>
        <div className={styles.gridPlane} />
      </div>
      <div className={styles.lines}>
        <span className={styles.lineA} />
        <span className={styles.lineB} />
        <span className={styles.lineC} />
        <span className={styles.glow} />
      </div>
    </div>
  )
}
