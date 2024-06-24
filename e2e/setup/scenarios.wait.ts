import {cucumber} from '../transformer/gherkin';

cucumber.defineRule('wait for {float}s', async (env: unknown, timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout * 1000));
});

cucumber.defineRule('wait for {int}ms', async (env: unknown, timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
});
