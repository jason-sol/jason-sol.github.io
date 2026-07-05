import { linearStep } from './math'

/**
 * Develop progress (0..1.35) of the About portrait as its section top travels up
 * the viewport: starts once the top passes 92% of the viewport height, completes
 * over 85% of it. The 1.35 overshoot pushes past the dissolve cells' ~1.06 max
 * threshold well before the window's end so the portrait finishes fully developed.
 */
export function portraitProgress(top: number, vh: number): number {
  return linearStep(vh * 0.92 - top, 0, vh * 0.85) * 1.35
}

/**
 * Reveal progress (0..1) of the statement words as the paragraph top travels up
 * the viewport: starts at 85% of the viewport height, completes over 55% of it.
 */
export function wordsProgress(top: number, vh: number): number {
  return linearStep(vh * 0.85 - top, 0, vh * 0.55)
}
