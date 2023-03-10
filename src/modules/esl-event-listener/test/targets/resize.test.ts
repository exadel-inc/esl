import {ESLEventUtils} from '../../core/api';
import {getLastResizeObserverMock} from '../../../esl-utils/test/resizeObserver.mock';

describe('ESLEventUtils: ResizeObserver EventTarget adapter', () => {
  describe('ESLResizeObserverTarget creation relatively to the targets', () => {
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');

    test(
      'The same element produces the same event target',
      () => expect(ESLEventUtils.resize(el1) === ESLEventUtils.resize(el1)).toBe(true)
    );
    test(
      'Different elements produces different event targets',
      () => expect(ESLEventUtils.resize(el1) === ESLEventUtils.resize(el2)).toBe(false)
    );
  });

  describe('ESLResizeObserverTarget livecycle', () => {
    const mock = getLastResizeObserverMock();
    const el = document.createElement('div');
    const target = ESLEventUtils.resize(el);

    const cb1 = jest.fn();
    const cb2 = jest.fn();

    beforeEach(() => {
      mock.observe.mockReset();
      mock.unobserve.mockReset();
    });

    test('Subscription produces ResizeObserver interaction', () => {
      target.addEventListener(cb1);
      expect(mock.observe).lastCalledWith(el);
      expect(mock.unobserve).not.toBeCalled();
    });
    test('Second subscription does not produces ResizeObserver interaction', () => {
      target.addEventListener(cb2);
      expect(mock.observe).not.toBeCalled();
      expect(mock.unobserve).not.toBeCalled();
    });
    test('Single unsubscription does not produces internal unsubscription', () => {
      target.removeEventListener(cb2);
      expect(mock.observe).not.toBeCalled();
      expect(mock.unobserve).not.toBeCalled();
    });
    test('Remove of all of subscriptions produce internal unsubscription', () => {
      target.removeEventListener(cb1);
      expect(mock.observe).not.toBeCalled();
      expect(mock.unobserve).toBeCalled();
    });
  });

  describe('ESLResizeObserverTarget dispatching of changes', () => {
    const mock = getLastResizeObserverMock();

    const el1 = document.createElement('div');
    const el2 = document.createElement('div');

    const cb1_1 = jest.fn();
    ESLEventUtils.resize(el1).addEventListener(cb1_1);
    expect(cb1_1).not.toBeCalled();

    const cb1_2 = jest.fn();
    ESLEventUtils.resize(el1).addEventListener(cb1_2);
    expect(cb1_2).not.toBeCalled();

    const cb2_1 = jest.fn();
    ESLEventUtils.resize(el2).addEventListener(cb2_1);
    expect(cb2_1).not.toBeCalled();

    const fakeEntry = (el: Element) => ({
      target: el,
      contentRect: el.getBoundingClientRect(),
      borderBoxSize: [{blockSize: 100, inlineSize: 100}],
      contentBoxSize: [{blockSize: 100, inlineSize: 100}],
      devicePixelContentBoxSize: [{blockSize: 100, inlineSize: 100}]
    });

    beforeEach(() => {
      cb1_1.mockReset();
      cb1_2.mockReset();
      cb2_1.mockReset();
    });

    test('Dispatched change received by all subscribers', () => {
      const entry: ResizeObserverEntry = fakeEntry(el1);

      mock.callback.call(mock, [entry]);
      expect(cb1_1).toBeCalled();
      expect(cb1_2).toBeCalled();
      expect(cb2_1).not.toBeCalled();
    });

    test('Dispatched change received by correct target', () => {
      const entry: ResizeObserverEntry = fakeEntry(el2);

      mock.callback.call(mock, [entry]);
      expect(cb2_1).toBeCalled();
      expect(cb1_1).not.toBeCalled();
      expect(cb1_2).not.toBeCalled();
    });

    test('Dispatched change produces an Event instance', () => {
      const entry: ResizeObserverEntry = fakeEntry(el1);

      mock.callback.call(mock, [entry]);
      expect(cb1_1).lastCalledWith(expect.any(Event));
      expect(cb1_1).lastCalledWith(expect.objectContaining({type: 'resize'}));
    });

    test('Dispatched change passed as a detail of event', () => {
      const entry: ResizeObserverEntry = fakeEntry(el1);

      mock.callback.call(mock, [entry]);
      expect(cb1_1).lastCalledWith(expect.objectContaining({detail: entry}));
    });

    test('Dispatched change produces correct event target', () => {
      const entry: ResizeObserverEntry = fakeEntry(el2);

      mock.callback.call(mock, [entry]);
      expect(cb2_1).lastCalledWith(expect.objectContaining({target: el2}));
    });
  });
});
