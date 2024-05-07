import {cucumber} from '../../transformer/gherkin';

import type {ElementHandle} from 'puppeteer';
import type {TestEnv} from '../scenarios.world';

function hasClasses(element: ElementHandle, classList: string[]): Promise<boolean> {
  return element?.evaluate((el, clsList) => clsList.every((cls) => el.classList.contains(cls)), classList);
}

cucumber.defineRule('check if class {string} is present', async (world: TestEnv, classNames: string) => {
  const classList = classNames.split(' ');
  world.elements.forEach(async (element) => expect(await hasClasses(element, classList)).toBe(true));
});

cucumber.defineRule('check if class {string} isn`t present', async (world: TestEnv, classNames: string) => {
  const classList = classNames.split(' ');
  world.elements.forEach(async (element) => expect(await hasClasses(element, classList)).toBe(false));
});
