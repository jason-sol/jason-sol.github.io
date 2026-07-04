export interface DissolveCell {
  x: number
  y: number
  th: number
}

/** Per-cell reveal thresholds for the Dissolve portrait — randomized, biased outward from center. */
export function makeDissolveCells(cols: number, rows: number, rng: () => number = Math.random): DissolveCell[] {
  const cells: DissolveCell[] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const radial = Math.hypot(x / cols - 0.5, y / rows - 0.5)
      cells.push({ x, y, th: rng() * 0.85 + radial * 0.3 })
    }
  }
  return cells
}
