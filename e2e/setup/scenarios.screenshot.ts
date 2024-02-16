import {cucumber} from '../transformer/gherkin';
import type {TestEnv} from './scenarious.world';
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

cucumber.defineRule('check if the screenshot is exactly equal to the snapshoted version', (world: TestEnv) => {
  if (!world.screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = world.screenshots.pop();
  expect(image).toMatchImageSnapshot(DIFF_CONFIG);
});

cucumber.defineRule('check if the screenshot is equal to the snapshoted version', (world: TestEnv) => {
  if (!world.screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = world.screenshots.pop();
  expect(image).toMatchImageSnapshot({failureThreshold: 5, failureThresholdType: 'pixel', ...DIFF_CONFIG});
});
