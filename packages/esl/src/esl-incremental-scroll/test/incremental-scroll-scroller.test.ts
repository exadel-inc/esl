import {ESLIncrementalScroller} from '../core/incremental-scroll-scroller';
import {Rect} from '../../esl-utils/dom/rect';
import type {ESLIncrementalScrollOptions} from '../core/incremental-scroll-types';

jest.mock('../core/incremental-scroll-axis-stepper');
const createOptions = (overrides: Partial<ESLIncrementalScrollOptions> = {}): ESLIncrementalScrollOptions => ({
  stabilityThreshold: 200,
  timeout: 500,
  ...overrides
});

describe('ESLIncrementalScroller', () => {
  describe('constructor', () => {
    test('should create instance with element and options', () => {
      const el = document.createElement('div');
      const options = createOptions();

      const scroller = new ESLIncrementalScroller(el, options);

      expect(scroller).toBeInstanceOf(ESLIncrementalScroller);
    });

    test('should accept null element', () => {
      const scroller = new ESLIncrementalScroller(null, createOptions());
      expect(scroller).toBeInstanceOf(ESLIncrementalScroller);
    });
  });

  describe('stepOptions', () => {
    test('should return element rect when element provided', () => {
      const el = document.createElement('div');
      const scroller = new ESLIncrementalScroller(el, createOptions());

      const rectSpy = jest.spyOn(Rect, 'from').mockReturnValue(new Rect(1, 2, 3, 4));

      const options = scroller.stepOptions;

      expect(options.elRect).toBeDefined();
      expect(rectSpy).toHaveBeenCalledWith(el);

      rectSpy.mockRestore();
    });

    test('should return undefined elRect when element is null', () => {
      const scroller = new ESLIncrementalScroller(null, createOptions());

      expect(scroller.stepOptions.elRect).toBeUndefined();
    });

    test('should return container rect when scrollContainer provided', () => {
      const container = document.createElement('div');
      const scroller = new ESLIncrementalScroller(null, createOptions({scrollContainer: container}));

      const rectSpy = jest.spyOn(Rect, 'from').mockReturnValue(new Rect(5, 6, 7, 8));

      const options = scroller.stepOptions;

      expect(options.containerRect).toBeDefined();
      expect(rectSpy).toHaveBeenCalledWith(container);

      rectSpy.mockRestore();
    });

    test('should return undefined containerRect when no scrollContainer', () => {
      const scroller = new ESLIncrementalScroller(null, createOptions());

      expect(scroller.stepOptions.containerRect).toBeUndefined();
    });
  });

  describe('shouldContinue', () => {
    test('should return boolean value', () => {
      const scroller = new ESLIncrementalScroller(null, createOptions());

      expect(typeof scroller.shouldContinue).toBe('boolean');
    });
  });

  describe('step', () => {
    test('should update scrollContainer position', () => {
      const container = document.createElement('div');
      container.scrollLeft = 10;
      container.scrollTop = 20;
      const scroller = new ESLIncrementalScroller(null, createOptions({scrollContainer: container}));

      scroller.step();

      expect(container.scrollLeft).toBeDefined();
      expect(container.scrollTop).toBeDefined();
    });

    test('should call window.scrollTo when no container', () => {
      const scroller = new ESLIncrementalScroller(null, createOptions());
      const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

      scroller.step();

      expect(scrollToSpy).toHaveBeenCalled();

      scrollToSpy.mockRestore();
    });
  });
});
