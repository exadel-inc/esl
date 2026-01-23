import {expect, test} from '@playwright/test';

test.describe('Test page visual', () => {
  test('test page screen', async ({page}) => {
    await page.goto('/test/test-page');
    await expect(page.locator('body')).toBeVisible();

    await page.evaluate(async () => {
      const fonts: any = (document as any).fonts;
      if (fonts?.status !== 'loaded') await fonts.ready;
    });

    await expect(page).toHaveScreenshot('test-page.png', {fullPage: true});
  });
});
