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
