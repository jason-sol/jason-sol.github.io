import { render, screen } from '@testing-library/react'
import { Card } from './Card'
import styles from './Card.module.css'

const baseProps = {
  kicker: 'HARRISON.AI · PRODUCTION',
  title: 'Organization Onboarding',
  blurb: 'Multi-tenant onboarding for a clinical AI platform.',
  tags: ['TypeScript', 'Koa'],
}

it('renders the kicker, title, blurb, and tags', () => {
  render(<Card {...baseProps} />)
  expect(screen.getByText(baseProps.kicker)).toBeInTheDocument()
  expect(screen.getByText(baseProps.title)).toBeInTheDocument()
  expect(screen.getByText(baseProps.blurb)).toBeInTheDocument()
  for (const tag of baseProps.tags) {
    expect(screen.getByText(tag)).toBeInTheDocument()
  }
})

it('renders as an article with no ↗ arrow when no url is given', () => {
  const { container } = render(<Card {...baseProps} />)
  expect(container.querySelector('article')).not.toBeNull()
  expect(container.querySelector('a')).toBeNull()
  expect(container.textContent).not.toContain('↗')
})

it('renders as a link with the ↗ arrow when a url is given', () => {
  const { container } = render(<Card {...baseProps} url="https://example.com" />)
  const link = container.querySelector('a')
  expect(link).not.toBeNull()
  expect(link).toHaveAttribute('href', 'https://example.com')
  expect(container.querySelector('article')).toBeNull()
  expect(container.textContent).toContain('↗')
})

it('renders the title as a heading', () => {
  render(<Card {...baseProps} />)
  expect(screen.getByRole('heading', { level: 3, name: baseProps.title })).toBeInTheDocument()
})

it('gives the link an accessible name of just the title, excluding the kicker/blurb/tags/arrow', () => {
  render(<Card {...baseProps} url="https://example.com" />)
  expect(screen.getByRole('link', { name: baseProps.title })).toBeInTheDocument()
})

it('applies the linked hover-affordance class only when a url is given', () => {
  const { container: withoutUrl } = render(<Card {...baseProps} />)
  const { container: withUrl } = render(<Card {...baseProps} url="https://example.com" />)
  expect(withoutUrl.firstElementChild).not.toHaveClass(styles.linked)
  expect(withUrl.firstElementChild).toHaveClass(styles.linked)
})
