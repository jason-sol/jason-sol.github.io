import { fireEvent, render, screen } from '@testing-library/react'
import { IntroOverlay } from './IntroOverlay'

describe('IntroOverlay', () => {
  const originalOverflow = document.documentElement.style.overflow

  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(0)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
    vi.restoreAllMocks()
    window.location.hash = ''
    document.documentElement.style.overflow = originalOverflow
  })

  it('does not render when reduced motion is preferred', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    render(<IntroOverlay onDone={vi.fn()} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('does not render when location.hash is present', () => {
    window.location.hash = '#contact'
    render(<IntroOverlay onDone={vi.fn()} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('calls onDone once with played=false when skipped', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const onDone = vi.fn()
    render(<IntroOverlay onDone={onDone} />)
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith(false)
  })

  it('renders a dialog with a skip affordance', () => {
    render(<IntroOverlay onDone={vi.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Intro' })).toBeInTheDocument()
    expect(screen.getByText('CLICK TO SKIP')).toBeInTheDocument()
  })

  it('calls onDone with played=true when clicked', () => {
    const onDone = vi.fn()
    render(<IntroOverlay onDone={onDone} />)
    fireEvent.click(screen.getByRole('dialog'))
    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledWith(true)
  })

  it('calls onDone on Escape keydown', () => {
    const onDone = vi.fn()
    render(<IntroOverlay onDone={onDone} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('does not call onDone twice when finished more than once', () => {
    const onDone = vi.fn()
    render(<IntroOverlay onDone={onDone} />)
    fireEvent.click(screen.getByRole('dialog'))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll while showing and restores it once finished', () => {
    document.documentElement.style.overflow = ''
    render(<IntroOverlay onDone={vi.fn()} />)
    expect(document.documentElement.style.overflow).toBe('hidden')
    fireEvent.click(screen.getByRole('dialog'))
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('does not call onDone when unmounted mid-intro, but still cleans up', () => {
    document.documentElement.style.overflow = ''
    const onDone = vi.fn()
    const { unmount } = render(<IntroOverlay onDone={onDone} />)
    expect(document.documentElement.style.overflow).toBe('hidden')

    unmount()

    expect(onDone).not.toHaveBeenCalled()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('auto-finishes at 3340ms', () => {
    vi.useFakeTimers()
    const onDone = vi.fn()
    render(<IntroOverlay onDone={onDone} />)
    vi.advanceTimersByTime(3339)
    expect(onDone).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
