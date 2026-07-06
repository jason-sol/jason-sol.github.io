import { render, screen } from '@testing-library/react'
import { StatCounter } from './StatCounter'
import styles from './StatCounter.module.css'

afterEach(() => {
  vi.unstubAllGlobals()
})

it('renders the value and caption immediately under reduced motion', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
  render(<StatCounter value={70} caption="tests covering the secrets-management system I designed" />)
  expect(screen.getByText('70')).toBeInTheDocument()
  expect(screen.getByText('tests covering the secrets-management system I designed')).toBeInTheDocument()
})

it('appends the suffix to the value when provided', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
  const { container } = render(<StatCounter value={15} suffix="m" caption="automated CI run" />)
  expect(container.textContent).toContain('15m')
})

it('renders the value in the accent style when the accent flag is set', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
  render(<StatCounter value={15} suffix="m" accent caption="automated CI run" />)
  expect(screen.getByText('15m')).toHaveClass(styles.valueAccent)
})

it('renders the value in the default style without the accent flag', () => {
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
  render(<StatCounter value={70} caption="tests" />)
  expect(screen.getByText('70')).not.toHaveClass(styles.valueAccent)
})
