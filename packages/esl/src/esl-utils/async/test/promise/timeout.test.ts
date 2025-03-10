import {promisifyTimeout} from '../../promise/timeout';

describe('async/promise/timeout', () => {
  beforeAll(() =>  jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('promisifyTimeout resolves without payload', () => {
    const promise$ = promisifyTimeout(100);
    jest.advanceTimersByTime(100);
    return expect(promise$).resolves.toBeUndefined();
  });
  test('promisifyTimeout resolves', () => {
    const promise$ = promisifyTimeout(100, true);
    jest.advanceTimersByTime(100);
    return expect(promise$).resolves.toBe(true);
  });
  test('promisifyTimeout rejects', () => {
    const promise$ = promisifyTimeout(100, false, true);
    jest.advanceTimersByTime(100);
    return expect(promise$).rejects.toBe(false);
  });
  test('promisifyTimeout handles timeout correctly', () => {
    const resCb = jest.fn();
    const rejCb = jest.fn();

    const promise$ = promisifyTimeout(100, true);
    promise$.then(resCb, rejCb);

    jest.advanceTimersByTime(50);
    expect(resCb).not.toBeCalled();
    expect(rejCb).not.toBeCalled();
    jest.advanceTimersByTime(100);
  });
});
