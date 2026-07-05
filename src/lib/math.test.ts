import { clamp, linearStep, quantize, SCROLL_EPSILON } from './math'

describe('clamp', () => {
  it('returns the value when inside the range', () => expect(clamp(0.5, 0, 1)).toBe(0.5))
  it('clamps below the minimum', () => expect(clamp(-2, 0, 1)).toBe(0))
  it('clamps above the maximum', () => expect(clamp(2, 0, 1)).toBe(1))
})

describe('quantize', () => {
  it('snaps a value down to the nearest step multiple', () => expect(quantize(0.6339, 0.004)).toBeCloseTo(0.632))
  it('leaves exact multiples unchanged', () => expect(quantize(0.632, 0.004)).toBeCloseTo(0.632))
  it('maps nearby values within one step to the same result', () =>
    expect(quantize(0.6339, 0.004)).toBe(quantize(0.6341, 0.004)))
  it('snaps 0 to 0', () => expect(quantize(0, 0.004)).toBe(0))
})

describe('linearStep', () => {
  it('is 0 at or before the range start', () => {
    expect(linearStep(0.1, 0.2, 0.4)).toBe(0)
    expect(linearStep(0.2, 0.2, 0.4)).toBe(0)
  })
  it('is 1 at or after the range end', () => {
    expect(linearStep(0.4, 0.2, 0.4)).toBe(1)
    expect(linearStep(0.9, 0.2, 0.4)).toBe(1)
  })
  it('interpolates linearly inside the range', () => expect(linearStep(0.3, 0.2, 0.4)).toBeCloseTo(0.5))
})

describe('SCROLL_EPSILON', () => {
  it('is the shared scroll-quantization step used by About, Experience and DissolvePortrait', () => {
    expect(SCROLL_EPSILON).toBe(0.004)
  })
})
