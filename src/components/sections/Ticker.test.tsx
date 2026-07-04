import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Ticker } from './Ticker'

it('gives its container an accessible label', () => {
  render(<Ticker />)
  expect(screen.getByRole('group', { name: 'Highlights' })).toBeInTheDocument()
})

it('shows each content-model stat exactly once to assistive tech', () => {
  render(<Ticker />)
  const stat = site.stats.pullRequests
  const expected = `${stat.value} ${stat.label.toUpperCase()}`

  const matches = screen.getAllByText(expected)
  const visible = matches.filter((el) => !el.closest('[aria-hidden="true"]'))
  expect(visible).toHaveLength(1)
})
