import type { RefCallback } from 'react'
import { useReveal } from '../../hooks/useReveal'
import styles from './Card.module.css'
import { Tag } from './Tag'

interface CardProps {
  kicker: string
  title: string
  blurb: string
  tags: string[]
  url?: string
  delay?: number
}

export function Card({ kicker, title, blurb, tags, url, delay = 0 }: CardProps) {
  const { ref, visible } = useReveal<HTMLElement>(delay)
  const setRef: RefCallback<HTMLElement> = (el) => {
    ref.current = el
  }
  const className = `${styles.card} ${visible ? styles.cardVisible : ''} ${url ? styles.linked : ''}`

  const content = (
    <>
      <div className={styles.kicker}>{kicker}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.blurb}>{blurb}</p>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      {url && (
        <span aria-hidden="true" className={styles.arrow}>
          ↗
        </span>
      )}
    </>
  )

  if (url) {
    return (
      <a ref={setRef} href={url} aria-label={title} className={className}>
        {content}
      </a>
    )
  }

  return (
    <article ref={setRef} className={className}>
      {content}
    </article>
  )
}
