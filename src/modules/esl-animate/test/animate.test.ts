import {ESLAnimate} from '../core';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {MockIntersectionObserver, triggerIntersection} from './intersectionObserver.mock';

describe('ESLAnimate', () => {
  const $el = document.createElement(ESLAnimate.is) as ESLAnimate;
  document.body.appendChild($el);
  beforeAll(() => {
    jest.useFakeTimers();
    window.IntersectionObserver = MockIntersectionObserver;
    ESLAnimate.register();
  });

  test('ESLAnimate instance', () => expect($el).toBeInstanceOf(ESLAnimate));

  describe('ESLAnimate process', () => {
    test('element is not connected', () => {
      $el.repeat = true;
      triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has($el, 'in')).toBe(false);
      $el.repeat = false;
    });

    test('default animation config', () => {
      triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has($el, 'in')).toBe(true);

      triggerIntersection($el, {intersectionRatio: 0, isIntersecting: false});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has($el, 'in')).toBe(true);
    });

    test('observe resubscrubtion on attribute change', () => {
      $el.repeat = true;
      triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has($el, 'in')).toBe(true);

      triggerIntersection($el, {intersectionRatio: 0, isIntersecting: false});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has($el, 'in')).toBe(false);
    });
  });

  describe('ESLAnimate targets', () => {
    afterAll(() => $el.removeAttribute('target'));

    test('default target', () => expect($el.$targets).toStrictEqual([$el]));

    test('additional animate targets', () => {
      const $el2 = document.createElement('div');
      document.body.appendChild($el2);
      jest.advanceTimersByTime(1);
      $el.setAttribute('target', '::next');
      expect($el.$targets).toStrictEqual([$el2]);
    });
  });

  test('disconnected callback unobserved intersection', () => {
    $el.remove();
    triggerIntersection($el, {intersectionRatio: 1, isIntersecting: true});
    jest.advanceTimersByTime(100);
    expect(CSSClassUtils.has($el, 'in')).toBe(false);
  });
});
