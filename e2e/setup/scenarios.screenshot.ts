import {cucumber} from '../transformer/gherkin';
import type {TestEnv} from './scenarios.world';
import type {MatchImageSnapshotOptions} from 'jest-image-snapshot';

const DIFF_CONFIG: MatchImageSnapshotOptions = {
  customDiffDir: '.diff'
};

cucumber.defineRule('take a screenshot', async (world: TestEnv) => {
  world.screenshots.push(await page.screenshot());
});

cucumber.defineRule('take a screenshot of a full page', async (world: TestEnv) => {
  world.screenshots.push(await page.screenshot({fullPage: true}));
});

cucumber.defineRule('take a screenshot of the element', async (world: TestEnv) => {
  const element = world.elements[0];
  const clip = await element?.boundingBox();
  if (!clip) return;
  world.screenshots.push(await page.screenshot({clip}));
});

cucumber.defineRule('check if the screenshot is exactly equal to the snapshoted version', (world: TestEnv) => {
  if (!world.screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = world.screenshots.pop();
  expect(image).toMatchImageSnapshot(DIFF_CONFIG);
});

cucumber.defineRule('check if the screenshot is equal to the snapshoted version', (world: TestEnv) => {
  if (!world.screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = world.screenshots.pop();
  expect(image).toMatchImageSnapshot({failureThreshold: 0.25, failureThresholdType: 'percent', ...DIFF_CONFIG});
});
