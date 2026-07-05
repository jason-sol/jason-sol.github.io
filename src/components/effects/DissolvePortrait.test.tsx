import { fireEvent, render, screen } from '@testing-library/react'
import { DissolvePortrait } from './DissolvePortrait'

it('renders a decorative canvas hidden from assistive tech', () => {
  const { container } = render(<DissolvePortrait src="/jason.jpg" progress={0} />)
  const canvas = container.querySelector('canvas')
  expect(canvas).toHaveAttribute('aria-hidden', 'true')
})

it('renders a styled fallback frame if the portrait image fails to load', () => {
  const { container } = render(<DissolvePortrait src="/missing.jpg" progress={0} />)
  const img = container.querySelector('img')
  expect(img).not.toBeNull()

  fireEvent.error(img!)

  expect(screen.getByTestId('dissolve-fallback')).toBeInTheDocument()
  expect(container.querySelector('canvas')).toBeNull()
})

describe('backing-store resolution', () => {
  const originalDpr = window.devicePixelRatio

  afterEach(() => {
    Object.defineProperty(window, 'devicePixelRatio', { value: originalDpr, configurable: true })
  })

  it('scales the canvas backing store to the device pixel ratio', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 2, configurable: true })
    const { container } = render(<DissolvePortrait src="/jason.jpg" progress={0} />)
    const canvas = container.querySelector('canvas')!
    expect(canvas.width).toBe(440 * 2)
    expect(canvas.height).toBe(550 * 2)
  })

  it('caps the backing store scale at 2x on higher-DPR displays', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 3, configurable: true })
    const { container } = render(<DissolvePortrait src="/jason.jpg" progress={0} />)
    const canvas = container.querySelector('canvas')!
    expect(canvas.width).toBe(440 * 2)
    expect(canvas.height).toBe(550 * 2)
  })

  it('keeps a 1x backing store on standard-DPR displays', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true })
    const { container } = render(<DissolvePortrait src="/jason.jpg" progress={0} />)
    const canvas = container.querySelector('canvas')!
    expect(canvas.width).toBe(440)
    expect(canvas.height).toBe(550)
  })
})

it('draws on mount without waiting for the load event when the image is already cached', () => {
  const imgProto = HTMLImageElement.prototype
  const completeDescriptor = Object.getOwnPropertyDescriptor(imgProto, 'complete')
  const naturalWidthDescriptor = Object.getOwnPropertyDescriptor(imgProto, 'naturalWidth')
  Object.defineProperty(imgProto, 'complete', { value: true, configurable: true })
  Object.defineProperty(imgProto, 'naturalWidth', { value: 800, configurable: true })

  const clearRect = vi.fn()
  const getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    clearRect,
    drawImage: vi.fn(),
    setTransform: vi.fn(),
    filter: '',
  } as unknown as CanvasRenderingContext2D)

  render(<DissolvePortrait src="/jason.jpg" progress={0.5} />)
  expect(clearRect).toHaveBeenCalled()

  getContextSpy.mockRestore()
  if (completeDescriptor) Object.defineProperty(imgProto, 'complete', completeDescriptor)
  else delete (imgProto as unknown as Record<string, unknown>).complete
  if (naturalWidthDescriptor) Object.defineProperty(imgProto, 'naturalWidth', naturalWidthDescriptor)
  else delete (imgProto as unknown as Record<string, unknown>).naturalWidth
})
