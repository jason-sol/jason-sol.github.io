import { act, render } from '@testing-library/react'
import { Orb } from './Orb'

function stubMatchMedia({ reduced = false }: { reduced?: boolean } = {}) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('reduced-motion') ? reduced : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

function renderAnchors() {
  const heroName = document.createElement('div')
  heroName.setAttribute('data-orb-anchor', 'hero-name')
  document.body.appendChild(heroName)

  const end = document.createElement('div')
  end.setAttribute('data-orb-anchor', 'end')
  document.body.appendChild(end)

  const experienceDot = document.createElement('div')
  experienceDot.setAttribute('data-orb-anchor', 'experience')
  experienceDot.style.opacity = '1'
  document.body.appendChild(experienceDot)

  return { heroName, end, experienceDot }
}

describe('Orb', () => {
  let rafSpy: ReturnType<typeof vi.spyOn>
  let cafSpy: ReturnType<typeof vi.spyOn>
  let extraAnchors: HTMLElement[] = []

  beforeEach(() => {
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
    cafSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    extraAnchors = []
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    rafSpy.mockRestore()
    cafSpy.mockRestore()
    extraAnchors.forEach((el) => el.remove())
    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
  })

  it('renders no DOM when reduced motion is preferred', () => {
    stubMatchMedia({ reduced: true })
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    const { container } = render(<Orb introDone />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a fixed, pointer-events-none, aria-hidden holder when active', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    const { container } = render(<Orb introDone />)
    const holder = container.querySelector('[data-orb-holder]')
    expect(holder).not.toBeNull()
    expect(holder).toHaveAttribute('aria-hidden', 'true')
  })

  it('marks the experience timeline dot orb-hidden while active and clears it on unmount', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    const { unmount } = render(<Orb introDone />)
    expect(experienceDot.hasAttribute('data-orb-hidden')).toBe(true)
    unmount()
    expect(experienceDot.hasAttribute('data-orb-hidden')).toBe(false)
  })

  it('does not throw when fewer than two waypoints exist in the document', () => {
    stubMatchMedia()
    expect(() => render(<Orb introDone />)).not.toThrow()
  })

  it('does not start its animation loop until the intro has finished', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    render(<Orb introDone={false} />)
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('starts its animation loop once the intro finishes', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    const { rerender } = render(<Orb introDone={false} />)
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
    rerender(<Orb introDone />)
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('cancels its animation frame and removes its listeners on unmount', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<Orb introDone />)
    unmount()
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('marks the contact period orb-hidden while the orb sits on the end waypoint and clears it otherwise', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]

    const rafCallbacks: FrameRequestCallback[] = []
    rafSpy.mockImplementation(((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    }) as typeof window.requestAnimationFrame)

    render(<Orb introDone />)

    // Each frame re-schedules the next; the 0.16 smoothing needs a few frames to settle.
    const runFrames = (count: number) => {
      for (let f = 0; f < count; f++) {
        act(() => rafCallbacks.splice(0).forEach((cb) => cb(f)))
      }
    }

    // Past every measured waypoint: the active segment is the end waypoint and
    // the orb glides onto the period until it is inside the near radius.
    Object.defineProperty(window, 'scrollY', { value: 10_000, configurable: true })
    runFrames(30)
    expect(end.hasAttribute('data-orb-hidden')).toBe(true)

    // Back at the top: segment 0 is not the end waypoint, so the period returns.
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    runFrames(1)
    expect(end.hasAttribute('data-orb-hidden')).toBe(false)
  })

  it('re-targets a remounted anchor after a re-measure instead of tracking the detached node', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]

    const rafCallbacks: FrameRequestCallback[] = []
    rafSpy.mockImplementation(((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    }) as typeof window.requestAnimationFrame)

    // Entrance replays only happen once the intro has finished, so the loop is already running.
    const { container } = render(<Orb introDone />)

    // Hero's entrance replay remounts phase-0: the old anchor detaches and a new node appears.
    heroName.remove()
    const replacement = document.createElement('div')
    replacement.setAttribute('data-orb-anchor', 'hero-name')
    replacement.getBoundingClientRect = () =>
      ({ top: 100, bottom: 100, left: 150, right: 200, width: 50, height: 0, x: 150, y: 100, toJSON() {} }) as DOMRect
    document.body.appendChild(replacement)
    extraAnchors.push(replacement)

    // Any re-measure (resize / introDone / 1200ms timer) must heal the stale reference.
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    for (let f = 0; f < 80; f++) {
      act(() => rafCallbacks.splice(0).forEach((cb) => cb(f)))
    }

    const wrap = container.querySelector<HTMLElement>('[data-orb-holder]')!.lastElementChild as HTMLElement
    const match = /translate\((-?[\d.]+)px,(-?[\d.]+)px\)/.exec(wrap.style.transform)
    expect(match).not.toBeNull()
    // hero-name waypoint: side right, offset 44, size 18 → x = 200 + 44 - 18/2 = 235, y = 100 - 9 = 91.
    expect(Number(match![1])).toBeCloseTo(235, 0)
    expect(Number(match![2])).toBeCloseTo(91, 0)
  })

  it('clears the period orb-hidden marker on unmount', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]

    const rafCallbacks: FrameRequestCallback[] = []
    rafSpy.mockImplementation(((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    }) as typeof window.requestAnimationFrame)

    const { unmount } = render(<Orb introDone />)

    Object.defineProperty(window, 'scrollY', { value: 10_000, configurable: true })
    for (let f = 0; f < 30; f++) {
      act(() => rafCallbacks.splice(0).forEach((cb) => cb(f)))
    }
    expect(end.hasAttribute('data-orb-hidden')).toBe(true)

    // The host owns its own visibility via CSS; the orb only toggles the marker, so
    // unmount reverts the element to its stylesheet default by clearing the attribute.
    unmount()
    expect(end.hasAttribute('data-orb-hidden')).toBe(false)
  })

  it('never writes inline styles onto the elements it borrows', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]

    const rafCallbacks: FrameRequestCallback[] = []
    rafSpy.mockImplementation(((cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    }) as typeof window.requestAnimationFrame)

    render(<Orb introDone />)
    Object.defineProperty(window, 'scrollY', { value: 10_000, configurable: true })
    for (let f = 0; f < 30; f++) {
      act(() => rafCallbacks.splice(0).forEach((cb) => cb(f)))
    }
    // The dot started with inline opacity '1'; the orb must not have overwritten it.
    expect(experienceDot.style.opacity).toBe('1')
    expect(end.style.opacity).toBe('')
  })

  it('pauses its loop while the document is hidden and resumes when visible again', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    render(<Orb introDone />)
    const rafMock = window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>
    const callsBeforeHide = rafMock.mock.calls.length

    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect(rafMock.mock.calls.length).toBe(callsBeforeHide)

    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(rafMock.mock.calls.length).toBe(callsBeforeHide + 1)
  })
})
