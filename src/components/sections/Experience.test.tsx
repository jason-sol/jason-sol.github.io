import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Experience } from './Experience'

it('uses id="experience" as the section anchor', () => {
  const { container } = render(<Experience />)
  expect(container.querySelector('section#experience')).not.toBeNull()
})

it('renders the section label as a level-2 heading', () => {
  render(<Experience />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(site.sectionLabels.experience)
})

it('renders every role with its company, title, and period', () => {
  const { container } = render(<Experience />)
  for (const role of site.roles) {
    expect(screen.getByText(role.company)).toBeInTheDocument()
    expect(screen.getByText(role.title)).toBeInTheDocument()
    expect(container.textContent).toContain(role.period)
  }
})

it('renders impact log rows resolved against the shared stats record', () => {
  const { container } = render(<Experience />)
  const impactLog = site.roles.find((r) => r.impactLog)!.impactLog!
  const rows = container.querySelectorAll('[data-impact-row]')
  expect(rows).toHaveLength(impactLog.length)
  for (const item of impactLog) {
    if ('statKey' in item) {
      const stat = site.stats[item.statKey]
      expect(screen.getByText(stat.label)).toBeInTheDocument()
      expect(screen.getByText(stat.value)).toBeInTheDocument()
    } else {
      expect(screen.getByText(item.label)).toBeInTheDocument()
      expect(screen.getByText(item.value)).toBeInTheDocument()
    }
  }
})

it('hides the decorative timeline svg from assistive tech', () => {
  const { container } = render(<Experience />)
  expect(container.querySelector('[data-tl-svg]')).toHaveAttribute('aria-hidden', 'true')
})
