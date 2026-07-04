import { Fragment } from 'react'
import type { TickerItem } from '../../content/site'
import { site } from '../../content/site'
import { Marquee } from '../ui/Marquee'
import styles from './Ticker.module.css'

function tickerText(item: TickerItem): string {
  if ('statKey' in item) {
    const stat = site.stats[item.statKey]
    return `${stat.value} ${stat.label.toUpperCase()}`
  }
  return item.text
}

export function Ticker() {
  return (
    <div className={styles.ticker} role="group" aria-label="Highlights">
      <Marquee>
        {site.ticker.map((item, i) => (
          <Fragment key={i}>
            <span>{tickerText(item)}</span>
            <span className={styles.separator} aria-hidden="true">
              ◆
            </span>
          </Fragment>
        ))}
      </Marquee>
    </div>
  )
}
