import {cucumber} from '../../transformer/gherkin';
import {forEachElement} from './scenarios.utils';

import type {ElementHandle} from 'puppeteer';

function hasClasses(element: ElementHandle, classList: string | string[]): Promise<boolean> {
  const classes = typeof classList === 'string' ? classList.split(' ') : classList;
  return element?.evaluate((el, clsList) => clsList.every((cls) => el.classList.contains(cls)), classes);
}

cucumber.defineRule('check if class {string} is present', forEachElement(
  async (element, classNames) => expect(await hasClasses(element, classNames)).toBe(true)
));

cucumber.defineRule('check if class {string} isn`t present', forEachElement(
  async (element, classNames) => expect(await hasClasses(element, classNames)).toBe(false)
));
