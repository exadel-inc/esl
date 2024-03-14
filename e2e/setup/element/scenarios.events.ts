import {cucumber} from '../../transformer/gherkin';

import type {TestEnv} from '../scenarios.world';

cucumber.defineRule('click element', async (world: TestEnv) => {
  await world.elements[0]?.click();
});

cucumber.defineRule('hover element', async (world: TestEnv) => {
  await world.elements[0]?.hover();
});
