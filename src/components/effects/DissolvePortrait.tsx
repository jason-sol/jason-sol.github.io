import { useEffect, useRef, useState } from 'react'
import { cellSourceRect, coverCrop, makeDissolveCells } from '../../lib/dissolve'
import type { DissolveCell } from '../../lib/dissolve'
import { SCROLL_EPSILON } from '../../lib/math'
import styles from './DissolvePortrait.module.css'

const COLS = 16
const ROWS = 20
const WIDTH = 440
const HEIGHT = 550
const MAX_DPR = 2
const NEAR_EDGE_BAND = 0.06
const REDRAW_EPSILON = SCROLL_EPSILON

function getDpr(): number {
  return Math.min(MAX_DPR, (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1)
}

interface DissolvePortraitProps {
  src: string
  progress: number
}

export function DissolvePortrait({ src, progress }: DissolvePortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const cellsRef = useRef<DissolveCell[]>(makeDissolveCells(COLS, ROWS))
  const lastFracRef = useRef(-1)
  const [failed, setFailed] = useState(false)

  const draw = (frac: number) => {
    const canvas = canvasRef.current
    const img = imgRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !img || !img.complete || !img.naturalWidth) return
    if (Math.abs(frac - lastFracRef.current) < REDRAW_EPSILON) return
    lastFracRef.current = frac

    const crop = coverCrop(img.naturalWidth, img.naturalHeight, WIDTH, HEIGHT)

    // The backing store is DPR-scaled for sharpness; drawing still happens in logical WIDTH/HEIGHT units.
    const dpr = getDpr()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.filter = 'grayscale(1) brightness(.45) contrast(1.1)'
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, WIDTH, HEIGHT)

    const cw = WIDTH / COLS
    const ch = HEIGHT / ROWS
    for (const cell of cellsRef.current) {
      if (cell.th < frac) {
        const near = frac - cell.th < NEAR_EDGE_BAND
        ctx.filter = near ? 'brightness(1.7) saturate(1.2)' : 'none'
        const src = cellSourceRect(crop, cell.x, cell.y, cw, ch)
        ctx.drawImage(img, src.x, src.y, src.w, src.h, cell.x * cw, cell.y * ch, cw + 0.5, ch + 0.5)
      }
    }
    ctx.filter = 'none'
  }

  useEffect(() => {
    draw(progress)
  }, [progress])

  const handleLoad = () => {
    lastFracRef.current = -1
    draw(progress)
  }

  // Belt-and-braces: a browser-cached image can already be `complete` before the
  // `onLoad` listener attaches, in which case `load` never fires for this mount.
  useEffect(() => {
    if (imgRef.current?.complete) handleLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) {
    return <div data-testid="dissolve-fallback" className={styles.fallback} aria-hidden="true" />
  }

  return (
    <>
      <img
        ref={imgRef}
        src={src}
        alt=""
        aria-hidden="true"
        className={styles.hiddenImage}
        onLoad={handleLoad}
        onError={() => setFailed(true)}
      />
      <canvas
        ref={canvasRef}
        width={WIDTH * getDpr()}
        height={HEIGHT * getDpr()}
        className={styles.canvas}
        aria-hidden="true"
      />
    </>
  )
}
