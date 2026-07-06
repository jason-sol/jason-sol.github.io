import { act, renderHook } from '@testing-library/react'
import type { RefObject } from 'react'
import { useScrollProgress } from './useScrollProgress'

function makeRef(rect: Partial<DOMRect>): RefObject<HTMLElement> {
  const el = document.createElement('div')
  el.getBoundingClientRect = () =>
    ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON() {},
      ...rect,
    }) as DOMRect
  return { current: el }
}

describe('useScrollProgress', () => {
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

  it('computes progress as -top / (height - viewport height)', () => {
    const height = 4 * window.innerHeight
    const ref = makeRef({ top: -1000, height })

    const { result } = renderHook(() => useScrollProgress(ref))
    flushRaf()

    const expected = 1000 / (height - window.innerHeight)
    expect(result.current).toBeCloseTo(expected)
  })

  it('throttles multiple scroll events into a single recompute per animation frame', () => {
    const ref = makeRef({ top: -500, height: 4 * window.innerHeight })
    renderHook(() => useScrollProgress(ref))
    flushRaf()
    rafSpy.mockClear()

    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))

    expect(rafSpy).toHaveBeenCalledTimes(1)
    flushRaf()
  })

  it('removes the scroll and resize listeners on unmount', () => {
    const ref = makeRef({ top: 0, height: 4 * window.innerHeight })
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useScrollProgress(ref))
    flushRaf()
    unmount()

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    removeSpy.mockRestore()
  })
})
