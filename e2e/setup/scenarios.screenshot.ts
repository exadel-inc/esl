import {cucumber} from '../transformer/gherkin';

import type {TestEnv} from './scenarios.env';
import type {MatchImageSnapshotOptions} from 'jest-image-snapshot';

const DIFF_CONFIG: MatchImageSnapshotOptions = {
  customDiffDir: '.diff'
};

cucumber.defineRule('take a screenshot', async ({screenshots}: TestEnv) => {
  screenshots.push(await page.screenshot());
});

cucumber.defineRule('take a screenshot of a full page', async ({screenshots}: TestEnv) => {
  screenshots.push(await page.screenshot({fullPage: true}));
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

cucumber.defineRule('check if the screenshot is exactly equal to the snapshoted version', ({screenshots}: TestEnv) => {
  if (!screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = screenshots.pop();
  expect(image).toMatchImageSnapshot(DIFF_CONFIG);
});

cucumber.defineRule('check if the screenshot is equal to the snapshoted version', ({screenshots}: TestEnv) => {
  if (!screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = screenshots.pop();
  expect(image).toMatchImageSnapshot({failureThreshold: 1000, blur: .005, comparisonMethod: 'ssim', failureThresholdType: 'pixel', ...DIFF_CONFIG});
});
