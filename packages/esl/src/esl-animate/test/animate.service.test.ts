import {ESLAnimateService} from '../core';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {IntersectionObserverMock} from '../../esl-utils/test/intersectionObserver.mock';

describe('ESLAnimateService', () => {
  beforeAll(() => {
    IntersectionObserverMock.mock();
    jest.useFakeTimers();
  });

  afterAll(() => {
    IntersectionObserverMock.restore();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('Default ESLAnimateService config', () => {
    describe('Static class methods', () => {
      test('intersection is detected', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('intersection is detected, but with ration less than 1%', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(false);
      });

      test('intersection is triggered only once', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el, {repeat: false});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('intersection of multiple elements is detected', () => {
        const el = document.createElement('div');
        const el2 = document.createElement('div');
        ESLAnimateService.observe([el, el2]);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        IntersectionObserverMock.trigger(el2, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
        expect(CSSClassUtils.has(el2, 'in')).toBe(true);
      });

      test('element is observed for intersections', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el);
        expect(ESLAnimateService.isObserved(el)).toBe(true);
      });

      test('element gets unobserved and intersection isn`t triggered', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        ESLAnimateService.unobserve(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('debounced animation process isn`t triggered if it gets unobserved in process', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el);
        ESLAnimateService.unobserve(el);
        expect(ESLAnimateService.isObserved(el)).toBe(false);
      });
    });

    describe('Instance methods', () => {
      test('intersection is detected', () => {
        const el = document.createElement('div');
        const service = new ESLAnimateService();
        service.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('intersection is detected, but with ration less than 1%', () => {
        const el = document.createElement('div');
        const service = new ESLAnimateService();
        service.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(false);
      });

      test('intersection is triggered only once', () => {
        const el = document.createElement('div');
        const service = new ESLAnimateService();
        service.observe(el, {repeat: false});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('automatic unobservation after on second intersection', () => {
        const el = document.createElement('div');
        const service = new ESLAnimateService();
        service.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        jest.advanceTimersByTime(100);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('element gets unobserved and intersection isn`t triggered', () => {
        const el = document.createElement('div');
        const service = new ESLAnimateService();
        service.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        service.unobserve(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('debounced animation process isn`t triggered if it gets unobserved in process', () => {
        const el = document.createElement('div');
        const service = new ESLAnimateService();
        service.observe(el);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        service.unobserve(el);
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(false);
      });
    });
  });

  describe('Custom ESLAnimateService config', () => {
    test('intersection is triggered multiple times', () => {
      const el = document.createElement('div');
      ESLAnimateService.observe(el, {repeat: true});

      IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
      jest.advanceTimersByTime(100);

      IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has(el, 'in')).toBe(false);

      IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has(el, 'in')).toBe(true);
    });

    test('custom class is set', () => {
      const el = document.createElement('div');
      ESLAnimateService.observe(el, {cls: 'customclass'});

      IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has(el, 'customclass')).toBe(true);
    });

    test('observe even if class is present', () => {
      const el = document.createElement('div');
      el.classList.add('in');
      ESLAnimateService.observe(el, {force: true});
      expect(CSSClassUtils.has(el, 'in')).toBe(false);

      IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
      jest.advanceTimersByTime(100);
      expect(CSSClassUtils.has(el, 'in')).toBe(true);
    });

    describe('Intersection ratio', () => {
      test('intersection isn`t triggered until required visibility ratio', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el, {ratio: 0.2});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0.1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(false);
      });

      test('intersection is triggered on required visibility ratio', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el, {ratio: 0.2});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0.2, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });

      test('intersection is triggered after required visibility ratio', () => {
        const el = document.createElement('div');
        ESLAnimateService.observe(el, {ratio: 0.2});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0.4, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
      });
    });

    describe('Group delay', () => {
      test('additional delay added to each next element', () => {
        const el = document.createElement('div');
        const el2 = document.createElement('div');
        ESLAnimateService.observe([el, el2], {group: true, groupDelay: 100});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        IntersectionObserverMock.trigger(el2, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(101);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
        expect(CSSClassUtils.has(el2, 'in')).toBe(false);

        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el2, 'in')).toBe(true);
      });

      test('groupDelay is cancelled if intersected again in the groupDelay timespan', () => {
        const el = document.createElement('div');
        const el2 = document.createElement('div');
        ESLAnimateService.observe([el, el2], {group: true, groupDelay: 101});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        IntersectionObserverMock.trigger(el2, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        IntersectionObserverMock.trigger(el2, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);
        expect(CSSClassUtils.has(el, 'in')).toBe(true);
        expect(CSSClassUtils.has(el2, 'in')).toBe(false);
      });

      test('groupDelay is cancelled if element is not intersected anymore in delay span', () => {
        const el = document.createElement('div');
        const el2 = document.createElement('div');
        ESLAnimateService.observe([el, el2], {group: true, repeat: true, groupDelay: 101});

        IntersectionObserverMock.trigger(el, {intersectionRatio: 1, isIntersecting: true});
        IntersectionObserverMock.trigger(el2, {intersectionRatio: 1, isIntersecting: true});
        jest.advanceTimersByTime(100);

        IntersectionObserverMock.trigger(el, {intersectionRatio: 0, isIntersecting: false});
        IntersectionObserverMock.trigger(el2, {intersectionRatio: 0, isIntersecting: false});
        expect(CSSClassUtils.has(el, 'in')).toBe(false);
        expect(CSSClassUtils.has(el2, 'in')).toBe(false);
      });
    });
  });
});
