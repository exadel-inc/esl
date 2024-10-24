import {cucumber} from '../../transformer/gherkin';
import type {TestEnv} from '../scenarios.env';

cucumber.defineRule(/check if the elements? is present/, async ({elements}: TestEnv) => {
  expect(elements.length).toBeGreaterThan(0);
});

cucumber.defineRule('check if there are {int} element(s)', async ({elements}: TestEnv, count: number) => {
  expect(elements.length).toBe(count);
});
