import { mailtoUrl } from './mailto'

it('builds a bare mailto when there is no subject or body', () => {
  expect(mailtoUrl('a@b.com')).toBe('mailto:a@b.com')
})

it('percent-encodes the subject and body as query params', () => {
  expect(mailtoUrl('a@b.com', 'Resume request', 'Hi Jason,\n\nName:')).toBe(
    'mailto:a@b.com?subject=Resume%20request&body=Hi%20Jason%2C%0A%0AName%3A',
  )
})

it('drops an empty part rather than emitting a bare param', () => {
  expect(mailtoUrl('a@b.com', '', 'body text')).toBe('mailto:a@b.com?body=body%20text')
})
