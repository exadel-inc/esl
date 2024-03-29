import {cucumber} from '../transformer/gherkin';

const port = process.env.PORT || 3007;

cucumber.defineRule('a page {string}', async (world: unknown, path: string) => {
  const url = new URL(path, `http://localhost:${port}/`);
  await page.goto(url.toString());
});

cucumber.defineRule('on mobile', async () => {
  await page.setViewport({
    width: 640,
    height: 480,
    deviceScaleFactor: 1
  });
});
cucumber.defineRule('on desktop', async () => {
  await page.setViewport({
    width: 1980,
    height: 1600,
    deviceScaleFactor: 1
  });
});
