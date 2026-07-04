import { timelineProgress } from './timeline'

describe('timelineProgress', () => {
  const vh = 800
  const height = 1000

  it('is 0 before the section enters the trigger zone', () => {
    expect(timelineProgress(2000, height, vh)).toBe(0)
  })

  it('is 1 once 90% of the section height has been traversed', () => {
    const top = vh * 0.75 - height * 0.9
    expect(timelineProgress(top, height, vh)).toBe(1)
  })

  it('clamps to 1 for top values further negative than the traversal threshold', () => {
    expect(timelineProgress(-5000, height, vh)).toBe(1)
  })

  it('interpolates linearly between the thresholds', () => {
    const top = vh * 0.75 - height * 0.9 * 0.5
    expect(timelineProgress(top, height, vh)).toBeCloseTo(0.5)
  })
})
