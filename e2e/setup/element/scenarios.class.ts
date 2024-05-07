import {cucumber} from '../../transformer/gherkin';

import type {ElementHandle} from 'puppeteer';
import type {TestEnv} from '../scenarios.world';

function hasClasses(element: ElementHandle, classList: string | string[]): Promise<boolean> {
  const classes = typeof classList === 'string' ? classList.split(' ') : classList;
  return element?.evaluate((el, clsList) => clsList.every((cls) => el.classList.contains(cls)), classes);
}

cucumber.defineRule('check if class {string} is present', async (world: TestEnv, classNames: string) => {
  for (const element of world.elements) {
    expect(await hasClasses(element, classNames)).toBe(true);
  }
});

cucumber.defineRule('check if class {string} isn`t present', async (world: TestEnv, classNames: string) => {
  for (const element of world.elements) {
    expect(await hasClasses(element, classNames)).toBe(false);
  }
});
