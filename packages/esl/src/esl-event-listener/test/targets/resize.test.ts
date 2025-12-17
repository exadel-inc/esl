import {ESLResizeObserverTarget} from '../../core';
import {getLastResizeObserverMock} from '../../../esl-utils/test/resizeObserver.mock';

describe('ESLResizeObserverTarget EventTarget adapter', () => {
  describe('ESLResizeObserverTarget creation relatively to the targets', () => {
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');

    test(
      'The same element produces the same event target',
      () => expect(ESLResizeObserverTarget.for(el1) === ESLResizeObserverTarget.for(el1)).toBe(true)
    );
    test(
      'Different elements produces different event targets',
      () => expect(ESLResizeObserverTarget.for(el1) === ESLResizeObserverTarget.for(el2)).toBe(false)
    );
  });

  describe('ESLResizeObserverTarget do not throws error on incorrect input (silent processing)', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    beforeEach(() => consoleSpy.mockReset().mockImplementation(() => void 0));
    afterAll(() => consoleSpy.mockRestore());

    test('ESLResizeObserverTarget.for(undefined) returns null without error', () => {
      expect(ESLResizeObserverTarget.for(undefined as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLResizeObserverTarget.for(null) returns null without error', () => {
      expect(ESLResizeObserverTarget.for(null as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLResizeObserverTarget.for(123) returns null without error', () => {
      expect(ESLResizeObserverTarget.for(123 as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('ESLResizeObserverTarget.for({}) returns null without error', () => {
      expect(ESLResizeObserverTarget.for({} as any)).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('ESLResizeObserverTarget livecycle', () => {
    describe('Element as a taget', () => {
      const mock = getLastResizeObserverMock();
      const el = document.createElement('div');
      const target = ESLResizeObserverTarget.for(el);

      const cb1 = vi.fn();
      const cb2 = vi.fn();

      beforeEach(() => {
        mock.observe.mockReset();
        mock.unobserve.mockReset();
      });

      test('Subscription produces ResizeObserver interaction', () => {
        target.addEventListener(cb1);
        expect(mock.observe).toHaveBeenLastCalledWith(el);
        expect(mock.unobserve).not.toHaveBeenCalled();
      });
      test('Second subscription does not produces ResizeObserver interaction', () => {
        target.addEventListener(cb2);
        expect(mock.observe).not.toHaveBeenCalled();
        expect(mock.unobserve).not.toHaveBeenCalled();
      });
      test('Single unsubscription does not produces internal unsubscription', () => {
        target.removeEventListener(cb2);
        expect(mock.observe).not.toHaveBeenCalled();
        expect(mock.unobserve).not.toHaveBeenCalled();
      });
      test('Removal of all of subscriptions produces internal unsubscription', () => {
        target.removeEventListener(cb1);
        expect(mock.observe).not.toHaveBeenCalled();
        expect(mock.unobserve).toHaveBeenCalled();
      });
    });

    describe('ESLDomElementRelated as a taget', () => {
      const mock = getLastResizeObserverMock();
      const el = document.createElement('div');
      const mixin = {$host: el};
      const target = ESLResizeObserverTarget.for(el);
      const targetMixin = ESLResizeObserverTarget.for(mixin);

      const cb1 = vi.fn();
      const cb2 = vi.fn();

      beforeEach(() => {
        mock.observe.mockReset();
        mock.unobserve.mockReset();
      });

      test('Should be only one instance for ESLResizeObserverTarget and it`s host', () => {
        expect(targetMixin).toBe(target);
      });
      test('ESLDomElementRelated subscription produces ResizeObserver interaction', () => {
        targetMixin.addEventListener(cb1);
        expect(mock.observe).toHaveBeenLastCalledWith(el);
        expect(mock.unobserve).not.toHaveBeenCalled();
      });
      test('Repeated subscription of ESLDomElementRelated host does not produces ResizeObserver interaction', () => {
        target.addEventListener(cb2);
        expect(mock.observe).not.toHaveBeenCalled();
        expect(mock.unobserve).not.toHaveBeenCalled();
      });
      test('Single unsubscription does not produces internal unsubscription', () => {
        targetMixin.removeEventListener(cb1);
        expect(mock.observe).not.toHaveBeenCalled();
        expect(mock.unobserve).not.toHaveBeenCalled();
      });
      test('Removal of all of subscriptions produces internal unsubscription', () => {
        target.removeEventListener(cb2);
        expect(mock.observe).not.toHaveBeenCalled();
        expect(mock.unobserve).toHaveBeenCalled();
      });
    });
  });

  describe('ESLResizeObserverTarget dispatching of changes', () => {
    const mock = getLastResizeObserverMock();

    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const el3 = document.createElement('div');
    const mixin = {
      $host: el3
    };

    const cb11 = vi.fn();
    ESLResizeObserverTarget.for(el1).addEventListener(cb11);
    expect(cb11).not.toHaveBeenCalled();

    const cb12 = vi.fn();
    ESLResizeObserverTarget.for(el1).addEventListener(cb12);
    expect(cb12).not.toHaveBeenCalled();

    const cb21 = vi.fn();
    ESLResizeObserverTarget.for(el2).addEventListener(cb21);
    expect(cb21).not.toHaveBeenCalled();

    const cb31 = vi.fn();
    ESLResizeObserverTarget.for(mixin).addEventListener(cb31);

    const fakeEntry = (el: Element) => ({
      target: el,
      contentRect: el.getBoundingClientRect(),
      borderBoxSize: [{blockSize: 100, inlineSize: 100}],
      contentBoxSize: [{blockSize: 100, inlineSize: 100}],
      devicePixelContentBoxSize: [{blockSize: 100, inlineSize: 100}]
    });

    beforeEach(() => {
      cb11.mockReset();
      cb12.mockReset();
      cb21.mockReset();
      cb31.mockReset();
    });

    test('Dispatched change received by all subscribers', () => {
      const entry: ResizeObserverEntry = fakeEntry(el1);

      mock.callback.call(mock, [entry]);
      expect(cb11).toHaveBeenCalled();
      expect(cb12).toHaveBeenCalled();
      expect(cb21).not.toHaveBeenCalled();
      expect(cb31).not.toHaveBeenCalled();
    });

    test('Dispatched change received by correct target', () => {
      const entry: ResizeObserverEntry = fakeEntry(el2);

      mock.callback.call(mock, [entry]);
      expect(cb21).toHaveBeenCalled();
      expect(cb11).not.toHaveBeenCalled();
      expect(cb12).not.toHaveBeenCalled();
      expect(cb31).not.toHaveBeenCalled();
    });

    test('Dispatched change produces an Event instance', () => {
      const entry: ResizeObserverEntry = fakeEntry(el1);

      mock.callback.call(mock, [entry]);
      expect(cb11).toHaveBeenLastCalledWith(expect.any(Event));
      expect(cb11).toHaveBeenLastCalledWith(expect.objectContaining({type: 'resize'}));
    });

    test.each([
      'contentRect',
      'borderBoxSize',
      'contentBoxSize',
      'devicePixelContentBoxSize'
    ])('Dispatched change contains correct %s', (name: keyof ResizeObserverEntry) => {
      const entry: ResizeObserverEntry = fakeEntry(el1);
      mock.callback.call(mock, [entry]);
      expect(cb11).toHaveBeenLastCalledWith(expect.objectContaining({[name]: entry[name]}));
    });

    test('Dispatched change produces correct event target', () => {
      const entry: ResizeObserverEntry = fakeEntry(el2);

      mock.callback.call(mock, [entry]);
      expect(cb21).toHaveBeenLastCalledWith(expect.objectContaining({target: el2}));
    });

    test('Dispatched change produces correct event target for ESLDomElementRelated', () => {
      const entry: ResizeObserverEntry = fakeEntry(el3);

      mock.callback.call(mock, [entry]);
      expect(cb31).toHaveBeenLastCalledWith(expect.objectContaining({target: el3}));
    });
  });
});
