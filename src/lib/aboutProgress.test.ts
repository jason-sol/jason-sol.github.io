import { portraitProgress, wordsProgress } from './aboutProgress'

const VH = 1000

describe('portraitProgress', () => {
  it('is 0 while the section top sits at or below 92% of the viewport', () => {
    expect(portraitProgress(VH * 0.92, VH)).toBe(0)
    expect(portraitProgress(VH * 1.2, VH)).toBe(0)
  })

  it('reaches its 1.35 maximum once the top has travelled the full 85%-of-viewport window', () => {
    expect(portraitProgress(VH * 0.07, VH)).toBeCloseTo(1.35)
  })

  it('clamps at 1.35 when scrolled far past the window (the dissolve overshoot)', () => {
    expect(portraitProgress(-VH, VH)).toBeCloseTo(1.35)
  })

  it('progresses linearly inside the window', () => {
    // Halfway through the 0.85vh window: top = 0.92vh - 0.425vh.
    expect(portraitProgress(VH * 0.495, VH)).toBeCloseTo(0.675)
  })
})

describe('wordsProgress', () => {
  it('is 0 while the paragraph top sits at or below 85% of the viewport', () => {
    expect(wordsProgress(VH * 0.85, VH)).toBe(0)
    expect(wordsProgress(VH * 1.2, VH)).toBe(0)
  })

  it('reaches 1 once the top has travelled the full 55%-of-viewport window', () => {
    expect(wordsProgress(VH * 0.3, VH)).toBeCloseTo(1)
  })

  it('clamps at 1 when scrolled far past the window', () => {
    expect(wordsProgress(-VH, VH)).toBe(1)
  })

  it('progresses linearly inside the window', () => {
    // Halfway through the 0.55vh window: top = 0.85vh - 0.275vh.
    expect(wordsProgress(VH * 0.575, VH)).toBeCloseTo(0.5)
  })
})
