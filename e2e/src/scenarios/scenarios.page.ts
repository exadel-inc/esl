import {cucumber} from '../transformer/gherkin';

const port = process.env.PORT || 3007;

export const goTo = async (path: string): Promise<void> => {
  const url = new URL(path, `http://localhost:${port}/`);
  await page.goto(url.toString());
};

cucumber.defineRule('a page {string}', async (env: unknown, path: string) => goTo(path));
