import {createDeferred} from '../../promise/defered';

describe('async/promise/deferred', () => {
  test('Should not reject promise if it wasn`t requested', async () => {
    const deferred = createDeferred();
    const value = 'test-error';

    deferred.reject(value);

    await Promise.resolve();
    expect.assertions(0);
  });

  test('Should reject promise if it was requested', async () => {
    const deferred = createDeferred();
    const value = 'test-error';

    deferred.reject(value);
    expect.assertions(1);

    try {
      await deferred.promise;
    } catch (error) {
      expect(error).toEqual(value);
    }
  });

  test('Deferred resolves promise when it`s resolved and promise', () => {
    const def$$ = createDeferred();
    const value = 'test-success';
    def$$.resolve(value);
    expect(def$$.promise).resolves.toBe(value);
  });

  test('Deferred rejected promise when it`s rejected and promise', () => {
    const def$$ = createDeferred();
    const value = 'test-error';
    def$$.reject(value);
    expect(def$$.promise).rejects.toBe(value);
  });
});
