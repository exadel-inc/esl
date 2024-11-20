import {goTo} from '../../../setup/scenarios.page';
import {createMediaElement} from './utils/utils';

import type {ESLMedia} from '@exadel/esl/modules/esl-media/core/esl-media';

const createIframeMedia = async (props: Partial<ESLMedia> = {}) => {
  await createMediaElement(Object.assign({'media-type': 'iframe', 'media-src': 'https://player.vimeo.com/video/1084537'}, props));
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const $media = await page.$('esl-media');
  return {
    $media,
    $video: await $media!.$('iframe'),
  };
};

describe('esl-media: abstract iframe', () => {

  beforeAll(() => goTo('/test/test-page'));

  afterEach(async () => {
    const $media = await page.$('esl-media');
    await page.evaluate(($el: ESLMedia) => $el.remove(), $media);
  });

  test('Media iframe present', async () => {
    const {$video} = await createIframeMedia();
    expect($video).not.toBeNull();
  });

  test('Media playsinline attribute present', async () => {
    const {$video} = await createIframeMedia({playsinline: true});
    const iframeSrc = await page.evaluate(($el) => $el?.hasAttribute('playsinline'), $video);

    expect(iframeSrc).toBe(true);
  });
});
