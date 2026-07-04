import { useCountUp } from '../../hooks/useCountUp'
import styles from './StatCounter.module.css'

interface StatCounterProps {
  value: number
  suffix?: string
  caption: string
  active?: boolean
}

export function StatCounter({ value, suffix, caption, active = true }: StatCounterProps) {
  const count = useCountUp(value, active)

  return (
    <div className={styles.stat}>
      <div className={styles.value}>
        {count}
        {suffix}
      </div>
      <div className={styles.caption}>{caption}</div>
    </div>
  )
}
