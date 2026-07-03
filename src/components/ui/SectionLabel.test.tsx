import { render, screen } from '@testing-library/react'
import { SectionLabel } from './SectionLabel'

it('renders the label text', () => {
  render(<SectionLabel>09 — CONTACT</SectionLabel>)
  expect(screen.getByText('09 — CONTACT')).toBeInTheDocument()
})
