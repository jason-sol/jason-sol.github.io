import { prefersReducedMotion } from './motion'

describe('prefersReducedMotion', () => {
  it('returns false when matchMedia is unavailable', () => {
    expect(window.matchMedia).toBeUndefined()
    expect(prefersReducedMotion()).toBe(false)
  })

  it('queries the reduced-motion media feature and returns its match', () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    vi.stubGlobal('matchMedia', matchMedia)
    expect(prefersReducedMotion()).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    vi.unstubAllGlobals()
  })

  it('returns false when the media feature does not match', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
    expect(prefersReducedMotion()).toBe(false)
    vi.unstubAllGlobals()
  })
})
