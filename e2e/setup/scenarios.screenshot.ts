import sharp from 'sharp';
import {cucumber} from '../transformer/gherkin';

import type {TestEnv} from './scenarios.env';
import type {MatchImageSnapshotOptions} from 'jest-image-snapshot';
import type {ScreenshotOptions} from 'jest-environment-puppeteer/node_modules/@types/puppeteer';

const DIFF_CONFIG: MatchImageSnapshotOptions = {
  customDiffDir: '.diff'
};

async function pushWebPScreenshot(screenshots: (string | Buffer)[], options: ScreenshotOptions = {}): Promise<void> {
  const screenshotBuffer = await page.screenshot(options);
  const webpScreenshot = await sharp(screenshotBuffer).webp().toBuffer();
  screenshots.push(webpScreenshot);
}

async function popPNGScreenshot(screenshots: (string | Buffer)[]): Promise<Buffer> {
  const webpImage = screenshots.pop();
  return sharp(webpImage).png().toBuffer();
}

// Define rule to take a screenshot and convert it to WebP
cucumber.defineRule('take a screenshot', async ({screenshots}: TestEnv) => {
  await pushWebPScreenshot(screenshots);
});

// Define rule to take a full-page screenshot and convert it to WebP
cucumber.defineRule('take a screenshot of a full page', async ({screenshots}: TestEnv) => {
  await pushWebPScreenshot(screenshots, {fullPage: true});
});

cucumber.defineRule('scroll to the element', async ({elements}: TestEnv) => {
  const element = elements[0];
  if (!element) throw new Error('E2E: there is no any element, make sure you have "Find the element by selector" before');
  await element.scrollIntoView();
});

cucumber.defineRule('take a screenshot of the element', async ({elements, screenshots}: TestEnv) => {
  const element = elements[0];
  if (!element) throw new Error('E2E: there is no any element, make sure you have "Find the element by selector" before');

  await element.scrollIntoView();
  screenshots.push(await element.screenshot());
});

cucumber.defineRule('check if the screenshot is exactly equal to the snapshotted version', async ({screenshots}: TestEnv) => {
  if (!screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = await popPNGScreenshot(screenshots);
  expect(image).toMatchImageSnapshot(DIFF_CONFIG);
});

cucumber.defineRule('check if the screenshot is equal to the snapshotted version', async ({screenshots}: TestEnv) => {
  if (!screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = await popPNGScreenshot(screenshots);
  expect(image).toMatchImageSnapshot({failureThreshold: 1000, blur: .005, comparisonMethod: 'ssim', failureThresholdType: 'pixel', ...DIFF_CONFIG});
});
