import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import { dismissIntro, settleAnimations } from './helpers'

// The About statement's word-by-word animated copy is pure decoration per WCAG 1.4.3
// (the identical content is exposed to everyone via an adjacent plain copy), so its
// deliberately-dim unrevealed words are exempt from contrast requirements. Axe evaluates
// contrast on aria-hidden text regardless (correctly — aria-hidden alone doesn't exempt
// visually rendered text), so the scan scopes around that one decorative element.
const scan = (page: Page) => new AxeBuilder({ page }).exclude('#about p[aria-hidden="true"]')

test('has no automatically detectable accessibility violations at the top of the page', async ({ page }) => {
  await page.goto('/')
  await dismissIntro(page)

  const { violations } = await scan(page).analyze()
  expect(violations).toEqual([])
})

test('has no automatically detectable accessibility violations with the whole page revealed', async ({ page }) => {
  await page.goto('/')
  await dismissIntro(page)

  // Scroll stepwise so every reveal-on-scroll Section (Stack, Experience, Projects, ...)
  // fires its IntersectionObserver and is scanned in its revealed steady state.
  const pageHeight = await page.evaluate(() => document.body.scrollHeight)
  const viewportHeight = page.viewportSize()?.height ?? 720
  for (let y = 0; y <= pageHeight; y += viewportHeight) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
    await settleAnimations(page)
  }
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded()
  await settleAnimations(page)

  const { violations } = await scan(page).analyze()
  expect(violations).toEqual([])
})
