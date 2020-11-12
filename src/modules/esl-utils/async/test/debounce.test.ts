import {debounce} from '../debounce';

describe('async/debounce tests', () => {
  test('basic test', (done) => {
    const fn = jest.fn();
    const debounced = debounce(fn, 20);

    expect(typeof debounced).toBe('function');
    expect(debounced.then).toBeDefined();

    expect(fn).toBeCalledTimes(0);
    debounced();
    debounced();
    setTimeout(() => debounced());
    expect(fn).toBeCalledTimes(0);

    setTimeout(() => {
      expect(fn).toBeCalledTimes(1);
      done();
    }, 100);
  }, 200);

  // TODO: more tests
});
