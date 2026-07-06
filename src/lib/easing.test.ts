import { easeInOutCubic, easeInOutQuad, easeOutCubic } from './easing'

describe('easeOutCubic', () => {
  it('is 0 at the start', () => expect(easeOutCubic(0)).toBe(0))
  it('is 1 at the end', () => expect(easeOutCubic(1)).toBe(1))
  it('is 0.875 halfway through', () => expect(easeOutCubic(0.5)).toBe(0.875))
})

describe('easeInOutCubic', () => {
  it('starts at 0', () => expect(easeInOutCubic(0)).toBe(0))
  it('ends at 1', () => expect(easeInOutCubic(1)).toBe(1))
  it('passes through 0.5 at the midpoint', () => expect(easeInOutCubic(0.5)).toBeCloseTo(0.5))
  it('follows the cubic-in shape below the midpoint (4t^3)', () =>
    expect(easeInOutCubic(0.25)).toBeCloseTo(4 * 0.25 ** 3))
  it('follows the cubic-out shape above the midpoint (1 - (-2t+2)^3 / 2)', () =>
    expect(easeInOutCubic(0.75)).toBeCloseTo(1 - 0.5 ** 3 / 2))
  it('clamps inputs outside 0..1', () => {
    expect(easeInOutCubic(-2)).toBe(0)
    expect(easeInOutCubic(3)).toBe(1)
  })
})

describe('easeInOutQuad', () => {
  it('starts at 0', () => expect(easeInOutQuad(0)).toBe(0))
  it('ends at 1', () => expect(easeInOutQuad(1)).toBe(1))
  it('passes through 0.5 at the midpoint', () => expect(easeInOutQuad(0.5)).toBeCloseTo(0.5))
  it('follows the quadratic-in shape below the midpoint (2t^2)', () =>
    expect(easeInOutQuad(0.25)).toBeCloseTo(2 * 0.25 ** 2))
  it('follows the quadratic-out shape above the midpoint (1 - (-2t+2)^2 / 2)', () =>
    expect(easeInOutQuad(0.75)).toBeCloseTo(1 - 0.5 ** 2 / 2))
  it('clamps inputs outside 0..1', () => {
    expect(easeInOutQuad(-2)).toBe(0)
    expect(easeInOutQuad(3)).toBe(1)
  })
})
