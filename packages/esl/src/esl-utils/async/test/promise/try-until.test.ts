import {tryUntil} from '../../promise/try-until';

describe('async/promise/try-until', () => {
  beforeAll(() =>  jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test.each([
    [(): any => undefined],
    [(): any => {throw new Error();}]
  ])('successful ( %s )', (testFn) => {
    const observedFn = jest.fn(testFn);
    const successFn = jest.fn();
    const promise$ = tryUntil(observedFn, 3, 100);
    promise$.then(successFn);

    expect(observedFn).toHaveBeenCalled();
    expect(successFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(110);

    expect(observedFn).toHaveBeenCalledTimes(2);
    expect(successFn).not.toHaveBeenCalled();

    observedFn.mockReturnValue(true);
    jest.advanceTimersByTime(110);

    return expect(promise$).resolves.toBe(true);
  });

  test('failed (() => false)', () => {
    const promise$ = tryUntil(() => false, 3, 100);
    jest.advanceTimersByTime(500);
    return expect(promise$).rejects.toBeTruthy();
  });
});
