import { act, renderHook } from '@testing-library/react'
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  let rafCallbacks: FrameRequestCallback[]
  let now: number

  beforeEach(() => {
    rafCallbacks = []
    now = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    vi.spyOn(performance, 'now').mockImplementation(() => now)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const flush = (time: number) => {
    now = time
    const pending = rafCallbacks.splice(0)
    act(() => {
      pending.forEach((cb) => cb(now))
    })
  }

  it('reaches the target value by 1400ms', () => {
    const { result } = renderHook(() => useCountUp(70))
    flush(0)
    flush(700)
    flush(1400)
    expect(result.current).toBe(70)
  })

  it('counts up monotonically', () => {
    const { result } = renderHook(() => useCountUp(70))
    const values: number[] = []
    for (const t of [0, 350, 700, 1050, 1400]) {
      flush(t)
      values.push(result.current)
    }
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1])
    }
  })

  it('returns the target immediately under reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const { result } = renderHook(() => useCountUp(70))
    expect(result.current).toBe(70)
  })
})
