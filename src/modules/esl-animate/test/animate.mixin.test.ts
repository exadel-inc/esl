import {ESLAnimateMixin} from '../core';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {MockIntersectionObserver, triggerIntersection} from './intersectionObserver.mock';

jest.mock('../../esl-utils/dom/ready', () => ({
  onDocumentReady: (cb: any) => cb()
}));

describe('ESLAnimate', () => {
  const $el = document.createElement('div');
  $el.toggleAttribute(ESLAnimateMixin.is, true);
  document.body.appendChild($el);

  window.IntersectionObserver = MockIntersectionObserver;
  ESLAnimateMixin.register();

  const mixin = ESLAnimateMixin.get($el) as ESLAnimateMixin;
  jest.useFakeTimers();

  test('ESLAnimate instance', () => expect(mixin).toBeInstanceOf(ESLAnimateMixin));

  test('observation on connected callback', () => {
    triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'in')).toBe(true);

    triggerIntersection($el, {intersectionRatio: 0, isIntersecting: false});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'in')).toBe(true);
  });

  test('manual reanimation function', () => {
    mixin.options = {repeat: true};
    mixin.reanimate();

    triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'in')).toBe(true);

    triggerIntersection($el, {intersectionRatio: 0, isIntersecting: false});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'in')).toBe(false);
  });

  test('custom observe config', () => {
    mixin.options = {cls: 'customclass'};
    mixin.reanimate();

    triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'customclass')).toBe(true);
    mixin.options = {};
  });

  test('custom observe config through static defaultconfig property', async () => {
    ESLAnimateMixin.defaultConfig = {cls: 'anotherclass', repeat: true, ratio: 0.8, force: false};
    mixin.reanimate();

    triggerIntersection($el, {intersectionRatio: 0.79, isIntersecting: true});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'anotherclass')).toBe(false);

    triggerIntersection($el, {intersectionRatio: 8, isIntersecting: true});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'anotherclass')).toBe(true);

    triggerIntersection($el, {intersectionRatio: 0, isIntersecting: false});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'anotherclass')).toBe(false);
  });

  test('disconnected callback', async () => {
    $el.toggleAttribute(ESLAnimateMixin.is);

    triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
    await Promise.resolve();
    expect(CSSClassUtils.has($el, 'in')).toBe(false);
  });
});
