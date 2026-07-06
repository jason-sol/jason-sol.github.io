import { Fragment } from 'react'
import type { HeadlineSegment, HeadlineStyle } from '../../content/site'
import { formatStat } from '../../content/site'
import styles from './SegmentedText.module.css'

/** Shared style-variant classes; also consumed by Hero's stacked phase-0 name lines. */
export const segmentClass: Record<HeadlineStyle, string> = {
  accent: styles.accent,
  outline: styles.outline,
  'outline-accent': styles.outlineAccent,
  'serif-accent': styles.serifAccent,
}

export function SegmentedText({ segments }: { segments: HeadlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        const text = 'text' in seg ? seg.text : formatStat(seg.statKey)
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
