import {cucumber} from '../transformer/gherkin';

cucumber.defineRule('on mobile', async () => {
  await page.setViewport({
    width: 450,
    height: 900,
    deviceScaleFactor: 1
  });
});

cucumber.defineRule('on tablet', async () => {
  await page.setViewport({
    width: 768,
    height: 1024,
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
