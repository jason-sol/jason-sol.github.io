import { render, screen } from '@testing-library/react'
import { LinkButton } from './LinkButton'

it('renders a link with the given href and text', () => {
  render(<LinkButton href="mailto:hi@example.com">Email me</LinkButton>)
  expect(screen.getByRole('link', { name: 'Email me' })).toHaveAttribute(
    'href',
    'mailto:hi@example.com',
  )
})

it('opens external links in a new tab with rel=noreferrer', () => {
  render(
    <LinkButton href="https://example.com" external>
      Example
    </LinkButton>,
  )
  const link = screen.getByRole('link', { name: 'Example' })
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noreferrer')
})

it('does not target a new tab for non-external links', () => {
  render(<LinkButton href="#contact">Contact</LinkButton>)
  expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('target')
})
