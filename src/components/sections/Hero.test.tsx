import { act, render, screen } from '@testing-library/react'
import type { HeadlineSegment } from '../../content/site'
import { site } from '../../content/site'
import { Hero } from './Hero'

function segmentText(seg: HeadlineSegment): string {
  return 'text' in seg ? seg.text : `${site.stats[seg.statKey].value} ${site.stats[seg.statKey].label}`
}

it('renders every hero phase headline segment from the content model', () => {
  const { container } = render(<Hero />)
  for (const phase of site.heroPhases) {
    for (const seg of phase.headline) {
      expect(container.textContent).toContain(segmentText(seg))
    }
  }
})

it('uses id="top" as the scroll-story anchor', () => {
  const { container } = render(<Hero />)
  expect(container.querySelector('#top')).not.toBeNull()
})

it('renders the page name as the only level-1 heading', () => {
  render(<Hero />)
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
})

it('gives the h1 an accessible name with real whitespace between the words', () => {
  render(<Hero />)
  expect(screen.getByRole('heading', { level: 1, name: 'JASON SOLANKI' })).toBeInTheDocument()
})

it('stacks each phase-0 headline segment in its own block line wrapper', () => {
  const { container } = render(<Hero />)
  const lines = container.querySelectorAll('h1 [data-name-line]')
  expect(lines).toHaveLength(site.heroPhases[0].headline.length)
  const texts = Array.from(lines).map((line) => line.textContent?.trim())
  expect(texts).toEqual(site.heroPhases[0].headline.map((seg) => segmentText(seg)))
})

it('renders a progress-rail dot per hero phase', () => {
  const { container } = render(<Hero />)
  expect(container.querySelectorAll('[data-progress-dot]')).toHaveLength(site.heroPhases.length)
})

it('hides the decorative backdrop from assistive tech', () => {
  const { container } = render(<Hero />)
  expect(container.querySelector('[data-hero-backdrop]')).toHaveAttribute('aria-hidden', 'true')
})

it("keeps the page's only h1 in the accessibility tree even once its phase has fully faded from view", () => {
  const rafCallbacks: FrameRequestCallback[] = []
  const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(((cb: FrameRequestCallback) => {
    rafCallbacks.push(cb)
    return rafCallbacks.length
  }) as typeof window.requestAnimationFrame)
  // A scroll position past the whole 380vh Hero story: phase 0's opacity settles to 0.
  const rectSpy = vi
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(
      () => ({ top: -4232, left: 0, right: 0, bottom: 0, width: 0, height: 5000, x: 0, y: 0, toJSON() {} }) as DOMRect,
    )

  const { container } = render(<Hero />)
  act(() => rafCallbacks.splice(0).forEach((cb) => cb(0)))

  const h1 = container.querySelector('h1')!
  const phaseNameWrapper = h1.closest('[data-entrance]') as HTMLElement
  expect(phaseNameWrapper.style.visibility).not.toBe('hidden')

  rafSpy.mockRestore()
  rectSpy.mockRestore()
})

describe('entrance replay', () => {
  it('keeps the phase-0 content mounted when entranceKey is unchanged', () => {
    const { container, rerender } = render(<Hero entranceKey={0} />)
    const before = container.querySelector('h1')
    rerender(<Hero entranceKey={0} />)
    const after = container.querySelector('h1')
    expect(after).toBe(before)
  })

  it('remounts the phase-0 content when entranceKey changes, replaying the rise animation', () => {
    const { container, rerender } = render(<Hero entranceKey={0} />)
    const before = container.querySelector('h1')
    rerender(<Hero entranceKey={1} />)
    const after = container.querySelector('h1')
    expect(after).not.toBeNull()
    expect(after).not.toBe(before)
  })
})
