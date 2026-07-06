import { phaseStyle, activePhaseIndex, hintOpacity, phaseAnchorRatios } from './heroPhases'

describe('phaseStyle', () => {
  it('phase 0 fully visible at p=0', () => expect(phaseStyle(0, 0).opacity).toBe(1))
  it('phase 0 gone by p=0.29', () => expect(phaseStyle(0, 0.29).opacity).toBe(0))
  it('phase 1 hidden at p=0.27, visible at p=0.40', () => {
    expect(phaseStyle(1, 0.27).opacity).toBe(0)
    expect(phaseStyle(1, 0.4).opacity).toBe(1)
  })
  it('phase 3 stays visible at p=1 (out-range beyond scroll)', () =>
    expect(phaseStyle(3, 1).opacity).toBe(1))
})
describe('activePhaseIndex', () => {
  it.each([
    [0.1, 0],
    [0.3, 1],
    [0.6, 2],
    [0.9, 3],
  ])('p=%f → %i', (p, i) => expect(activePhaseIndex(p)).toBe(i))

  it('switches at the midpoint of each crossfade window, derived from the phase ranges', () => {
    // Crossfade window i: previous phase starts fading out → phase i finishes fading in.
    // (0.2+0.35)/2, (0.46+0.6)/2, (0.71+0.85)/2
    expect(activePhaseIndex(0.274)).toBe(0)
    expect(activePhaseIndex(0.276)).toBe(1)
    expect(activePhaseIndex(0.529)).toBe(1)
    expect(activePhaseIndex(0.531)).toBe(2)
    expect(activePhaseIndex(0.779)).toBe(2)
    expect(activePhaseIndex(0.781)).toBe(3)
  })
})

describe('phaseAnchorRatios', () => {
  it('anchors each phase at the midpoint of its fade-in window', () => {
    expect(phaseAnchorRatios).toHaveLength(4)
    const expected = [0, 0.31, 0.56, 0.81]
    phaseAnchorRatios.forEach((ratio, i) => expect(ratio).toBeCloseTo(expected[i], 10))
  })

  it('orders anchors strictly ascending so the orb travels monotonically through the story', () => {
    for (let i = 1; i < phaseAnchorRatios.length; i++) {
      expect(phaseAnchorRatios[i]).toBeGreaterThan(phaseAnchorRatios[i - 1])
    }
  })
})
describe('hintOpacity', () => {
  it('fully visible before the fade window', () => {
    expect(hintOpacity(0)).toBe(1)
    expect(hintOpacity(0.02)).toBe(1)
  })
  it('fades to half way through the window', () => expect(hintOpacity(0.06)).toBeCloseTo(0.5))
  it('fully faded from p=0.1 onward', () => {
    expect(hintOpacity(0.1)).toBe(0)
    expect(hintOpacity(1)).toBe(0)
  })
})
