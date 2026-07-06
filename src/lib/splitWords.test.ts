import { litWordCount, splitWords } from './splitWords'

describe('splitWords', () => {
  it('splits a sentence into its words', () => {
    expect(splitWords('The fastest way to trust')).toEqual(['The', 'fastest', 'way', 'to', 'trust'])
  })

  it('collapses repeated whitespace', () => {
    expect(splitWords('one  two   three')).toEqual(['one', 'two', 'three'])
  })

  it('returns an empty array for an empty string', () => {
    expect(splitWords('')).toEqual([])
  })
})

describe('litWordCount', () => {
  it('is 0 at fraction 0', () => expect(litWordCount(0, 10)).toBe(0))
  it('is the total at fraction 1', () => expect(litWordCount(1, 10)).toBe(10))
  it('floors a fractional word count', () => expect(litWordCount(0.55, 10)).toBe(5))
  it('clamps below 0 for a negative fraction', () => expect(litWordCount(-1, 10)).toBe(0))
  it('clamps above the total for a fraction greater than 1', () => expect(litWordCount(2, 10)).toBe(10))
})
