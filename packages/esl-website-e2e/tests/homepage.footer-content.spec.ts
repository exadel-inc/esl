import fs from 'node:fs';
import path from 'node:path';
import {test, expect} from '@playwright/test';

const websitePkgPath = path.resolve(import.meta.dirname, '../../esl-website/package.json');
const websitePkg = JSON.parse(fs.readFileSync(websitePkgPath, 'utf-8')) as {version: string};

test.describe('Homepage footer content', () => {
  test('contains current website version', async ({page}) => {
    await page.goto('/');

    const footerCopyright = page.locator('footer .footer-copyright');
    await expect(footerCopyright).toBeVisible();

    await expect(footerCopyright).toContainText(websitePkg.version);
  });

  test('contains current year', async ({page}) => {
    await page.goto('/');

    const currentYear = new Date().getFullYear();
    const footerCopyright = page.locator('footer .footer-copyright');
    await expect(footerCopyright).toBeVisible();

    await expect(footerCopyright).toContainText(`© ${currentYear}`);
  });
});
