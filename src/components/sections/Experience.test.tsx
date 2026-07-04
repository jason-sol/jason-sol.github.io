import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Experience } from './Experience'
import styles from './Experience.module.css'

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

it('accents only the impact-log values flagged accent in the content model', () => {
  render(<Experience />)
  const impactLog = site.roles.find((r) => r.impactLog)!.impactLog!
  const accented = impactLog.filter((item) => item.accent)
  expect(accented.length).toBe(2)
  for (const item of accented) {
    const value = 'statKey' in item ? site.stats[item.statKey].value : item.value
    expect(screen.getByText(value)).toHaveClass(styles.impactValueAccent)
  }
  const plain = impactLog.filter((item) => !item.accent)
  expect(plain.length).toBeGreaterThan(0)
  for (const item of plain) {
    const value = 'statKey' in item ? site.stats[item.statKey].value : item.value
    expect(screen.getByText(value)).not.toHaveClass(styles.impactValueAccent)
  }
})

it('hides the decorative timeline svg from assistive tech', () => {
  const { container } = render(<Experience />)
  expect(container.querySelector('[data-tl-svg]')).toHaveAttribute('aria-hidden', 'true')
})
