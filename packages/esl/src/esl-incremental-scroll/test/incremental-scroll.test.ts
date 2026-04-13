import {ESLIncrementalScroll} from '../core/incremental-scroll';
import {ESLIncrementalScroller} from '../core/incremental-scroll-scroller';


vi.mock('../core/incremental-scroll-scroller');
const MockedScroller = vi.mocked(ESLIncrementalScroller);

describe('ESLIncrementalScroll class', () => {
  describe('ESLIncrementalScroll.defaults', () => {
    const originalDefaults = ESLIncrementalScroll.defaults;

    afterEach(() => {
      ESLIncrementalScroll.defaults = originalDefaults;
    });

    test('should return default options via getter', () => {
      const {defaults} = ESLIncrementalScroll;
      expect(defaults).toEqual({
        alignment: {
          x: expect.any(Function),
          y: expect.any(Function)
        },
        offset: 0,
        stabilityThreshold: 500,
        timeout: 4000
      });
    });

    test('should update defaults via setter', () => {
      ESLIncrementalScroll.defaults = {
        offset: 10,
        timeout: 2000
      };

      const {defaults} = ESLIncrementalScroll;

      expect(defaults.offset).toBe(10);
      expect(defaults.timeout).toBe(2000);
      expect(defaults.stabilityThreshold).toBe(500);
    });

    test('should preserve existing values when setting partial overrides', () => {
      ESLIncrementalScroll.defaults = {stabilityThreshold: 300};

      const {defaults} = ESLIncrementalScroll;

      expect(defaults.stabilityThreshold).toBe(300);
      expect(defaults.offset).toBe(0);
      expect(defaults.timeout).toBe(4000);
    });

    test('should ignore undefined values', () => {
      ESLIncrementalScroll.defaults = {offset: -10, timeout: undefined};

      const {defaults} = ESLIncrementalScroll;

      expect(defaults.offset).toBe(-10);
      expect(defaults.timeout).toBe(4000);
    });
  });

  describe('ESLIncrementalScroll.to', () => {
    beforeEach(() => {
      MockedScroller.mockClear();
    });

    test('should return a Promise', () => {
      const result = ESLIncrementalScroll.to(null);
      expect(result).toBeInstanceOf(Promise);
    });

    test('should create Scroller with merged options', () => {
      const el = document.createElement('div');
      const options = {offset: 10, timeout: 2000};

      ESLIncrementalScroll.to(el, options);

      expect(MockedScroller).toHaveBeenCalledWith(el, expect.objectContaining({
        offset: 10,
        timeout: 2000,
        stabilityThreshold: 500
      }));
    });

    test('should use default options when none provided', () => {
      ESLIncrementalScroll.to(null);

      expect(MockedScroller).toHaveBeenCalledWith(null, expect.objectContaining({
        offset: 0,
        stabilityThreshold: 500,
        timeout: 4000
      }));
    });

    test('should override alignment when provided', () => {
      const xAlign = vi.fn();
      const yAlign = vi.fn();
      const options = {alignment: {x: xAlign, y: yAlign}};

      ESLIncrementalScroll.to(null, options);

      const [, mergedOptions] = MockedScroller.mock.calls[0];
      expect(mergedOptions.alignment?.x).toBe(xAlign);
      expect(mergedOptions.alignment?.y).toBe(yAlign);
    });

    test('should override both alignment strategies when one is not provided', () => {
      const xAlign = vi.fn();
      const options = {alignment: {x: xAlign}};

      ESLIncrementalScroll.to(null, options);

      const [, mergedOptions] = MockedScroller.mock.calls[0];
      expect(mergedOptions.alignment?.x).toBe(xAlign);
      expect(mergedOptions.alignment?.y).toBeUndefined();
    });

    test('should accept AbortSignal in options', () => {
      const controller = new AbortController();
      const options = {signal: controller.signal};

      ESLIncrementalScroll.to(null, options);

      const [, mergedOptions] = MockedScroller.mock.calls[0];
      expect(mergedOptions.signal).toBe(controller.signal);
    });
  });
});
