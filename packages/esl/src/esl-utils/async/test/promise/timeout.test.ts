import {promisifyTimeout} from '../../promise/timeout';

describe('async/promise/timeout', () => {
  beforeAll(() =>  vi.useFakeTimers());
  afterAll(() => vi.useRealTimers());

  test('promisifyTimeout resolves without payload', () => {
    const promise$ = promisifyTimeout(100);
    vi.advanceTimersByTime(100);
    return expect(promise$).resolves.toBeUndefined();
  });
  test('promisifyTimeout resolves', () => {
    const promise$ = promisifyTimeout(100, true);
    vi.advanceTimersByTime(100);
    return expect(promise$).resolves.toBe(true);
  });
  test('promisifyTimeout rejects', () => {
    const promise$ = promisifyTimeout(100, false, true);
    vi.advanceTimersByTime(100);
    return expect(promise$).rejects.toBe(false);
  });
  test('promisifyTimeout handles timeout correctly', () => {
    const resCb = vi.fn();
    const rejCb = vi.fn();

    const promise$ = promisifyTimeout(100, true);
    promise$.then(resCb, rejCb);

    vi.advanceTimersByTime(50);
    expect(resCb).not.toHaveBeenCalled();
    expect(rejCb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
  });
});
