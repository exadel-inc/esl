import {cucumber} from '../../transformer/gherkin';

import type {ElementHandle} from 'puppeteer';
import type {TestEnv} from '../scenarios.env';

cucumber.defineRule('find the element by XPath {string}', async (world: TestEnv, xpath: string) => {
  // A puppeteer bug (Type 'ElementHandle<Element>' is missing the following properties from type 'ElementHandle<Element> ...)
  world.elements = [await (page.waitForSelector(`xpath/${xpath}`) as unknown as Promise<ElementHandle>)];
});
