import { linearStep } from './math'

/**
 * Progress (0..1) of the experience timeline as its section enters the viewport.
 * `top`/`height` are the section's bounding-rect top and height; `vh` is the viewport height.
 */
export function timelineProgress(top: number, height: number, vh: number): number {
  return linearStep(vh * 0.75 - top, 0, height * 0.9)
}
