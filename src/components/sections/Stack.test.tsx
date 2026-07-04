import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import tagStyles from '../ui/Tag.module.css'
import { Stack } from './Stack'

it('uses id="stack" as the section anchor', () => {
  const { container } = render(<Stack />)
  expect(container.querySelector('section#stack')).not.toBeNull()
})

it('renders the section label as a level-2 heading', () => {
  render(<Stack />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(site.sectionLabels.stack)
})

it('renders one row per stack group with its title', () => {
  const { container } = render(<Stack />)
  expect(container.querySelectorAll('[data-stack-row]')).toHaveLength(site.stackGroups.length)
  for (const group of site.stackGroups) {
    expect(screen.getByText(group.title)).toBeInTheDocument()
  }
})

it('renders every tag label from the content model', () => {
  render(<Stack />)
  for (const group of site.stackGroups) {
    for (const item of group.items) {
      expect(screen.getByText(item)).toBeInTheDocument()
    }
  }
})

it('uses the accent Tag variant for the highlighted Testing group', () => {
  render(<Stack />)
  const testing = site.stackGroups.find((g) => g.highlight)!
  for (const item of testing.items) {
    expect(screen.getByText(item)).toHaveClass(tagStyles.accent)
  }
  expect(screen.getByText('TypeScript')).not.toHaveClass(tagStyles.accent)
})

it('hides the decorative glow line from assistive tech', () => {
  const { container } = render(<Stack />)
  expect(container.querySelector('[data-stack-glow]')).toHaveAttribute('aria-hidden', 'true')
})
