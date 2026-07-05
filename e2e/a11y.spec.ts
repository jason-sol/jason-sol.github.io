import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { dismissIntro } from './helpers'

test('has no automatically detectable accessibility violations at the top of the page', async ({ page }) => {
  await page.goto('/')
  await dismissIntro(page)

  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
})

test('has no automatically detectable accessibility violations at the bottom of the page (Contact/Footer)', async ({
  page,
}) => {
  await page.goto('/')
  await dismissIntro(page)
  await page.keyboard.press('End')
  await page.getByRole('contentinfo').scrollIntoViewIfNeeded()
  // Let scroll-triggered CSS opacity transitions (e.g. About's word-reveal) settle to their
  // steady state before scanning, so axe measures rendered content, not a mid-transition frame.
  await page.waitForTimeout(400)

  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
})
