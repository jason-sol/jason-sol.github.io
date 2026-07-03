import { expect, test } from '@playwright/test'

test('page renders nav and contact', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('link', { name: /github/i })).toBeVisible()
})
