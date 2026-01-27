import {expect, test} from '@playwright/test';
import {stabilizePage} from '../common/page';

test.describe('Homepage visual', () => {
  test('homepage screen', async ({page}) => {
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await stabilizePage(page, {scroll: true});
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true
    });
  });
});
