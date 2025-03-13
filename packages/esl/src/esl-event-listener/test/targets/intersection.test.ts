import {ESLIntersectionEvent, ESLIntersectionTarget} from '../../core/targets/intersection.target';
import {IntersectionObserverMock} from '../../../esl-utils/test/intersectionObserver.mock';

describe('ESLIntersectionTarget proxy', () => {
  beforeAll(() => IntersectionObserverMock.mock());

  describe('ESLIntersectionTarget do not throws error on incorrect input (silent processing)', () => {
    const consoleSpy = jest.spyOn(console, 'warn');
    beforeEach(() => consoleSpy.mockReset().mockImplementation(() => void 0));
    afterAll(() => consoleSpy.mockRestore());

    test('ESLResizeObserverTarget.for(undefined) returns null without error', () => {
      expect(ESLIntersectionTarget.for(undefined as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLResizeObserverTarget.for(null) returns null without error', () => {
      expect(ESLIntersectionTarget.for(null as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLResizeObserverTarget.for(123) returns null without error', () => {
      expect(ESLIntersectionTarget.for(123 as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLResizeObserverTarget.for({}) returns null without error', () => {
      expect(ESLIntersectionTarget.for({} as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });

    test('ESLResizeObserverTarget.for({}) returns null without error', () => {
      expect(ESLIntersectionTarget.for([1, 2, 3] as any)).toBeNull();
      expect(consoleSpy).toBeCalled();
    });
  });

  describe('ESLIntersectionTarget wraps IntersectionObserver', () => {
    test('ESLIntersectionTarget.for() creates IntersectionObserver instance', () => {
      const target = ESLIntersectionTarget.for(document.createElement('div'));
      expect(target).not.toBeNull();
      expect(IntersectionObserver).toBeCalled();
    });

    test('ESLIntersectionTarget.for() creates IntersectionObserver instance with default options', () => {
      const target = ESLIntersectionTarget.for(document.createElement('div'));
      expect(target).not.toBeNull();
      expect(IntersectionObserver).toBeCalledWith(expect.any(Function), ESLIntersectionTarget.DEFAULTS);
    });

    test('ESLIntersectionTarget.for() creates IntersectionObserver instance with custom options', () => {
      const options = {rootMargin: '10px'};
      const target = ESLIntersectionTarget.for(document.createElement('div'), options);
      expect(target).not.toBeNull();
      expect(IntersectionObserver).toBeCalledWith(expect.any(Function), {
        ...ESLIntersectionTarget.DEFAULTS,
        ...options
      });
    });
  });

  describe('ESLIntersectionTarget creates IntersectionObserver subscription', () => {
    test('ESLIntersectionTarget subscribes to IntersectionObserver on first subscription', () => {
      const target = ESLIntersectionTarget.for(document.createElement('div'));

      const listener = jest.fn();
      target.addEventListener(listener);
      expect(IntersectionObserverMock.lastInstance.observe).toBeCalled();
    });

    test('ESLIntersectionTarget does not subscribe to IntersectionObserver on second subscription', () => {
      const target = ESLIntersectionTarget.for(document.createElement('div'));

      const listener = jest.fn();
      target.addEventListener(listener);
      const listener2 = jest.fn();
      target.addEventListener(listener2);
      expect(IntersectionObserverMock.lastInstance.observe).toBeCalledTimes(1);
    });

    test('ESLIntersectionTarget disconnect IntersectionObserver on last unsubscription', () => {
      const target = ESLIntersectionTarget.for(document.createElement('div'));

      const listener = jest.fn();
      target.addEventListener(listener);
      const listener2 = jest.fn();
      target.addEventListener(listener2);
      target.removeEventListener(listener);
      expect(IntersectionObserverMock.lastInstance.disconnect).not.toBeCalled();
      target.removeEventListener(listener2);
      expect(IntersectionObserverMock.lastInstance.disconnect).toBeCalled();
    });
  });

  describe('ESLIntersectionTarget dispatches events when IntersectionObserver fires', () => {
    test('ESLIntersectionTarget dispatches events when IntersectionObserver fires', () => {
      const $el = document.createElement('div');
      const target = ESLIntersectionTarget.for($el);

      const listener = jest.fn();
      target.addEventListener(listener);
      IntersectionObserverMock.trigger($el, {isIntersecting: true});
      expect(listener).toBeCalled();
    });

    test('ESLIntersectionTarget dispatches ESLIntersectionEvent with IntersectionObserverEntry properties', () => {
      const $el = document.createElement('div');
      const target = ESLIntersectionTarget.for($el);

      const listener = jest.fn();
      target.addEventListener(listener);
      const entry: IntersectionObserverEntry = IntersectionObserverMock.createEntry($el, {
        isIntersecting: true,
        intersectionRatio: 0.5
      });
      IntersectionObserverMock.trigger($el, entry);
      expect(listener).lastCalledWith(expect.objectContaining({type: ESLIntersectionEvent.TYPE}));
      expect(listener).lastCalledWith(expect.objectContaining(entry));
    });
  });
});
