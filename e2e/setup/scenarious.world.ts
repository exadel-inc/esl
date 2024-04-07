import {cucumber} from '../transformer/gherkin';

export interface TestEnv {
  screenshots: (string | Buffer)[];
}

cucumber.defineCreateWorld((): TestEnv => {
  return {
    screenshots: []
  };
});
