import {createDeferred} from '../../promise/defered';

describe('async/promise/deferred', () => {
  test('Deferred resolves promise when it is resolved', () => {
    const def$$ = createDeferred();
    def$$.resolve(1);
    return def$$.promise.then((n) => expect(n).toBe(1));
  });
  test('Deferred rejects promise when it is rejected', () => {
    const def$$ = createDeferred();
    def$$.reject(1);
    return def$$.promise.catch((n) => expect(n).toBe(1));
  });
});
