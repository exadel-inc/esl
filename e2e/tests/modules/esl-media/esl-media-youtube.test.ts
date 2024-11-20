import {promisifyTimeout} from '@exadel/esl/modules/esl-utils/async';
import {goTo} from '../../../setup/scenarios.page';
import {createMediaElement} from './utils/utils';

import type {ESLMedia} from '@exadel/esl/modules/esl-media/core/esl-media';

const createYTMedia = async (props: Partial<ESLMedia> = {}) => {
  await createMediaElement(Object.assign({mediaType: 'youtube', mediaId: '5ryf1AVl8Wg'}, props));
  await promisifyTimeout(1000);

  const $media = await page.$('esl-media');
  return {
    $media,
    $video: await $media!.$('iframe'),
  };
};

const cleanUp = async () => {
  const $media = await page.$('esl-media');
  await page.evaluate(($el: ESLMedia) => $el?.remove(), $media);
};

describe('esl-media: Youtube iframe', () => {

  beforeAll(() => goTo('/test/test-page'));

  describe('Youtube api', () => {
    afterEach(async () => cleanUp());

    test('YouTube API is present', async () => {
      await createYTMedia();
      const isYTAvailable = await page.evaluate(() => typeof YT !== 'undefined');
      expect(isYTAvailable).toBe(true);
    });

    test('YouTube API recognized the video', async () => {
      const {$media} = await createYTMedia();
      const mediaId = await page.evaluate(($el) => $el.getAttribute('media-id'), $media);
      const ytUrl = await page.evaluate(($el) => {
        const id = $el.querySelector('iframe')?.getAttribute('id');
        return (YT as any).get(id).getVideoUrl();
      }, $media);
      expect(ytUrl).toBe(`https://www.youtube.com/watch?v=${mediaId}`);
    });

    test('Media muted parameter', async () => {
      const {$media} = await createYTMedia({muted: true});
      const isMuted = await page.evaluate(($el) => {
        const id = $el.querySelector('iframe')?.getAttribute('id');
        const player = (YT as any).get(id);
        return player ? player.isMuted() : false;
      }, $media);

      expect(isMuted).toBe(true);
    });
  });

  describe('Youtube provider', () => {
    afterEach(async () => cleanUp());

    test('Media iframe present', async () => {
      const {$media, $video} = await createYTMedia();
      const ytID = await page.evaluate(($el) => $el.getAttribute('media-id'), $media);
      const iframeSrc = await page.evaluate(($el) => $el?.src, $video);

      expect(iframeSrc).toContain(`youtube.com/embed/${ytID}`);
    });

    test('Media playsinline parameter', async () => {
      const {$video} = await createYTMedia({playsinline: true});
      const iframeSrc = await page.evaluate(($el) => $el?.src, $video);

      expect(iframeSrc).toContain('playsinline=1');
    });

    test('Media autoplay parameter', async () => {
      const {$media} = await createYTMedia({autoplay: true});
      await promisifyTimeout(1000);

      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBeGreaterThan(0);
    });

    test('Media play', async () => {
      const {$media} = await createYTMedia();
      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBe(0);

      await page.evaluate(($el) => $el.play(), $media);
      await promisifyTimeout(1000);

      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBeGreaterThan(0);
    });

    test('Media pause', async () => {
      const {$media} = await createYTMedia();

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
      const {$media} = await createYTMedia();
      await page.evaluate(($el) => $el.play(), $media);
      await promisifyTimeout(1000);

      await page.evaluate(($el) => $el.stop(), $media);
      await promisifyTimeout(1000);

      expect(await page.evaluate(($el) => $el.currentTime, $media)).toBe(0);
    });
  });
});
