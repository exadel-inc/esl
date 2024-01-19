import {cucumber} from '../transformer/gherkin';

cucumber.defineRule('a page {string}', async (world: unknown, path: string) => {
  const url = new URL(path, 'http://localhost:3005/');
  await page.goto(url.toString());
  await page.addStyleTag({
    // TODO: move to generic file
    content: `
      .landing-layout::before { display: none !important; }
    `
  });
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
