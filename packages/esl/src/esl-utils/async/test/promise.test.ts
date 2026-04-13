import {
  rejectPromise,
  resolvePromise,
  repeatSequence,
} from '../promise';

describe('async/promise', () => {
  beforeAll(() =>  vi.useFakeTimers());
  afterAll(() => vi.useRealTimers());

  describe('promise chain', () => {
    test('resolve', () => {
      const payload = Symbol();
      return expect(Promise.reject(payload).catch(resolvePromise)).resolves.toBe(payload);
    });
    test('reject', () => {
      const payload = Symbol();
      return expect(Promise.resolve(payload).then(rejectPromise)).rejects.toBe(payload);
    });
  });

  describe('repeatSequence', () => {
    test('basic scenario', async () => {
      let times = 0;
      const f = async () => ++times;

      const result$ = repeatSequence(f, 4);
      // Initial call side-effects
      expect(times).toBe(0);
      // Result validation
      const res = await result$;
      expect(res).toBe(4);
      expect(times).toBe(4);
    });

    test('failed chain', () => {
      let times = 0;
      const err = new Error('test');
      const f = async () => {
        if (++times > 2) throw err;
      };

      return repeatSequence(f, 4).then(
        () => expect(1).toBe(0),
        (e) => {
          expect(e).toBe(err);
          expect(times).toBe(3);
        }
      );
    });
  });
});
