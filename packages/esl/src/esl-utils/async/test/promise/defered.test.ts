import {createDeferred} from '../../promise/defered';
import {promisifyTimeout} from '../../promise/timeout';

describe('async/promise/deferred', () => {
  test('Resolve of Deferred produces resolved promise', () => {
    const def$$ = createDeferred();
    def$$.resolve(1);
    return def$$.promise.then((n) => expect(n).toBe(1));
  });

  test('Rejected Deferred produces rejected promise', () => {
    const def$$ = createDeferred();
    def$$.reject(1);
    return def$$.promise.catch((n) => expect(n).toBe(1));
  });

  test('Deferred resolves initially requested promise when resolved', () => {
    const def$$ = createDeferred();
    def$$.promise;
    def$$.resolve(1);
    return def$$.promise.then((n) => expect(n).toBe(1));
  });

  test('Deferred rejects initially requested promise when rejected', () => {
    const def$$ = createDeferred();
    def$$.promise;
    def$$.reject(1);
    return def$$.promise.catch((n) => expect(n).toBe(1));
  });

  describe('Rejected Deferred doesn`t lead to uncaught in promise', () => {
    const throwFn = vi.fn((reason) => {throw reason;});

    beforeAll(() => {
      process.env.LISTENING_TO_UNHANDLED_REJECTION = String(true);
      process.on('unhandledRejection', throwFn);
    });

    afterAll(() => {
      process.off('unhandledRejection', throwFn);
    });

    test('Deferred doesn`t lead to uncaught', async () => {
      const def$$ = createDeferred();
      def$$.reject(1);
      await promisifyTimeout(0);
      expect(throwFn).not.toHaveBeenCalled();
    });
  });

  describe('Resolved/rejected Deferred is finalized', () => {
    test('Resolved Deferred can not be re-resolved', async () => {
      const def$$ = createDeferred();
      def$$.resolve(1);
      def$$.resolve(2);
      await expect(def$$.promise).resolves.toBe(1);
    });
    test('Resolved Deferred can not be rejected', async () => {
      const def$$ = createDeferred();
      def$$.resolve(1);
      def$$.reject();
      await expect(def$$.promise).resolves.toBe(1);
    });
    test('Rejected Deferred can not be re-resolved', async () => {
      const def$$ = createDeferred();
      def$$.reject(1);
      def$$.reject(2);
      await expect(def$$.promise).rejects.toBe(1);
    });
    test('Rejected Deferred can not be rejected', async () => {
      const def$$ = createDeferred();
      def$$.reject(1);
      def$$.resolve(2);
      await expect(def$$.promise).rejects.toBe(1);
    });
  });
});
