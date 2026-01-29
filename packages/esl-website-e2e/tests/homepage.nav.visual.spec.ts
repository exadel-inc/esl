import {expect, test} from '@playwright/test';

test.describe('Homepage visual', () => {
  test('homepage hamburger menu on mobile', async ({page}, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Mobile-only scenario');
    await page.goto('/', {waitUntil: 'domcontentloaded'});

    const hamburger = page.locator('.header-hamburger');
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    // Wait for menu drawer/nav to appear; fallback to small settle.
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('homepage-hamburger.png');
  });

  test('homepage footer element', async ({page}) => {
    await page.goto('/', {waitUntil: 'domcontentloaded'});

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    await expect(footer).toHaveScreenshot('homepage-footer.png');
  });
});
