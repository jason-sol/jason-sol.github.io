import type { ReactNode } from 'react'
import styles from './Tag.module.css'

interface TagProps {
  variant?: 'default' | 'accent'
  children: ReactNode
}

export function Tag({ variant = 'default', children }: TagProps) {
  return <span className={variant === 'accent' ? `${styles.tag} ${styles.accent}` : styles.tag}>{children}</span>
}
