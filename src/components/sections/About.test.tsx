import { act, render, screen } from '@testing-library/react'
import { Profiler } from 'react'
import { site } from '../../content/site'
import { splitWords } from '../../lib/splitWords'
import statCounterStyles from '../ui/StatCounter.module.css'
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

it('exposes the statement to assistive tech exactly once, via a plain copy', () => {
  render(<About />)
  // The word-by-word animated copy is decoration; a single plain-text copy carries the content.
  expect(screen.getByText(site.about.statement)).toBeInTheDocument()
})

it('hides the animated word-span copy from assistive tech', () => {
  const { container } = render(<About />)
  const animatedCopy = container.querySelector('[data-word]')?.closest('p')
  expect(animatedCopy).toHaveAttribute('aria-hidden', 'true')
})

it('renders a StatCounter per about stat with its caption', () => {
  render(<About />)
  for (const stat of site.about.stats) {
    expect(screen.getByText(stat.caption)).toBeInTheDocument()
  }
})

it('styles the value of accent-flagged stats with the accent class', () => {
  const { container } = render(<About />)
  const accentCount = site.about.stats.filter((s) => s.accent).length
  expect(accentCount).toBeGreaterThan(0)
  expect(container.querySelectorAll(`.${statCounterStyles.valueAccent}`)).toHaveLength(accentCount)
})

it('renders the portrait in a figure with the content-model caption', () => {
  render(<About />)
  const figure = screen.getByRole('figure')
  expect(figure).toContainElement(screen.getByText(site.about.figCaption))
})

describe('scroll state quantization', () => {
  let rafCallbacks: FrameRequestCallback[]
  let rafSpy: ReturnType<typeof vi.spyOn>
  let rectSpy: ReturnType<typeof vi.spyOn>
  let top: number

  beforeEach(() => {
    rafCallbacks = []
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })
    rectSpy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
      () =>
        ({
          top,
          left: 0,
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          toJSON() {},
        }) as DOMRect,
    )
  })

  afterEach(() => {
    rafSpy.mockRestore()
    rectSpy.mockRestore()
  })

  const flushRaf = () => {
    act(() => {
      const pending = rafCallbacks.splice(0)
      pending.forEach((cb) => cb(0))
    })
  }

  it('skips re-rendering for sub-epsilon scroll deltas but re-renders for real movement', () => {
    let commits = 0
    top = 402
    render(
      <Profiler id="about" onRender={() => commits++}>
        <About />
      </Profiler>,
    )
    flushRaf()

    // Settling frame: React renders once more before bailing out on a first same-value update.
    window.dispatchEvent(new Event('scroll'))
    flushRaf()
    const baseline = commits

    // Sub-epsilon movement: same quantized portrait progress and lit word count.
    top = 401.5
    window.dispatchEvent(new Event('scroll'))
    flushRaf()
    expect(commits).toBe(baseline)

    // Real movement: state must update.
    top = 100
    window.dispatchEvent(new Event('scroll'))
    flushRaf()
    expect(commits).toBeGreaterThan(baseline)
  })
})
