import {expect, test} from '@playwright/test';
import {scrollTillTheEnd, waitForFonts} from '../common/page';

test.describe('Homepage visual', () => {
  test('homepage screen', async ({page}) => {
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await waitForFonts(page);

    // Scroll to the end to load all lazy content.
    await scrollTillTheEnd(page);

    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true
    });
  });
});
