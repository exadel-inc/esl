import {ESLIncrementalScrollAxisStepper} from '../core/incremental-scroll-axis-stepper';
import type {ESLIncrementalScrollOptions} from '../core/incremental-scroll-types';

afterEach(() => vi.restoreAllMocks());

const createOptions = (overrides: Partial<ESLIncrementalScrollOptions> = {}): ESLIncrementalScrollOptions => ({
  stabilityThreshold: 200,
  timeout: 500,
  ...overrides
});

const mockNowSequence = (values: number[]): void => {
  let index = 0;
  vi.spyOn(Date, 'now').mockImplementation(() => {
    const next = index < values.length ? values[index] : values[values.length - 1];
    index += 1;
    return next;
  });
};

describe('ESLIncrementalScrollAxisStepper', () => {
  describe('computeStep', () => {
    test('returns zero for near target distance and updates start time', () => {
      mockNowSequence([0, 120]);
      const calc = vi.fn().mockReturnValue(1);
      const stepper = new ESLIncrementalScrollAxisStepper(calc, createOptions());

      expect(stepper.computeStep({})).toBe(0);
      expect((stepper as unknown as {startTime: number}).startTime).toBe(120);
    });

    test('increments grow gradually for large distances', () => {
      mockNowSequence([0, 10, 20, 30]);
      const calc = vi.fn().mockReturnValue(500);
      const stepper = new ESLIncrementalScrollAxisStepper(calc, createOptions());

      expect(stepper.computeStep({})).toBe(1);
      expect(stepper.computeStep({})).toBe(2);
      expect(stepper.computeStep({})).toBe(4);
      expect((stepper as unknown as {maxStepIncrement: number}).maxStepIncrement).toBe(8);
    });

    test('preserves direction sign for negative distance', () => {
      mockNowSequence([0, 50]);
      const calc = vi.fn().mockReturnValue(-250);
      const stepper = new ESLIncrementalScrollAxisStepper(calc, createOptions());

      expect(stepper.computeStep({})).toBe(-1);
    });
  });

  describe('shouldContinueStepping', () => {
    test('remains true right after an unstable step', () => {
      mockNowSequence([0, 100]);
      const calc = vi.fn().mockReturnValue(300);
      const stepper = new ESLIncrementalScrollAxisStepper(calc, createOptions());

      stepper.computeStep({});

      expect(stepper.shouldContinueStepping()).toBe(true);
    });

    test('stops when stability threshold is exceeded', () => {
      mockNowSequence([0, 100, 400]);
      const calc = vi.fn()
        .mockReturnValueOnce(300)
        .mockReturnValueOnce(0);
      const stepper = new ESLIncrementalScrollAxisStepper(calc, createOptions());

      stepper.computeStep({});
      stepper.computeStep({});

      expect(stepper.shouldContinueStepping()).toBe(false);
    });

    test('stops when timeout limit is reached', () => {
      mockNowSequence([0, 300]);
      const calc = vi.fn().mockReturnValue(300);
      const stepper = new ESLIncrementalScrollAxisStepper(calc, createOptions({timeout: 200, stabilityThreshold: 600}));

      stepper.computeStep({});

      expect(stepper.shouldContinueStepping()).toBe(false);
    });
  });
});
