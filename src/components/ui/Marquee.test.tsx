import { render } from '@testing-library/react'
import { Marquee } from './Marquee'

it('duplicates its children for a seamless loop, marking the duplicate decorative', () => {
  const { getAllByText, container } = render(
    <Marquee>
      <span>Hello</span>
    </Marquee>,
  )

  expect(getAllByText('Hello')).toHaveLength(2)

  const hiddenCopies = container.querySelectorAll('[aria-hidden="true"]')
  expect(hiddenCopies).toHaveLength(1)
  expect(hiddenCopies[0]).toHaveTextContent('Hello')
})

it('marks the aria-hidden duplicate inert, so it cannot receive focus or be found in-page', () => {
  const { container } = render(
    <Marquee>
      <a href="#x">Hello</a>
    </Marquee>,
  )

  const hiddenCopy = container.querySelector('[aria-hidden="true"]')
  expect(hiddenCopy).toHaveAttribute('inert')
})
