import {expect, test} from '@playwright/test';

async function gotoHomepageAndStabilize(page: import('@playwright/test').Page) {
  await page.goto('/');
  // Ensure layout-critical pieces are present.
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();

  // Fonts can affect rendering; wait for them if the page uses webfonts.
  await page.evaluate(async () => {
    const fonts: any = (document as any).fonts;
    if (fonts?.status !== 'loaded') await fonts.ready;
  });
}

test.describe('Homepage visual', () => {
  test('homepage screen', async ({page}) => {
    await gotoHomepageAndStabilize(page);
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true
    });
  });

  test('homepage hamburger menu on mobile', async ({page}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only scenario');

    await gotoHomepageAndStabilize(page);

    const hamburger = page.locator('.header-hamburger');
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    // Wait for menu drawer/nav to appear; fallback to small settle.
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('homepage-hamburger.png', {
      fullPage: true
    });
  });

  test('homepage footer element', async ({page}) => {
    await gotoHomepageAndStabilize(page);

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    await expect(footer).toHaveScreenshot('homepage-footer.png');
  });
});
