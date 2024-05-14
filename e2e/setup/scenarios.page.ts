import {cucumber} from '../transformer/gherkin';

const port = process.env.PORT || 3007;

cucumber.defineRule('a page {string}', async (env: unknown, path: string) => {
  const url = new URL(path, `http://localhost:${port}/`);
  await page.goto(url.toString());
});
