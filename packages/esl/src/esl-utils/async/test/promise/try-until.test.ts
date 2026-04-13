import {tryUntil} from '../../promise/try-until';

describe('async/promise/try-until', () => {
  beforeAll(() =>  vi.useFakeTimers());
  afterAll(() => vi.useRealTimers());

  test.each([
    [(): any => undefined],
    [(): any => {throw new Error();}]
  ])('successful ( %s )', (testFn) => {
    const observedFn = vi.fn(testFn);
    const successFn = vi.fn();
    const promise$ = tryUntil(observedFn, 3, 100);
    promise$.then(successFn);

    expect(observedFn).toHaveBeenCalled();
    expect(successFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(110);

    expect(observedFn).toHaveBeenCalledTimes(2);
    expect(successFn).not.toHaveBeenCalled();

    observedFn.mockReturnValue(true);
    vi.advanceTimersByTime(110);

    return expect(promise$).resolves.toBe(true);
  });

  test('failed (() => false)', () => {
    const promise$ = tryUntil(() => false, 3, 100);
    vi.advanceTimersByTime(500);
    return expect(promise$).rejects.toBeTruthy();
  });
});
