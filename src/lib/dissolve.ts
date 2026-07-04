export interface DissolveCell {
  x: number
  y: number
  th: number
}

export interface CoverCrop {
  scale: number
  sx: number
  sy: number
  sw: number
  sh: number
}

export interface SourceRect {
  x: number
  y: number
  w: number
  h: number
}

/** Centered source rectangle of an iw×ih image that covers a w×h destination (CSS `object-fit: cover`). */
export function coverCrop(iw: number, ih: number, w: number, h: number): CoverCrop {
  const scale = Math.max(w / iw, h / ih)
  const sw = w / scale
  const sh = h / scale
  return { scale, sx: (iw - sw) / 2, sy: (ih - sh) / 2, sw, sh }
}

/** Back-projects a destination grid cell (cellX, cellY) of size cw×ch into the cropped source image. */
export function cellSourceRect(crop: CoverCrop, cellX: number, cellY: number, cw: number, ch: number): SourceRect {
  return {
    x: crop.sx + (cellX * cw) / crop.scale,
    y: crop.sy + (cellY * ch) / crop.scale,
    w: cw / crop.scale,
    h: ch / crop.scale,
  }
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
