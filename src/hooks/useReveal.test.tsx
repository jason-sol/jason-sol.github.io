import { act, render, screen } from '@testing-library/react'
import { MockIntersectionObserver } from '../test-setup'
import { useReveal } from './useReveal'

function Harness({ delay }: { delay?: number }) {
  const { ref, visible } = useReveal(delay)
  return <div ref={ref}>{visible ? 'visible' : 'hidden'}</div>
}

describe('useReveal', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances.length = 0
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is hidden before the observed element intersects', () => {
    render(<Harness />)
    expect(screen.getByText('hidden')).toBeInTheDocument()
  })

  it('becomes visible once the IntersectionObserver reports intersection', () => {
    const { container } = render(<Harness />)
    const [observer] = MockIntersectionObserver.instances
    act(() => observer.trigger(container.firstElementChild!, true))
    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('honours a delay before flipping visible', () => {
    vi.useFakeTimers()
    const { container } = render(<Harness delay={200} />)
    const [observer] = MockIntersectionObserver.instances
    act(() => observer.trigger(container.firstElementChild!, true))
    expect(screen.getByText('hidden')).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(200))
    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('unobserves the element after it has revealed', () => {
    const { container } = render(<Harness />)
    const [observer] = MockIntersectionObserver.instances
    const target = container.firstElementChild!
    act(() => observer.trigger(target, true))
    expect(observer.elements.has(target)).toBe(false)
  })

  it('clears a pending delay timer on unmount', () => {
    vi.useFakeTimers()
    const { container, unmount } = render(<Harness delay={200} />)
    const [observer] = MockIntersectionObserver.instances
    act(() => observer.trigger(container.firstElementChild!, true))
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('is visible immediately under reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    render(<Harness />)
    expect(screen.getByText('visible')).toBeInTheDocument()
  })
})
