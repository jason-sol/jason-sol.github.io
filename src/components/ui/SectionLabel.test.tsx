import { render, screen } from '@testing-library/react'
import { SectionLabel } from './SectionLabel'

it('renders the label text', () => {
  render(<SectionLabel>09 — CONTACT</SectionLabel>)
  expect(screen.getByText('09 — CONTACT')).toBeInTheDocument()
})

it('renders as a div by default', () => {
  const { container } = render(<SectionLabel>04 — ABOUT</SectionLabel>)
  expect(container.querySelector('div')).not.toBeNull()
})

it('renders as a level-2 heading when as="h2"', () => {
  render(<SectionLabel as="h2">04 — ABOUT</SectionLabel>)
  expect(screen.getByRole('heading', { level: 2, name: '04 — ABOUT' })).toBeInTheDocument()
})
