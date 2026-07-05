export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/** Linear progress of `value` through [start, end], clamped to 0..1. */
export const linearStep = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start), 0, 1)

/** Snaps `value` down onto a `step`-sized grid so nearby values collapse to one. */
export const quantize = (value: number, step: number) => Math.floor(value / step) * step

/** Scroll-position quantization step shared by every scroll-driven redraw (About, Experience, DissolvePortrait). */
export const SCROLL_EPSILON = 0.004
