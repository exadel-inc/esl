import {cucumber} from '../transformer/gherkin';
import type {ElementHandle} from 'puppeteer';

export interface TestEnv {
  screenshots: (string | Buffer)[];
  elements: ElementHandle[];
}

cucumber.defineCreateWorld((): TestEnv => {
  return {
    screenshots: [],
    elements: []
  };
});
