export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/** Linear progress of `value` through [start, end], clamped to 0..1. */
export const smoothstep = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start), 0, 1)
