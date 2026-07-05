import { orbLerp, orbSegment } from './orbPath'

describe('orbSegment', () => {
  const waypointYs = [0, 100, 300, 700]

  it('picks index 0 when scrollY is before every waypoint', () => {
    expect(orbSegment(-50, waypointYs)).toBe(0)
  })

  it('picks the last waypoint whose y is at or before scrollY', () => {
    expect(orbSegment(150, waypointYs)).toBe(1)
  })

  it('treats an exact match as at-or-before', () => {
    expect(orbSegment(300, waypointYs)).toBe(2)
  })

  it('picks the final waypoint once scrollY passes all of them', () => {
    expect(orbSegment(10_000, waypointYs)).toBe(3)
  })

  it('returns 0 for an empty waypoint list', () => {
    expect(orbSegment(500, [])).toBe(0)
  })
})

describe('orbLerp', () => {
  it('returns a at u=0 regardless of segment parity', () => {
    expect(orbLerp(0, 100, 0, 0)).toBeCloseTo(0)
    expect(orbLerp(0, 100, 0, 1)).toBeCloseTo(0)
  })

  it('returns b at u=1 regardless of segment parity', () => {
    expect(orbLerp(0, 100, 1, 0)).toBeCloseTo(100)
    expect(orbLerp(0, 100, 1, 1)).toBeCloseTo(100)
  })

  it('applies the cubic ease-in-out midpoint plus a +70px swing on even segments', () => {
    expect(orbLerp(0, 100, 0.5, 0)).toBeCloseTo(120)
  })

  it('flips the swing to -70px on odd segments', () => {
    expect(orbLerp(0, 100, 0.5, 1)).toBeCloseTo(-20)
  })

  it('clamps u below the 0..1 range', () => {
    expect(orbLerp(0, 100, -0.5, 0)).toBeCloseTo(orbLerp(0, 100, 0, 0))
  })

  it('clamps u above the 0..1 range', () => {
    expect(orbLerp(0, 100, 1.5, 0)).toBeCloseTo(orbLerp(0, 100, 1, 0))
  })
})
