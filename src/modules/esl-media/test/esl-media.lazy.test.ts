import '../providers/html5/video-provider';

import {ESLMedia} from '../core';
import {promisifyTimeout} from '../../esl-utils/async/promise';
import {IntersectionObserverMock} from '../../esl-utils/test/intersectionObserver.mock';

describe('esl-media: lazy loading unit tests', () => {

  beforeAll(() => {
    IntersectionObserverMock.mock();
    ESLMedia.register();
  });
  afterAll(() => IntersectionObserverMock.unmock());

  test('ESLMedia is loading immediately unless the lazy and disabled attributes are set', async () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    document.body.appendChild($media);

    await promisifyTimeout(100);
    $media.querySelectorAll('video').forEach((v) => v.dispatchEvent(new Event('loadedmetadata')));
    await promisifyTimeout(0);

    expect($media.ready).toBe(true);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });

  test('ESLMedia is not loading when lazy attribute is set to manual', async () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('lazy', 'manual');
    document.body.appendChild($media);

    await promisifyTimeout(100);

    expect($media.ready).toBe(false);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));
  });

  test('ESLMedia with auto lazy is not loading until it is intersected', async () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('lazy', '');
    document.body.appendChild($media);

    await promisifyTimeout(100);

    expect($media.ready).toBe(false);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));

    IntersectionObserverMock.trigger($media, {isIntersecting: true, intersectionRatio: 1});
    await promisifyTimeout(100);

    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });

  test('ESLMedia with lazy="manual" prevents loading until manual removal', async () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('lazy', 'manual');
    document.body.appendChild($media);

    await promisifyTimeout(100);
    IntersectionObserverMock.trigger($media, {isIntersecting: true, intersectionRatio: 1});

    await promisifyTimeout(100);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));

    $media.removeAttribute('lazy');
    await promisifyTimeout(100);

    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });

  test('ESLMedia (with play-in-viewport) with lazy="manual" prevents loading until manual removal', async () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('play-in-viewport', '');
    $media.setAttribute('lazy', 'manual');
    document.body.appendChild($media);

    await promisifyTimeout(100);
    IntersectionObserverMock.trigger($media, {isIntersecting: true, intersectionRatio: 1});

    await promisifyTimeout(100);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));

    $media.removeAttribute('lazy');
    await promisifyTimeout(100);

    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });
});