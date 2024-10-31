import {promisifyTimeout} from '@exadel/esl/modules/esl-utils/async';
import {goTo} from '../../../setup/scenarios.page';
import {createMediaElement} from './utils/utils';

import type {ESLMedia} from '@exadel/esl/modules/esl-media/core/esl-media';

const createVideoMedia = async (props: Partial<ESLMedia> = {}) => {
  await createMediaElement(Object.assign({mediaType: 'video', mediaSrc: '/assets/media/video_1.mp4'}, props));
  await promisifyTimeout(1000);

  const $media = await page.$('esl-media');
  return {
    $media,
    $video: await $media!.$('video'),
  };
};

const cleanUp = async () => {
  const $media = await page.$('esl-media');
  await page.evaluate(($el) => $el?.remove(), $media);
};

describe('esl-media: HTML video', () => {

  beforeAll(() => goTo('/test/test-page'));

  describe('Video element', () => {
    afterEach(async () => cleanUp());

    test('Media iframe present', async () => {
      const {$video} = await createVideoMedia();

      expect($video).not.toBeNull();
    });

    test('Media playsinline parameter', async () => {
      const {$video} = await createVideoMedia({playsinline: true});
      const isInline = await page.evaluate(($el) => $el?.playsInline, $video);

      expect(isInline).toBe(true);
    });

    test('Media muted parameter', async () => {
      const {$video} = await createVideoMedia({muted: true});
      const isMuted = await page.evaluate(($el) => $el?.muted, $video);

      expect(isMuted).toBe(true);
    });
  });

  describe('Video provider', () => {
    afterEach(async () => cleanUp());

    test('Media autoplay parameter', async () => {
      const {$media} = await createVideoMedia({autoplay: true});
      await promisifyTimeout(1000);

      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBeGreaterThan(0);
    });

    test('Media play', async () => {
      const {$media} = await createVideoMedia();

      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBe(0);

      await page.evaluate(($el) => $el.play(), $media);
      await promisifyTimeout(1000);

      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBeGreaterThan(0);
    });

    test('Media pause', async () => {
      const {$media} = await createVideoMedia();

      await page.evaluate(($el) => $el.play(), $media);
      await promisifyTimeout(1000);

      const playtime = await page.evaluate(($el) => {
        $el.pause();
        return $el.currentTime;
      }, $media);
      await promisifyTimeout(1000);

      const pausedTime = await page.evaluate(($el) => $el.currentTime, $media);

      expect(pausedTime.toFixed(1)).toEqual(playtime.toFixed(1));
    });

    test('Media stop', async () => {
      const {$media} = await createVideoMedia();
      await page.evaluate(($el) => $el.play(), $media);
      await promisifyTimeout(1000);

      await page.evaluate(($el) => $el.stop(), $media);
      await promisifyTimeout(1000);

      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBe(0);
    });
  });
});
