import { act, renderHook } from '@testing-library/react'
import { useMediaQuery, usePrefersFinePointer, useReducedMotion } from './useMediaQuery'

function createMatchMediaMock(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mql = {
    get matches() {
      return matches
    },
    media: '',
    addEventListener: vi.fn((_event: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.add(cb)
    }),
    removeEventListener: vi.fn((_event: string, cb: (event: MediaQueryListEvent) => void) => {
      listeners.delete(cb)
    }),
  }
  const change = (next: boolean) => {
    matches = next
    listeners.forEach((cb) => cb({ matches: next } as MediaQueryListEvent))
  }
  return { mql, change }
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reflects the mocked matchMedia state', () => {
    const { mql } = createMatchMediaMock(true)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))
    const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'))
    expect(result.current).toBe(true)
  })

  it('updates live when the media query change event fires', () => {
    const { mql, change } = createMatchMediaMock(false)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))
    const { result } = renderHook(() => useMediaQuery('(pointer: fine)'))
    expect(result.current).toBe(false)
    act(() => change(true))
    expect(result.current).toBe(true)
  })

  it('removes its change listener on unmount', () => {
    const { mql } = createMatchMediaMock(false)
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))
    const { unmount } = renderHook(() => useMediaQuery('(pointer: fine)'))
    expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    unmount()
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})

describe('useReducedMotion', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('queries the reduced-motion media feature', () => {
    const { mql } = createMatchMediaMock(true)
    const matchMedia = vi.fn().mockReturnValue(mql)
    vi.stubGlobal('matchMedia', matchMedia)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
})

describe('usePrefersFinePointer', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('queries the fine-pointer media feature', () => {
    const { mql } = createMatchMediaMock(true)
    const matchMedia = vi.fn().mockReturnValue(mql)
    vi.stubGlobal('matchMedia', matchMedia)
    const { result } = renderHook(() => usePrefersFinePointer())
    expect(result.current).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith('(pointer: fine)')
  })
})
