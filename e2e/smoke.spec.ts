import { expect, test } from '@playwright/test'
import { site } from '../src/content/site'
import { dismissIntro } from './helpers'

test('page renders nav and contact', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('link', { name: /github/i })).toBeVisible()
})

test('the declared favicon resolves without a 404', async ({ page, baseURL }) => {
  await page.goto('/')
  const response = await page.request.get(new URL('/favicon.svg', baseURL).toString())
  expect(response.status()).toBe(200)
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
