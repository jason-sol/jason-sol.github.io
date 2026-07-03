import type { ReactNode } from 'react'
import styles from './LinkButton.module.css'

interface LinkButtonProps {
  href: string
  variant?: 'solid' | 'outline'
  external?: boolean
  children: ReactNode
}

export function LinkButton({ href, variant = 'outline', external = false, children }: LinkButtonProps) {
  return (
    <a
      href={href}
      className={`${styles.button} ${variant === 'solid' ? styles.solid : styles.outline}`}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
