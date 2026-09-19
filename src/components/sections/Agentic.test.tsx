import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Agentic } from './Agentic'

it('uses id="agentic" as the section anchor', () => {
  const { container } = render(<Agentic />)
  expect(container.querySelector('section#agentic')).not.toBeNull()
})

it('renders the section label as a level-2 heading', () => {
  render(<Agentic />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(site.sectionLabels.agentic)
})

it('renders every practice with its title and body', () => {
  render(<Agentic />)
  for (const practice of site.practices) {
    expect(screen.getByText(practice.title)).toBeInTheDocument()
    expect(screen.getByText(practice.body)).toBeInTheDocument()
  }
})

it('numbers the practices in content order, one-indexed and zero-padded', () => {
  const { container } = render(<Agentic />)
  const indices = [...container.querySelectorAll('[data-practice-index]')].map((el) => el.textContent)
  expect(indices).toEqual(site.practices.map((_, i) => String(i + 1).padStart(2, '0')))
})

it('carries an orb waypoint anchor so the orb lands on this section', () => {
  const { container } = render(<Agentic />)
  expect(container.querySelector('[data-orb-anchor="agentic"]')).not.toBeNull()
})
