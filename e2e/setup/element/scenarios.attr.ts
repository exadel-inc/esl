import {cucumber} from '../../transformer/gherkin';

import type {ElementHandle} from 'puppeteer';
import type {TestEnv} from '../scenarios.world';

function getAttr(element: ElementHandle, attributeName: string): Promise<string | null> {
  return element?.evaluate((el, attr) => el.getAttribute(attr), attributeName);
}

cucumber.defineRule('check if attribute {string} is present', async (world: TestEnv, attributeName: string) => {
  world.elements.forEach(async (element) => expect(await getAttr(element, attributeName)).not.toBeNull());
});

cucumber.defineRule('check if attribute {string} isn`t present', async (world: TestEnv, attributeName: string) => {
  world.elements.forEach(async (element) => expect(await getAttr(element, attributeName)).toBeNull());
});

cucumber.defineRule('check if attribute {string} is equal to {string}', async (world: TestEnv, attributeName: string, value: string) => {
  world.elements.forEach(async (element) => expect(await getAttr(element, attributeName)).toEqual(value));
});

cucumber.defineRule('check if attribute {string} isn`t equal to {string}', async (world: TestEnv, attributeName: string, value: string) => {
  world.elements.forEach(async (element) => expect(await getAttr(element, attributeName)).not.toEqual(value));
});
