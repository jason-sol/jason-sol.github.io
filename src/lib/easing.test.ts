import { easeOutCubic } from './easing'

describe('easeOutCubic', () => {
  it('is 0 at the start', () => expect(easeOutCubic(0)).toBe(0))
  it('is 1 at the end', () => expect(easeOutCubic(1)).toBe(1))
  it('is 0.875 halfway through', () => expect(easeOutCubic(0.5)).toBe(0.875))
})
