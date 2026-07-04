import { render, screen } from '@testing-library/react'
import { site } from '../../content/site'
import { splitWords } from '../../lib/splitWords'
import { About } from './About'

it('uses id="about" as the section anchor', () => {
  const { container } = render(<About />)
  expect(container.querySelector('section#about')).not.toBeNull()
})

it('renders the section label as a level-2 heading', () => {
  render(<About />)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(site.sectionLabels.about)
})

it('splits the statement into one span per word', () => {
  const { container } = render(<About />)
  const words = splitWords(site.about.statement)
  const spans = container.querySelectorAll('[data-word]')
  expect(spans).toHaveLength(words.length)
  expect(Array.from(spans).map((s) => s.textContent?.trim())).toEqual(words)
})

it('renders a StatCounter per about stat with its caption', () => {
  render(<About />)
  for (const stat of site.about.stats) {
    expect(screen.getByText(stat.caption)).toBeInTheDocument()
  }
})

it('renders the portrait in a figure with the content-model caption', () => {
  render(<About />)
  const figure = screen.getByRole('figure')
  expect(figure).toContainElement(screen.getByText(site.about.figCaption))
})
