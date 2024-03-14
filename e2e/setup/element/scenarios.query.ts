import {cucumber} from '../../transformer/gherkin';

import type {ElementHandle} from 'puppeteer';
import type {TestEnv} from '../scenarious.world';

cucumber.defineRule('find the element by selector {string}', async (world: TestEnv, selector: string) => {
  world.elements = (await findElementsBySelector(selector)).slice(0, 1);
});

cucumber.defineRule('find the elements by selector {string}', async (world: TestEnv, selector: string) => {
  world.elements = await findElementsBySelector(selector);
});

function findElementsBySelector(selector: string): Promise<ElementHandle[]> {
  // A puppeteer bug (Type 'ElementHandle<Element>' is missing the following properties from type 'ElementHandle<Element> ...)
  return page.$$(selector) as unknown as Promise<ElementHandle[]>;
}
