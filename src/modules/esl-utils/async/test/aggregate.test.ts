import {aggregate} from '../aggregate';

describe('async/aggregate', () => {
  test('single call', (done) => {
    const fn = jest.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      expect(fn).lastCalledWith([1]);

      agFn(2);
      setTimeout(() => {
        expect(fn).toBeCalledTimes(2);
        expect(fn).lastCalledWith([2]);

        done();
      }, 40);
    }, 40);
  }, 200);
  test('multiple calls', (done) => {
    const fn = jest.fn();
    const agFn = aggregate(fn, 10);

    agFn(1);
    agFn(2);

    setTimeout(() => agFn(3));
    setTimeout(() => agFn(4), 5);

    expect(fn).toBeCalledTimes(0);

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      expect(fn).lastCalledWith([1, 2, 3, 4]);
      done();
    }, 100);
  }, 200);
});
