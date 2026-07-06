import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { Projects } from './Projects'
import styles from './Projects.module.css'

it('uses id="projects" as the section anchor', () => {
  const { container } = render(<Projects />)
  expect(container.querySelector('section#projects')).not.toBeNull()
})

it('renders the section label as a level-2 heading', () => {
  render(<Projects />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(site.sectionLabels.projects)
})

it('renders a card per project with its kicker, title, blurb, and tags', () => {
  render(<Projects />)
  for (const project of site.projects) {
    expect(screen.getByText(project.kicker)).toBeInTheDocument()
    expect(screen.getByText(project.title)).toBeInTheDocument()
    expect(screen.getByText(project.blurb)).toBeInTheDocument()
    for (const tag of project.tags) {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
    }
  }
})

it('renders every project as an article since none define a url', () => {
  const { container } = render(<Projects />)
  expect(site.projects.every((p) => !p.url)).toBe(true)
  expect(container.querySelectorAll('article')).toHaveLength(site.projects.length)
  expect(container.querySelectorAll('a[href]')).toHaveLength(0)
})

it('lays out the projects in a grid that collapses under 880px', () => {
  const { container } = render(<Projects />)
  expect(container.querySelector('[data-projects-grid]')).toHaveClass(styles.grid)
})
