import {expect} from '@playwright/test';
import type {Page, Locator} from '@playwright/test';

export type StabilizeOptions = {
  /** Trigger IntersectionObserver/lazy content by scrolling the page before screenshots. */
  scroll?: boolean | number;
  /** Extra delay after stabilization steps (ms). Keep small to avoid slowing down tests. */
  settleMs?: number;
  /** Optional: ensure these locators are visible before proceeding. */
  ensureVisible?: Array<Locator | string>;
};

export async function autoScrollPage(page: Page, delay: number) {
  // Simple wheel scrolling to trigger IntersectionObserver / lazy content.
  // We do a fixed number of steps, but stop early if we stop making progress.

  const steps = 20;
  const deltaY = 1000;
  const stepDelay = Math.max(0, delay);

  let lastScrollY = -1;
  let lastScrollH = -1;
  let stable = 0;

  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, deltaY);
    await page.waitForTimeout(stepDelay);

    const {scrollY, scrollH} = await page.evaluate(() => {
      const de = document.documentElement;
      const y = Math.max(window.scrollY, de.scrollTop);
      const h = Math.max(de.scrollHeight, document.body?.scrollHeight ?? 0);
      return {scrollY: y, scrollH: h};
    });

    // If neither the scroll position nor the page height changes for a few steps,
    // we're effectively at the bottom (or cannot scroll further).
    if (scrollY === lastScrollY && scrollH === lastScrollH) {
      stable++;
      if (stable >= 3) break;
    } else {
      stable = 0;
    }

    lastScrollY = scrollY;
    lastScrollH = scrollH;
  }

  // Back to top for consistent screenshots.
  await page.keyboard.press('Home');
  await page.waitForTimeout(100);
}

export async function waitForFonts(page: Page) {
  // Fonts can affect rendering; wait for them if the page uses webfonts.
  await page.evaluate(async () => {
    const fonts: any = (document as any).fonts;
    if (fonts?.status !== 'loaded') await fonts.ready;
  });
}

export async function ensureVisible(page: Page, items: Array<Locator | string>) {
  for (const it of items) {
    const locator = typeof it === 'string' ? page.locator(it) : it;
    await expect(locator).toBeVisible();
  }
}

export async function stabilizePage(page: Page, opts: StabilizeOptions = {}) {
  const {
    scroll = true,
    settleMs = 100,
    ensureVisible: visible = []
  } = opts;

  if (visible.length) {
    await ensureVisible(page, visible);
  }

  await waitForFonts(page);

  if (scroll) {
    await autoScrollPage(page, typeof scroll === 'number' ? scroll : 100);
  }

  // Small settle to let any queued rendering complete.
  if (settleMs > 0) {
    await page.waitForTimeout(settleMs);
  }
}
