import { useEffect, useRef, useState } from 'react'
import { makeDissolveCells } from '../../lib/dissolve'
import type { DissolveCell } from '../../lib/dissolve'
import styles from './DissolvePortrait.module.css'

const COLS = 16
const ROWS = 20
const WIDTH = 440
const HEIGHT = 550
const NEAR_EDGE_BAND = 0.06
const REDRAW_EPSILON = 0.004

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

    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(WIDTH / iw, HEIGHT / ih)
    const sw = WIDTH / scale
    const sh = HEIGHT / scale
    const sx = (iw - sw) / 2
    const sy = (ih - sh) / 2

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.filter = 'grayscale(1) brightness(.45) contrast(1.1)'
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, WIDTH, HEIGHT)

    const cw = WIDTH / COLS
    const ch = HEIGHT / ROWS
    for (const cell of cellsRef.current) {
      if (cell.th < frac) {
        const near = frac - cell.th < NEAR_EDGE_BAND
        ctx.filter = near ? 'brightness(1.7) saturate(1.2)' : 'none'
        ctx.drawImage(
          img,
          sx + (cell.x * cw) / scale,
          sy + (cell.y * ch) / scale,
          cw / scale,
          ch / scale,
          cell.x * cw,
          cell.y * ch,
          cw + 0.5,
          ch + 0.5,
        )
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
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className={styles.canvas} aria-hidden="true" />
    </>
  )
}
