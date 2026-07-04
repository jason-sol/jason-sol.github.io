import { makeDissolveCells } from './dissolve'

function seededRng(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

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
