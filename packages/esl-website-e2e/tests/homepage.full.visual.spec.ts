import {expect, test} from '@playwright/test';
import {stabilizePage} from '../common/page';

test.describe('Homepage visual', () => {
  test('homepage screen', async ({page}) => {
    await page.goto('/');
    await stabilizePage(page, {scroll: 300});
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true
    });
  });
});
