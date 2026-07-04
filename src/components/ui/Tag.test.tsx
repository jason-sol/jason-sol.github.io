import { render, screen } from '@testing-library/react'
import { Tag } from './Tag'
import styles from './Tag.module.css'

it('renders the label text', () => {
  render(<Tag>TypeScript</Tag>)
  expect(screen.getByText('TypeScript')).toBeInTheDocument()
})

it('uses the default variant styling when no variant is given', () => {
  render(<Tag>Docker</Tag>)
  const tag = screen.getByText('Docker')
  expect(tag).toHaveClass(styles.tag)
  expect(tag).not.toHaveClass(styles.accent)
})

it('applies the accent variant styling', () => {
  render(<Tag variant="accent">Playwright</Tag>)
  expect(screen.getByText('Playwright')).toHaveClass(styles.accent)
})
