import type { Page } from '@playwright/test'

/**
 * Dismisses the skippable first-load Intro overlay by clicking it away, then
 * waits for it to unmount and for the Hero's entrance replay (`rise` CSS
 * animation, ~0.85s) to settle. No-ops if the intro never rendered
 * (reduced-motion or a URL hash present skip it outright, and skip never
 * triggers the replay).
 */
export async function dismissIntro(page: Page): Promise<void> {
  const dialog = page.getByRole('dialog', { name: 'Intro' })
  try {
    await dialog.waitFor({ state: 'visible', timeout: 2000 })
  } catch {
    return
  }
  await dialog.click()
  await dialog.waitFor({ state: 'detached' })
  await page.waitForTimeout(1000)
}
