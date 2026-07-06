import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Nav } from './Nav'

it('renders all nav links from the content model with correct anchors', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: /work/i })).toHaveAttribute('href', '#experience')
  expect(screen.getByRole('link', { name: /stack/i })).toHaveAttribute('href', '#stack')
  expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '#projects')
  expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact')
})

it('excludes the decorative arrow from the contact link accessible name', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: 'CONTACT' })).toHaveAttribute('href', '#contact')
})

it('keeps an accessible name on the brand link (the wordmark is hidden on narrow screens)', () => {
  render(<Nav />)
  expect(screen.getByRole('link', { name: site.brand.label })).toHaveAttribute('href', site.brand.href)
})

it('is a nav landmark', () => {
  render(<Nav />)
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})

it('renders a skip link as its first element', () => {
  render(<Nav />)
  const skip = screen.getByRole('link', { name: /skip to content/i })
  expect(skip).toHaveAttribute('href', '#about')
  expect(screen.getByRole('navigation').firstElementChild).toBe(skip)
})
