import {cucumber} from '../../transformer/gherkin';

import type {ElementHandle} from 'puppeteer';
import type {TestEnv} from '../scenarios.world';

cucumber.defineRule('find the element by selector {string}', async (world: TestEnv, selector: string) => {
  world.elements = (await findElementsBySelector(selector)).slice(0, 1);
});

cucumber.defineRule('find the elements by selector {string}', async (world: TestEnv, selector: string) => {
  world.elements = await findElementsBySelector(selector);
});

cucumber.defineRule(/check if the elements? is present/, async (world: TestEnv) => {
  expect(world.elements.length).toBeGreaterThan(0);
});

cucumber.defineRule('check if there are {int} element(s)', async (world: TestEnv, count: number) => {
  expect(world.elements.length).toBe(count);
});

function findElementsBySelector(selector: string): Promise<ElementHandle[]> {
  // A puppeteer bug (Type 'ElementHandle<Element>' is missing the following properties from type 'ElementHandle<Element> ...)
  return page.$$(selector) as unknown as Promise<ElementHandle[]>;
}
