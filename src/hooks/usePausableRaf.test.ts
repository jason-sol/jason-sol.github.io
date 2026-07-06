import { renderHook } from '@testing-library/react'
import { usePausableRaf } from './usePausableRaf'

describe('usePausableRaf', () => {
  let rafSpy: ReturnType<typeof vi.spyOn>
  let cafSpy: ReturnType<typeof vi.spyOn>
  let pending: Map<number, FrameRequestCallback>
  let nextId: number

  beforeEach(() => {
    pending = new Map()
    nextId = 1
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(((cb: FrameRequestCallback) => {
      const id = nextId++
      pending.set(id, cb)
      return id
    }) as typeof window.requestAnimationFrame)
    cafSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(((id: number) => {
      pending.delete(id)
    }) as typeof window.cancelAnimationFrame)
  })

  afterEach(() => {
    rafSpy.mockRestore()
    cafSpy.mockRestore()
    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
  })

  const runFrames = (count: number) => {
    for (let f = 0; f < count; f++) {
      const due = [...pending.values()]
      pending.clear()
      due.forEach((cb) => cb(f))
    }
  }

  it('does not schedule a frame while inactive', () => {
    renderHook(() => usePausableRaf(vi.fn(), false))
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
  })

  it('calls the callback every frame while active', () => {
    const callback = vi.fn()
    renderHook(() => usePausableRaf(callback, true))
    runFrames(3)
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('starts scheduling once it becomes active', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(({ active }) => usePausableRaf(callback, active), {
      initialProps: { active: false },
    })
    expect(window.requestAnimationFrame).not.toHaveBeenCalled()
    rerender({ active: true })
    expect(window.requestAnimationFrame).toHaveBeenCalled()
  })

  it('cancels the frame and stops calling the callback on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => usePausableRaf(callback, true))
    unmount()
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    const callsBeforeUnmount = callback.mock.calls.length
    runFrames(3)
    expect(callback).toHaveBeenCalledTimes(callsBeforeUnmount)
  })

  it('always invokes the latest callback, even if the reference changes between renders', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = renderHook(({ cb }: { cb: () => void }) => usePausableRaf(cb, true), {
      initialProps: { cb: first },
    })
    rerender({ cb: second })
    runFrames(1)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('pauses while the document is hidden and resumes when visible again', () => {
    const callback = vi.fn()
    renderHook(() => usePausableRaf(callback, true))
    const callsBeforeHide = (window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mock.calls.length

    Object.defineProperty(document, 'hidden', { value: true, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    expect((window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
      callsBeforeHide,
    )

    Object.defineProperty(document, 'hidden', { value: false, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
    expect((window.requestAnimationFrame as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(
      callsBeforeHide + 1,
    )
  })

  it('removes its visibilitychange listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderHook(() => usePausableRaf(vi.fn(), true))
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })
})
