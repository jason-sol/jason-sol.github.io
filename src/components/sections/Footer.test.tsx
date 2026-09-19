import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Footer } from './Footer'

it('renders the copyright line for the current year', () => {
  render(<Footer />)
  expect(screen.getByText(`© ${new Date().getFullYear()} JASON SOLANKI`)).toBeInTheDocument()
})

it('derives the copyright year from the clock rather than hard-coding it', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2031-03-04T00:00:00Z'))
  render(<Footer />)
  expect(screen.getByText('© 2031 JASON SOLANKI')).toBeInTheDocument()
  vi.useRealTimers()
})

it('is a contentinfo landmark', () => {
  render(<Footer />)
  expect(screen.getByRole('contentinfo')).toBeInTheDocument()
})

it('shows the Sydney location', () => {
  render(<Footer />)
  expect(screen.getByText('SYDNEY, NSW')).toBeInTheDocument()
})

it('contains no phone number', () => {
  const { container } = render(<Footer />)
  expect(container.textContent).not.toMatch(/\d{4}\s?\d{3}\s?\d{3}/)
})

it('makes the credit line itself the link to the site source', () => {
  render(<Footer />)
  const link = screen.getByRole('link', { name: site.footer.credit })
  expect(link).toHaveAttribute('href', site.repoUrl)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noreferrer')
})

it('keeps the blinking cursor out of the link accessible name', () => {
  const { container } = render(<Footer />)
  expect(container.querySelector('a [aria-hidden="true"]')).toBeNull()
})
