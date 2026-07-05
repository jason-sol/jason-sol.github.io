import { render } from '@testing-library/react'
import { CursorTrail } from './CursorTrail'

function stubMatchMedia({ fine = true, reduced = false }: { fine?: boolean; reduced?: boolean } = {}) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('pointer') ? fine : query.includes('reduced-motion') ? reduced : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
}

describe('CursorTrail', () => {
  let rafSpy: ReturnType<typeof vi.spyOn>
  let cafSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1)
    cafSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    rafSpy.mockRestore()
    cafSpy.mockRestore()
    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
  })

  it('does not mount a canvas without a fine pointer', () => {
    stubMatchMedia({ fine: false })
    const { container } = render(<CursorTrail />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('does not mount a canvas under reduced motion', () => {
    stubMatchMedia({ reduced: true })
    const { container } = render(<CursorTrail />)
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('mounts a decorative, non-interactive canvas with a fine pointer and no reduced motion', () => {
    stubMatchMedia()
    const { container } = render(<CursorTrail />)
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })

  it('cancels its animation frame and removes its listeners on unmount', () => {
    stubMatchMedia()
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<CursorTrail />)
    unmount()
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('pauses its loop while the document is hidden and resumes when visible again', () => {
    stubMatchMedia()
    render(<CursorTrail />)
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
