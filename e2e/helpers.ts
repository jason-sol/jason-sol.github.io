import type { Page } from '@playwright/test'

const finiteAnimationsDone = () =>
  document.getAnimations().every((animation) => {
    const timing = animation.effect?.getTiming()
    return timing?.iterations === Infinity || animation.playState === 'finished'
  })

/**
 * Waits until every finite animation/transition on the page has finished.
 * Infinite loops (marquee, scroll-hint line, footer cursor blink, backdrop
 * drift) are excluded — they never finish by design. Two clean samples 600ms
 * apart are required because reveal-on-scroll transitions can start after a
 * stagger delay (up to ~500ms) and would slip past a single check. The
 * two-sample loop lives in Node because waitForFunction does not await an
 * async in-page predicate — a returned Promise is truthy immediately.
 */
export async function settleAnimations(page: Page): Promise<void> {
  for (;;) {
    await page.waitForFunction(finiteAnimationsDone)
    await page.waitForTimeout(600)
    if (await page.evaluate(finiteAnimationsDone)) return
  }
}

/**
 * Dismisses the skippable first-load Intro overlay by clicking it away, then
 * waits for it to unmount and for the Hero's entrance replay to settle.
 * No-ops if the intro never rendered (reduced-motion or a URL hash present
 * skip it outright, and skip never triggers the replay).
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
  await settleAnimations(page)
}
