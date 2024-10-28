import {goTo} from '../../../setup/scenarios.page';

describe('esl-media: e2e testing', () => {

  beforeAll(() => goTo('/test/test-esl-media'));

  test('Youtube media', async () => {
    const $media = await page.$('esl-media[media-type="youtube"]');
    const iframeSrc = await page.evaluateHandle(($el) => $el.querySelector('iframe')?.src, $media);

    expect(await iframeSrc.jsonValue()).toContain('youtube.com/embed');
  });

  test('Iframe media', async () => {
    const $media = await page.$('esl-media[media-type="iframe"]');
    const $iframe = await page.evaluateHandle(($el) => $el.querySelector('iframe'), $media);

    expect($iframe).not.toBeNull();
  });

  test('HTML video media', async () => {
    const $media = await page.$('esl-media[media-type="video"]');
    const $video = await page.evaluateHandle(($el) => $el.querySelector('video'), $media);

    expect($video).not.toBeNull();
  });
});
