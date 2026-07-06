import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { SegmentedText } from './SegmentedText'

it('renders plain text segments without a styling wrapper', () => {
  const { container } = render(<SegmentedText segments={[{ text: 'Whole features' }]} />)
  expect(container).toHaveTextContent('Whole features')
  expect(container.querySelector('span')).toBeNull()
})

it('wraps styled segments in a span with the variant class', () => {
  render(<SegmentedText segments={[{ text: "LET'S " }, { text: 'BUILD', style: 'outline-accent' }]} />)
  const styled = screen.getByText('BUILD')
  expect(styled.tagName).toBe('SPAN')
  expect(styled.className).toMatch(/outline/i)
})

it('expands stat segments from the shared stats entity', () => {
  const { clinicians } = site.stats
  render(<SegmentedText segments={[{ statKey: 'clinicians', style: 'accent' }]} />)
  const stat = screen.getByText(`${clinicians.value} ${clinicians.label}`)
  expect(stat.className).toMatch(/accent/i)
})
