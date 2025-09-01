import '../providers/html5/video-provider';

import {ESLMedia} from '../core';
import {IntersectionObserverMock} from '../../esl-utils/test/intersectionObserver.mock';

describe('esl-media: lazy loading unit tests', () => {
  jest.useFakeTimers();

  beforeAll(() => {
    IntersectionObserverMock.mock();
    ESLMedia.register();

    // silent console.debug
    jest.spyOn(console, 'debug').mockImplementation(() => undefined);
  });
  afterAll(() => IntersectionObserverMock.restore());

  test('ESLMedia is loading immediately unless the lazy and disabled attributes are set', () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    document.body.appendChild($media);

    jest.advanceTimersByTime(100);
    $media.querySelectorAll('video').forEach((v) => v.dispatchEvent(new Event('loadedmetadata')));
    jest.advanceTimersByTime(10);

    expect($media.ready).toBe(true);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });

  test('ESLMedia is not loading when lazy attribute is set to manual', () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('lazy', 'manual');
    document.body.appendChild($media);

    jest.advanceTimersByTime(100);

    expect($media.ready).toBe(false);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));
  });

  test('ESLMedia with auto lazy is not loading until it is intersected', () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('lazy', '');
    document.body.appendChild($media);

    jest.advanceTimersByTime(100);

    expect($media.ready).toBe(false);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));

    IntersectionObserverMock.trigger($media, {isIntersecting: true, intersectionRatio: 1});
    jest.advanceTimersByTime(100);

    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });

  test('ESLMedia with lazy="manual" prevents loading until manual removal', () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('lazy', 'manual');
    document.body.appendChild($media);

    jest.advanceTimersByTime(100);
    IntersectionObserverMock.trigger($media, {isIntersecting: true, intersectionRatio: 1});

    jest.advanceTimersByTime(100);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));

    $media.removeAttribute('lazy');
    jest.advanceTimersByTime(100);

    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });

  test('ESLMedia (with play-in-viewport) with lazy="manual" prevents loading until manual removal', () => {
    const $media = ESLMedia.create();
    $media.setAttribute('media-src', 'https://esl-ui.com/assets/media/video.mp4');
    $media.setAttribute('play-in-viewport', '');
    $media.setAttribute('lazy', 'manual');
    document.body.appendChild($media);

    jest.advanceTimersByTime(100);
    IntersectionObserverMock.trigger($media, {isIntersecting: true, intersectionRatio: 1});

    jest.advanceTimersByTime(100);
    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 0}));

    $media.removeAttribute('lazy');
    jest.advanceTimersByTime(100);

    expect($media.querySelectorAll('*')).toEqual(expect.objectContaining({length: 1}));
  });
});
