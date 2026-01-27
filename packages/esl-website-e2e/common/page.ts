import {expect} from '@playwright/test';
import type {Page, Locator} from '@playwright/test';

export type StabilizeOptions = {
  /** Trigger IntersectionObserver/lazy content by scrolling the page before screenshots. */
  scroll?: boolean;
  /** Extra delay after stabilization steps (ms). Keep small to avoid slowing down tests. */
  settleMs?: number;
  /** Optional: ensure these locators are visible before proceeding. */
  ensureVisible?: Array<Locator | string>;
};

export async function isPageEndReached(page: Page, tolerance = 5): Promise<boolean> {
  try {
    return await page.evaluate((tolerance) => {
      const de = document.documentElement;
      const scrollY = Math.max(window.scrollY, de.scrollTop);
      const scrollH = Math.max(de.scrollHeight, document.body?.scrollHeight ?? 0);
      const viewportH = window.innerHeight;
      return scrollY + viewportH - scrollH < tolerance; // 5px tolerance
    }, tolerance);
  } catch {
    return true; // In case of any error, assume the end is reached to stop scrolling.
  }
}

export async function autoScrollPage(page: Page) {
  for (let i = 0; i < 25; i++) {
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(250);

    if (await isPageEndReached(page)) break;
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

  // Ensure we start scrolling in a stable document context.
  await page.waitForLoadState('domcontentloaded');

  await waitForFonts(page);

  if (scroll) {
    await autoScrollPage(page);
  }

  if (visible.length) {
    await ensureVisible(page, visible);
  }

  // Small settle to let any queued rendering complete.
  if (settleMs > 0) {
    await page.waitForTimeout(settleMs);
  }
}
