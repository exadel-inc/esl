import '../providers/html5/video-provider';

import {ESLMedia} from '../core';
import {promisifyTimeout} from '../../esl-utils/async/promise';
import {IntersectionObserverMock} from '../../esl-utils/test/intersectionObserver.mock';
import {getMatchMediaMock} from '../../esl-utils/test/matchMedia.mock';

describe('esl-media: lazy loading unit tests', () => {
  jest.spyOn(console, 'debug').mockImplementation(() => {});

  beforeAll(() => {
    IntersectionObserverMock.mock();
    ESLMedia.register();
  });
  afterAll(() => IntersectionObserverMock.unmock());

  const createMedia = (props: Partial<ESLMedia>) => {
    const $media = ESLMedia.create();
    Object.assign($media, {
      mediaSrc: 'https://esl-ui.com/assets/media/video.mp4'
    }, props);
    return $media;
  };
  afterEach(() => {
    while (document.body.firstChild) document.body.removeChild(document.body.firstChild);
  });

  test('ESLMedia checks the load condition before load', async () => {
    const $media = createMedia({loadCondition: 'not all'});
    document.body.appendChild($media);

    await promisifyTimeout(100);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));
  });

  test('ESLMedia loads as soon as load condition become truthy', async () => {
    const mqMock = getMatchMediaMock('(min-width: 100px)');
    const $media = createMedia({loadCondition: '(min-width: 100px)'});
    document.body.appendChild($media);

    await promisifyTimeout(100);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));

    mqMock.set(true);
    await promisifyTimeout(100);
    expect($media.querySelectorAll('*')).not.toEqual(expect.objectContaining({length: 0}));
  });

  describe('ESLMedia load condition classes', () => {
    test('ESLMedia declining condition leads to "declined" class on the target', async () => {
      const $media = createMedia({
        loadCondition: 'not all',
        loadConditionClass: 'accepted !declined',
        loadConditionClassTarget: 'body'
      });
      document.body.appendChild($media);

      await promisifyTimeout(100);
      expect(document.body.classList.contains('accepted')).toBe(false);
      expect(document.body.classList.contains('declined')).toBe(true);
    });

    test('ESLMedia accepting condition leads to "accepted" class on the target', async () => {
      const $media = createMedia({
        loadCondition: 'all',
        loadConditionClass: 'accepted !declined',
        loadConditionClassTarget: 'body'
      });
      document.body.appendChild($media);

      await promisifyTimeout(100);
      expect(document.body.classList.contains('accepted')).toBe(true);
      expect(document.body.classList.contains('declined')).toBe(false);
    });

    test('ESLMedia load condition does not clock "declined" class on the target', async () => {
      const $media = createMedia({
        lazy: 'manual',
        loadCondition: 'not all',
        loadConditionClass: 'accepted !declined',
        loadConditionClassTarget: 'body'
      });
      document.body.appendChild($media);

      await promisifyTimeout(100);
      expect(document.body.classList.contains('accepted')).toBe(false);
      expect(document.body.classList.contains('declined')).toBe(true);
    });

    test('ESLMedia load condition does not clock "accepted" class on the target', async () => {
      const $media = createMedia({
        lazy: 'manual',
        loadCondition: 'all',
        loadConditionClass: 'accepted !declined',
        loadConditionClassTarget: 'body'
      });
      document.body.appendChild($media);

      await promisifyTimeout(100);
      expect(document.body.classList.contains('accepted')).toBe(true);
      expect(document.body.classList.contains('declined')).toBe(false);
    });
  });
});
