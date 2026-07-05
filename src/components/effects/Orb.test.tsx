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

  it('hides the experience timeline dot while active and restores it on unmount', () => {
    stubMatchMedia()
    const { heroName, end, experienceDot } = renderAnchors()
    extraAnchors = [heroName, end, experienceDot]
    const { unmount } = render(<Orb introDone />)
    expect(experienceDot.style.opacity).toBe('0')
    unmount()
    expect(experienceDot.style.opacity).toBe('1')
  })

  it('does not throw when fewer than two waypoints exist in the document', () => {
    stubMatchMedia()
    expect(() => render(<Orb introDone />)).not.toThrow()
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

  it('hides the contact period while the orb sits on the end waypoint and shows it otherwise', () => {
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
    expect(end.style.opacity).toBe('0')

    // Back at the top: segment 0 is not the end waypoint, so the period returns.
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    runFrames(1)
    expect(end.style.opacity).toBe('1')
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
