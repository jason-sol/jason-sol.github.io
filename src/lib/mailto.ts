/** A `mailto:` URL whose subject and body are percent-encoded as query params. */
export function mailtoUrl(email: string, subject?: string, body?: string): string {
  const parts: [string, string][] = []
  if (subject) parts.push(['subject', subject])
  if (body) parts.push(['body', body])
  if (parts.length === 0) return `mailto:${email}`
  return `mailto:${email}?${parts.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')}`
}
