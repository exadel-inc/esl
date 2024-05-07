import type {ElementHandle} from 'puppeteer';
import type {TestEnv} from '../scenarios.env';


export function forEachElement<T, Args extends any[]>(
  fn: (element: ElementHandle, ...args: Args) => Promise<T>
): (world: TestEnv, ...args: Args) => Promise<T[]> {
  return async ({elements}: TestEnv, ...args: Args): Promise<T[]> => {
    return Promise.all(elements.map((element) => fn(element, ...args)));
  };
}
