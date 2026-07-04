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
  const className = `${styles.card} ${visible ? styles.cardVisible : ''} ${url ? styles.linked : ''}`

  const content = (
    <>
      <div className={styles.kicker}>{kicker}</div>
      <div className={styles.title}>{title}</div>
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
      <a ref={ref as unknown as React.RefObject<HTMLAnchorElement>} href={url} className={className}>
        {content}
      </a>
    )
  }

  return (
    <article ref={ref} className={className}>
      {content}
    </article>
  )
}
