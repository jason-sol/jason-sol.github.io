import { Fragment } from 'react'
import type { TickerItem } from '../../content/site'
import { formatStat, site } from '../../content/site'
import { Marquee } from '../ui/Marquee'
import styles from './Ticker.module.css'

function tickerText(item: TickerItem): string {
  return 'statKey' in item ? formatStat(item.statKey) : item.text
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
