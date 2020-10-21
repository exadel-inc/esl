import {debounce} from '../debounce';

describe('async/debounce tests', () => {
  test('basic test', (done) => {
    let log = 0;
    const increment = () => log++;

    const debounced = debounce(increment, 20);

    expect(typeof debounced).toBe('function');
    expect(debounced.then).toBeDefined();

    expect(log).toBe(0);
    debounced();
    debounced();
    setTimeout(() => debounced());
    expect(log).toBe(0);

    setTimeout(() => {
      expect(log).toBe(1);
      done();
    }, 100);
  }, 200);

  // TODO: more tests
});
