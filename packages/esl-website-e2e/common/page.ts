import type {Page} from '@playwright/test';

export async function scrollTillTheEnd(page: Page): Promise<void> {
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(200);
    if (y === await page.evaluate(() => window.scrollY)) break;
  }
}

export async function waitForFonts(page: Page): Promise<void> {
  // Fonts can affect rendering; wait for them if the page uses webfonts.
  await page.evaluate(async () => {
    const fonts: FontFaceSet = document.fonts;
    if (fonts?.status !== 'loaded') await fonts.ready;
  });
}
