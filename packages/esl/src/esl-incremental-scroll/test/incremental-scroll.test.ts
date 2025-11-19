import {
  getESLIncrementalScrollDefaults,
  setESLIncrementalScrollDefaults,
  ESLIncrementalScrollTo} from '../core/incremental-scroll';
import {ESLIncrementalScrollScroller} from '../core/incremental-scroll-scroller';

jest.mock('../core/incremental-scroll-scroller');
const MockedScroller = ESLIncrementalScrollScroller as jest.MockedClass<typeof ESLIncrementalScrollScroller>;

describe('IncrementalScroll defaults', () => {
  const originalDefaults = getESLIncrementalScrollDefaults();

  afterEach(() => {
    setESLIncrementalScrollDefaults(originalDefaults);
  });

  test('should return default options', () => {
    const defaults = getESLIncrementalScrollDefaults();
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
    setESLIncrementalScrollDefaults({
      offset: 10,
      timeout: 2000
    });

    const defaults = getESLIncrementalScrollDefaults();

    expect(defaults.offset).toBe(10);
    expect(defaults.timeout).toBe(2000);
    expect(defaults.stabilityThreshold).toBe(500);
  });

  test('should preserve existing values when setting partial overrides', () => {
    setESLIncrementalScrollDefaults({stabilityThreshold: 300});

    const defaults = getESLIncrementalScrollDefaults();

    expect(defaults.stabilityThreshold).toBe(300);
    expect(defaults.offset).toBe(0);
    expect(defaults.timeout).toBe(4000);
  });

  test('should ignore undefined values', () => {
    setESLIncrementalScrollDefaults({offset: -10, timeout: undefined});

    const defaults = getESLIncrementalScrollDefaults();

    expect(defaults.offset).toBe(-10);
    expect(defaults.timeout).toBe(4000);
  });
});

describe('incrementalScrollTo', () => {
  beforeEach(() => {
    MockedScroller.mockClear();
  });

  test('should return a Promise', () => {
    const result = ESLIncrementalScrollTo(null);
    expect(result).toBeInstanceOf(Promise);
  });

  test('should create Scroller with merged options', () => {
    const el = document.createElement('div');
    const options = {offset: 10, timeout: 2000};

    ESLIncrementalScrollTo(el, options);

    expect(MockedScroller).toHaveBeenCalledWith(el, expect.objectContaining({
      offset: 10,
      timeout: 2000,
      stabilityThreshold: 500
    }));
  });

  test('should use default options when none provided', () => {
    ESLIncrementalScrollTo(null);

    expect(MockedScroller).toHaveBeenCalledWith(null, expect.objectContaining({
      offset: 0,
      stabilityThreshold: 500,
      timeout: 4000
    }));
  });

  test('should override alignment when provided', () => {
    const xAlign = jest.fn();
    const yAlign = jest.fn();
    const options = {alignment: {x: xAlign, y: yAlign}};

    ESLIncrementalScrollTo(null, options);

    const [, mergedOptions] = MockedScroller.mock.calls[0];
    expect(mergedOptions.alignment?.x).toBe(xAlign);
    expect(mergedOptions.alignment?.y).toBe(yAlign);
  });

  test('should override both alignment strategies when one is not provided', () => {
    const xAlign = jest.fn();
    const options = {alignment: {x: xAlign}};

    ESLIncrementalScrollTo(null, options);

    const [, mergedOptions] = MockedScroller.mock.calls[0];
    expect(mergedOptions.alignment?.x).toBe(xAlign);
    expect(mergedOptions.alignment?.y).toBeUndefined();
  });

  test('should accept AbortSignal in options', () => {
    const controller = new AbortController();
    const options = {signal: controller.signal};

    ESLIncrementalScrollTo(null, options);

    const [, mergedOptions] = MockedScroller.mock.calls[0];
    expect(mergedOptions.signal).toBe(controller.signal);
  });
});
