import { expect, test } from '@playwright/test'
import { site } from '../src/content/site'

test.use({ contextOptions: { reducedMotion: 'reduce' } })

async function scrollHeroToProgress(page: import('@playwright/test').Page, fraction: number) {
  await page.evaluate((f) => {
    const hero = document.getElementById('top')!
    const total = hero.getBoundingClientRect().height - window.innerHeight
    window.scrollTo(0, f * total)
  }, fraction)
  await page.waitForTimeout(150)
}

test('the intro overlay never appears', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('dialog', { name: 'Intro' })).toHaveCount(0)
})

test('all four hero phase texts are reachable by scrolling', async ({ page }) => {
  await page.goto('/')

  const eyebrows = site.heroPhases.map((phase) => phase.eyebrow)
  const progressPoints = [0, 0.4, 0.65, 0.95]

  for (let i = 0; i < eyebrows.length; i++) {
    await scrollHeroToProgress(page, progressPoints[i])
    await expect(page.getByText(eyebrows[i], { exact: true })).toBeVisible()
  }
})

test('about counters show their final values immediately, with no count-up animation', async ({ page }) => {
  await page.goto('/')

  for (const stat of site.about.stats) {
    await expect(page.getByText(`${stat.value}${stat.suffix ?? ''}`, { exact: true })).toBeVisible()
  }
})

test('renders no orb holder and no cursor-trail canvas', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-orb-holder]')).toHaveCount(0)
  // DissolvePortrait's canvas is content (the About portrait), not a decorative Effect, and
  // stays mounted; the CursorTrail canvas (a fixed full-viewport overlay) must be the one gone.
  await expect(page.locator('canvas')).toHaveCount(1)
  await expect(page.locator('#about canvas')).toHaveCount(1)
})

test('the ticker marquee is paused, not animating', async ({ page }) => {
  await page.goto('/')
  const track = page.getByRole('group', { name: 'Highlights' }).locator('> div').first()
  await expect(track).toBeVisible()
  const playState = await track.evaluate((el) => getComputedStyle(el).animationPlayState)
  expect(playState).toBe('paused')
})
