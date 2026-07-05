import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Contact } from './Contact'

it('renders its display title as a level-2 heading', () => {
  render(<Contact />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("LET'S BUILD.")
})

it('carries the orb end Waypoint anchor on the closing period', () => {
  const { container } = render(<Contact />)
  const anchor = container.querySelector('[data-orb-anchor="end"]')
  expect(anchor).not.toBeNull()
  expect(anchor).toHaveTextContent('.')
})

it('renders a mailto link for the content-model email', () => {
  render(<Contact />)
  expect(screen.getByRole('link', { name: site.contact.email })).toHaveAttribute(
    'href',
    `mailto:${site.contact.email}`,
  )
})

it('excludes decorative arrows from the GitHub and LinkedIn accessible names', () => {
  render(<Contact />)
  expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
})

it('does not throw when the content model has no title segments', async () => {
  vi.resetModules()
  vi.doMock('../../content/site', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../content/site')>()
    return { site: { ...actual.site, contact: { ...actual.site.contact, title: [] } } }
  })

  const { Contact: ContactWithEmptyTitle } = await import('./Contact')
  expect(() => render(<ContactWithEmptyTitle />)).not.toThrow()

  vi.doUnmock('../../content/site')
  vi.resetModules()
})

it('opens GitHub and LinkedIn in a new tab with rel=noreferrer', () => {
  render(<Contact />)
  const github = screen.getByRole('link', { name: /github/i })
  const linkedin = screen.getByRole('link', { name: /linkedin/i })
  expect(github).toHaveAttribute('href', site.contact.github)
  expect(linkedin).toHaveAttribute('href', site.contact.linkedin)
  for (const link of [github, linkedin]) {
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  }
})
