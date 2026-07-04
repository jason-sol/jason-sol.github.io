import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

/** jsdom has no IntersectionObserver; this mock lets tests fire entries manually via `trigger`. */
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []

  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly scrollMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  elements = new Set<Element>()

  constructor(private callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this)
  }

  observe(element: Element) {
    this.elements.add(element)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  trigger(target: Element, isIntersecting: boolean) {
    this.callback([{ isIntersecting, target } as IntersectionObserverEntry], this)
  }
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

/** jsdom's canvas getContext() is unimplemented and logs noisily; stub it with a no-op 2D context. */
if (typeof HTMLCanvasElement !== 'undefined') {
  const noopContext = new Proxy(
    {},
    {
      get: (_target, prop) => (prop === 'canvas' ? undefined : () => undefined),
      set: () => true,
    },
  ) as unknown as CanvasRenderingContext2D

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(noopContext)
}
