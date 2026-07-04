import { clamp, smoothstep } from './math'

describe('clamp', () => {
  it('returns the value when inside the range', () => expect(clamp(0.5, 0, 1)).toBe(0.5))
  it('clamps below the minimum', () => expect(clamp(-2, 0, 1)).toBe(0))
  it('clamps above the maximum', () => expect(clamp(2, 0, 1)).toBe(1))
})

describe('smoothstep', () => {
  it('is 0 at or before the range start', () => {
    expect(smoothstep(0.1, 0.2, 0.4)).toBe(0)
    expect(smoothstep(0.2, 0.2, 0.4)).toBe(0)
  })
  it('is 1 at or after the range end', () => {
    expect(smoothstep(0.4, 0.2, 0.4)).toBe(1)
    expect(smoothstep(0.9, 0.2, 0.4)).toBe(1)
  })
  it('interpolates linearly inside the range', () => expect(smoothstep(0.3, 0.2, 0.4)).toBeCloseTo(0.5))
})
