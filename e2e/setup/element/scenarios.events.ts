import {cucumber} from '../../transformer/gherkin';

import type {TestEnv} from '../scenarios.env';

cucumber.defineRule('click element', async ({elements}: TestEnv) => {
  if (!elements.length) throw new Error('E2E: No elements found');
  await elements[0].click();
});

cucumber.defineRule('hover element', async ({elements}: TestEnv) => {
  if (!elements.length) throw new Error('E2E: No elements found');
  await elements[0].hover();
});
