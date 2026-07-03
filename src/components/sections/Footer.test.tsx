import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

it('renders the copyright line', () => {
  render(<Footer />)
  expect(screen.getByText(/© 2026 JASON SOLANKI/)).toBeInTheDocument()
})

it('is a contentinfo landmark', () => {
  render(<Footer />)
  expect(screen.getByRole('contentinfo')).toBeInTheDocument()
})

it('contains no phone number', () => {
  const { container } = render(<Footer />)
  expect(container.textContent).not.toMatch(/\d{4}\s?\d{3}\s?\d{3}/)
})
