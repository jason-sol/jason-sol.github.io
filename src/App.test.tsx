import { act, render, screen } from '@testing-library/react'
import { App } from './App'

afterEach(() => {
  window.location.hash = ''
})

it('removes the intro overlay from the DOM once it finishes', () => {
  render(<App />)
  expect(screen.getByRole('dialog', { name: 'Intro' })).toBeInTheDocument()

  act(() => {
    screen.getByRole('dialog').click()
  })

  expect(screen.queryByRole('dialog')).toBeNull()
})

it('replays the hero entrance after the intro actually plays and finishes', () => {
  const { container } = render(<App />)
  const before = container.querySelector('[data-entrance]')
  expect(before).toHaveAttribute('data-entrance', '0')

  act(() => {
    screen.getByRole('dialog').click()
  })

  const after = container.querySelector('[data-entrance]')
  expect(after).toHaveAttribute('data-entrance', '1')
  expect(after).not.toBe(before)
})

it('does not replay the hero entrance when the intro never showed', () => {
  window.location.hash = '#contact'
  const { container } = render(<App />)
  expect(screen.queryByRole('dialog')).toBeNull()
  // Skipped intro reports played=false, so the mount-time rise animation is
  // the only entrance and the phase-0 content keeps its first generation.
  expect(container.querySelector('[data-entrance]')).toHaveAttribute('data-entrance', '0')
})
