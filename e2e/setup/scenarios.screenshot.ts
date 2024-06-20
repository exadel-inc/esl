import {cucumber} from '../transformer/gherkin';

import type {TestEnv} from './scenarios.env';

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

cucumber.defineRule('check if the screenshot is exactly equal to the snapshotted version', async ({screenshots}: TestEnv) => {
  if (!screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = screenshots.pop();
  expect(image).toMatchImageSnapshot();
});

cucumber.defineRule('check if the screenshot is equal to the snapshotted version', async ({screenshots}: TestEnv) => {
  if (!screenshots.length) throw new Error('E2E: there is no any screenshot, make sure you have "Take a screenshot" before');
  const image = screenshots.pop();
  expect(image).toMatchImageSnapshot({threshold: 0.1});
});
