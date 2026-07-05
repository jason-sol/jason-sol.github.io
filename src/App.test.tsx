import { act, render, screen } from '@testing-library/react'
import { App } from './App'

it('removes the intro overlay from the DOM once it finishes', () => {
  render(<App />)
  expect(screen.getByRole('dialog', { name: 'Intro' })).toBeInTheDocument()

  act(() => {
    screen.getByRole('dialog').click()
  })

  expect(screen.queryByRole('dialog')).toBeNull()
})
