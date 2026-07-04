import { clamp } from './math'

export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

/** Number of words lit at a given scroll fraction through a statement of `total` words. */
export function litWordCount(fraction: number, total: number): number {
  return clamp(Math.floor(fraction * total), 0, total)
}
