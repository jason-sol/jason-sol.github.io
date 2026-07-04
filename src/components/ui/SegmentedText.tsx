import { Fragment } from 'react'
import type { HeadlineSegment, HeadlineStyle } from '../../content/site'
import { site } from '../../content/site'
import styles from './SegmentedText.module.css'

const segmentClass: Record<HeadlineStyle, string> = {
  accent: styles.accent,
  outline: styles.outline,
  'outline-accent': styles.outlineAccent,
  'serif-accent': styles.serifAccent,
}

export function SegmentedText({ segments }: { segments: HeadlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        const text =
          'text' in seg ? seg.text : `${site.stats[seg.statKey].value} ${site.stats[seg.statKey].label}`
        return seg.style ? (
          <span key={i} className={segmentClass[seg.style]}>
            {text}
          </span>
        ) : (
          <Fragment key={i}>{text}</Fragment>
        )
      })}
    </>
  )
}
