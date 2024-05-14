import {cucumber} from '../../transformer/gherkin';
import {forEachElement} from './scenarios.utils';

import type {ElementHandle} from 'puppeteer';

function getAttr(element: ElementHandle, attributeName: string): Promise<string | null> {
  return element?.evaluate((el, attr) => el.getAttribute(attr), attributeName);
}

cucumber.defineRule('check if attribute {string} is present', forEachElement(
  async (element, attributeName) => expect(await getAttr(element, attributeName)).not.toBeNull()
));

cucumber.defineRule('check if attribute {string} isn`t present', forEachElement(
  async (element, attributeName) => expect(await getAttr(element, attributeName)).toBeNull()
));

cucumber.defineRule('check if attribute {string} is equal to {string}', forEachElement(
  async (element, attributeName, value) => expect(await getAttr(element, attributeName)).toEqual(value)
));

cucumber.defineRule('check if attribute {string} isn`t equal to {string}', forEachElement(
  async (element, attributeName, value) => expect(await getAttr(element, attributeName)).not.toEqual(value)
));
