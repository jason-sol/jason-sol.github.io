import { act, renderHook } from '@testing-library/react'
import { useScrollFrame } from './useScrollFrame'

describe('useScrollFrame', () => {
  let rafCallbacks: FrameRequestCallback[]
  let rafSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    rafCallbacks = []
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })
  })

  afterEach(() => {
    rafSpy.mockRestore()
  })

  const flushRaf = () => {
    act(() => {
      const pending = rafCallbacks.splice(0)
      pending.forEach((cb) => cb(0))
    })
  }

  it('invokes onFrame once on mount', () => {
    const onFrame = vi.fn()
    renderHook(() => useScrollFrame(onFrame))
    flushRaf()
    expect(onFrame).toHaveBeenCalledTimes(1)
  })

  it('invokes onFrame when the window scrolls', () => {
    const onFrame = vi.fn()
    renderHook(() => useScrollFrame(onFrame))
    flushRaf()
    onFrame.mockClear()

    window.dispatchEvent(new Event('scroll'))
    flushRaf()

    expect(onFrame).toHaveBeenCalledTimes(1)
  })

  it('invokes onFrame when the window resizes', () => {
    const onFrame = vi.fn()
    renderHook(() => useScrollFrame(onFrame))
    flushRaf()
    onFrame.mockClear()

    window.dispatchEvent(new Event('resize'))
    flushRaf()

    expect(onFrame).toHaveBeenCalledTimes(1)
  })

  it('coalesces multiple scroll events into one frame', () => {
    const onFrame = vi.fn()
    renderHook(() => useScrollFrame(onFrame))
    flushRaf()
    rafSpy.mockClear()
    onFrame.mockClear()

    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))

    expect(rafSpy).toHaveBeenCalledTimes(1)
    flushRaf()
    expect(onFrame).toHaveBeenCalledTimes(1)
  })

  it('always calls the latest onFrame closure', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = renderHook(({ cb }) => useScrollFrame(cb), { initialProps: { cb: first } })
    flushRaf()
    rerender({ cb: second })

    window.dispatchEvent(new Event('scroll'))
    flushRaf()

    expect(second).toHaveBeenCalledTimes(1)
  })

  it('removes listeners and stops firing after unmount', () => {
    const onFrame = vi.fn()
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useScrollFrame(onFrame))
    flushRaf()
    onFrame.mockClear()

    unmount()
    window.dispatchEvent(new Event('scroll'))
    flushRaf()

    expect(onFrame).not.toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    removeSpy.mockRestore()
  })
})
