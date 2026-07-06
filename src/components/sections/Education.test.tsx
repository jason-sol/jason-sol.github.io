import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Education } from './Education'

it('renders the section label as a level-2 heading', () => {
  render(<Education />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(site.sectionLabels.education)
})

it('renders the institution, degree, and period from the content model', () => {
  render(<Education />)
  expect(screen.getByText(site.education.institution)).toBeInTheDocument()
  expect(screen.getByText(site.education.degree)).toBeInTheDocument()
  expect(screen.getByText(site.education.period)).toBeInTheDocument()
})

it('renders the systems-thinking pull-quote with its emphasized sentence', () => {
  const { container } = render(<Education />)
  expect(container.textContent).toContain(site.education.reflectionLead)
  expect(screen.getByText(site.education.reflectionEmphasis)).toBeInTheDocument()
})
