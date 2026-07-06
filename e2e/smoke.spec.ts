import { expect, test } from '@playwright/test'
import { site } from '../src/content/site'
import { dismissIntro } from './helpers'

test('page renders nav and contact', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('link', { name: /github/i })).toBeVisible()
})

test('both declared favicons (svg + png fallback) resolve without a 404', async ({ page, baseURL }) => {
  await page.goto('/')
  // The content-type check matters: the preview server's SPA fallback answers unknown
  // paths with 200 + index.html, which would mask a missing icon file.
  const icons: [string, string][] = [
    ['/favicon.svg', 'image/svg+xml'],
    ['/favicon.png', 'image/png'],
  ]
  for (const [icon, contentType] of icons) {
    const response = await page.request.get(new URL(icon, baseURL).toString())
    expect(response.status(), icon).toBe(200)
    expect(response.headers()['content-type'], icon).toContain(contentType)
  }
})

test('page load produces no console errors and no failed same-origin requests', async ({ page, baseURL }) => {
  const consoleErrors: string[] = []
  const failedRequests: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('response', (response) => {
    if (response.status() >= 400 && baseURL && response.url().startsWith(baseURL)) {
      failedRequests.push(`${response.status()} ${response.url()}`)
    }
  })

  await page.goto('/')
  await dismissIntro(page)

  expect(consoleErrors).toEqual([])
  expect(failedRequests).toEqual([])
})

test('hero renders its h1, and every content section renders a visible h2 on scroll', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const sectionLabels = [
    site.sectionLabels.about,
    site.sectionLabels.stack,
    site.sectionLabels.experience,
    site.sectionLabels.projects,
    site.sectionLabels.education,
  ]
  for (const label of sectionLabels) {
    const heading = page.getByRole('heading', { level: 2, name: label })
    await heading.scrollIntoViewIfNeeded()
    await expect(heading).toBeVisible()
  }

  const contactHeading = page.getByRole('heading', { level: 2, name: /LET'S BUILD/ })
  await contactHeading.scrollIntoViewIfNeeded()
  await expect(contactHeading).toBeVisible()
})

test('the hero name fits within the viewport (stacked lines, no clipping)', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const box = await page.getByRole('heading', { level: 1 }).boundingBox()
  const viewport = page.viewportSize()
  expect(box).not.toBeNull()
  expect(box!.width).toBeLessThanOrEqual(viewport!.width)
})

test('nav WORK link lands on the Experience section', async ({ page }) => {
  await page.goto('/')
  await dismissIntro(page)
  await page.getByRole('link', { name: 'WORK' }).click()
  await expect(page.locator('#experience')).toBeInViewport()
})

test('once the intro finishes, the orb sits near the hero name (regression: WG5 mispositioning)', async ({
  page,
}) => {
  await page.goto('/')
  await dismissIntro(page)

  // Web fonts loading late can reflow the hero name after the orb's first frame;
  // wait for fonts, then give the 0.16/frame follow-smoothing time to converge.
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => {
    const wrap = document.querySelector('[data-orb-holder]')?.lastElementChild as HTMLElement | null
    return Boolean(wrap?.style.transform)
  })
  // Wait for the follow-smoothing (0.16/frame) to converge onto a stable position. The
  // scale() term keeps a continuous idle "breathing" wobble, so only translate() is compared.
  await page.waitForFunction(() => {
    const wrap = document.querySelector('[data-orb-holder]')?.lastElementChild as HTMLElement
    const win = window as unknown as { __prevOrbTranslate?: string | null }
    const current = /translate\([^)]+\)/.exec(wrap.style.transform)?.[0] ?? null
    const stable = current !== null && current === win.__prevOrbTranslate
    win.__prevOrbTranslate = current
    return stable
  })

  const { orbX, orbY, rect } = await page.evaluate(() => {
    const wrap = document.querySelector('[data-orb-holder]')!.lastElementChild as HTMLElement
    const match = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(wrap.style.transform)
    const heroName = document.querySelector('[data-orb-anchor="hero-name"]')!
    const heroRect = heroName.getBoundingClientRect()
    return {
      orbX: match ? Number(match[1]) : null,
      orbY: match ? Number(match[2]) : null,
      rect: { right: heroRect.right, top: heroRect.top, height: heroRect.height },
    }
  })

  expect(orbX).not.toBeNull()
  expect(orbY).not.toBeNull()
  // hero-name is a 'right'-side Waypoint with a 44px offset; ±30px absorbs the orb's own
  // half-size and real-font layout drift that a jsdom unit test can't reproduce.
  expect(Math.abs(orbX! - (rect.right + 44))).toBeLessThanOrEqual(30)
  expect(Math.abs(orbY! - (rect.top + rect.height / 2))).toBeLessThanOrEqual(30)
})
