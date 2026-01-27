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
  // Scroll down in steps until the bottom, then back to top.
  // This helps trigger IntersectionObserver-driven rendering and lazy content.
  await page.evaluate(async (scrollDelay) => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const scrollStep = Math.max(200, Math.floor(window.innerHeight * 0.7));
    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );

    for (let y = 0; y < maxScroll; y += scrollStep) {
      window.scrollTo(0, y);
      await sleep(scrollDelay);
    }

    window.scrollTo(0, maxScroll);
    await sleep(scrollDelay);

    // Scroll back to top to keep screenshot consistent (top anchored).
    window.scrollTo(0, 0);
    await sleep(100);
  }, delay);
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
