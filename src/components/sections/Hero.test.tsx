import { render, screen } from '@testing-library/react'
import type { HeadlineSegment } from '../../content/site'
import { site } from '../../content/site'
import { Hero } from './Hero'

function headlineText(headline: HeadlineSegment[]): string {
  return headline
    .map((seg) => ('text' in seg ? seg.text : `${site.stats[seg.statKey].value} ${site.stats[seg.statKey].label}`))
    .join('')
}

it('renders every hero phase headline from the content model', () => {
  const { container } = render(<Hero />)
  for (const phase of site.heroPhases) {
    expect(container.textContent).toContain(headlineText(phase.headline))
  }
})

it('uses id="top" as the scroll-story anchor', () => {
  const { container } = render(<Hero />)
  expect(container.querySelector('#top')).not.toBeNull()
})

it('renders the page name as the only level-1 heading', () => {
  render(<Hero />)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

it('renders a progress-rail dot per hero phase', () => {
  const { container } = render(<Hero />)
  expect(container.querySelectorAll('[data-progress-dot]')).toHaveLength(site.heroPhases.length)
})

it('hides the decorative backdrop from assistive tech', () => {
  const { container } = render(<Hero />)
  expect(container.querySelector('[data-hero-backdrop]')).toHaveAttribute('aria-hidden', 'true')
})
