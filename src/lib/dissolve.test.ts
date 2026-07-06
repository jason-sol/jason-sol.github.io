import { cellSourceRect, coverCrop, makeDissolveCells } from './dissolve'

function seededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function expectCloseTo(actualObject: object, expected: Record<string, number>) {
  const actual = actualObject as Record<string, number>
  expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort())
  for (const key of Object.keys(expected)) {
    expect(actual[key], key).toBeCloseTo(expected[key], 6)
  }
}

describe('coverCrop', () => {
  it('crops the sides of a wider-than-tall image', () => {
    // 2000×1000 into 440×550: height limits, so the sides are cropped.
    expectCloseTo(coverCrop(2000, 1000, 440, 550), { scale: 0.55, sx: 600, sy: 0, sw: 800, sh: 1000 })
  })

  it('crops the top and bottom of a taller-than-wide image', () => {
    // 880×2200 into 440×550: width limits, so top/bottom are cropped.
    expectCloseTo(coverCrop(880, 2200, 440, 550), { scale: 0.5, sx: 0, sy: 550, sw: 880, sh: 1100 })
  })

  it('uses the full image when aspect ratios match', () => {
    expectCloseTo(coverCrop(880, 1100, 440, 550), { scale: 0.5, sx: 0, sy: 0, sw: 880, sh: 1100 })
  })
})

describe('cellSourceRect', () => {
  it('back-projects a destination cell into the cropped source image', () => {
    const crop = coverCrop(2000, 1000, 440, 550) // scale 0.55, sx 600, sy 0
    // Cell (2, 3) with 27.5×27.5 destination cells.
    expectCloseTo(cellSourceRect(crop, 2, 3, 27.5, 27.5), {
      x: 600 + (2 * 27.5) / 0.55,
      y: (3 * 27.5) / 0.55,
      w: 27.5 / 0.55,
      h: 27.5 / 0.55,
    })
  })

  it('maps cell (0, 0) to the crop origin', () => {
    const crop = coverCrop(880, 2200, 440, 550) // sx 0, sy 550
    expectCloseTo(cellSourceRect(crop, 0, 0, 27.5, 27.5), { x: 0, y: 550, w: 55, h: 55 })
  })
})

describe('makeDissolveCells', () => {
  it('returns one cell per column/row combination', () => {
    expect(makeDissolveCells(16, 20, seededRng(1))).toHaveLength(320)
  })

  it('keeps thresholds within the expected range', () => {
    const cells = makeDissolveCells(16, 20, seededRng(1))
    for (const cell of cells) {
      expect(cell.th).toBeGreaterThanOrEqual(0)
      expect(cell.th).toBeLessThanOrEqual(1.5)
    }
  })

  it('is deterministic for a seeded rng', () => {
    const a = makeDissolveCells(16, 20, seededRng(42))
    const b = makeDissolveCells(16, 20, seededRng(42))
    expect(a).toEqual(b)
  })

  it('biases thresholds radially: corners average higher than the center', () => {
    const cols = 16
    const rows = 20
    const cells = makeDissolveCells(cols, rows, () => 0.5)

    const corners = cells.filter(
      (c) => (c.x === 0 || c.x === cols - 1) && (c.y === 0 || c.y === rows - 1),
    )
    const centerX = Math.floor(cols / 2)
    const centerY = Math.floor(rows / 2)
    const center = cells.filter((c) => c.x === centerX && c.y === centerY)

    const avg = (arr: { th: number }[]) => arr.reduce((sum, c) => sum + c.th, 0) / arr.length
    expect(avg(corners)).toBeGreaterThan(avg(center))
  })
})
