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
