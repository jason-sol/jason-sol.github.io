import type { ReactNode } from 'react'
import styles from './SectionLabel.module.css'

interface SectionLabelProps {
  as?: 'div' | 'h2'
  children: ReactNode
}

export function SectionLabel({ as: Tag = 'div', children }: SectionLabelProps) {
  return <Tag className={styles.label}>{children}</Tag>
}
