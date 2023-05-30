import {microtask} from '../microtask';

describe('sync/microtask', () => {
  test('Decorated as microtask callback call does not lead to original function immediate execution', () => {
    const fn = jest.fn();
    const decorated = microtask(fn);
    for (let i = 0; i < 5; i++) decorated();
    expect(fn).toBeCalledTimes(0);
  });
  test('Decorated as microtask callback called once the macrotask done', async () => {
    const fn = jest.fn();
    const decorated = microtask(fn);
    for (let i = 0; i < 5; i++) decorated();
    await Promise.resolve();
    expect(fn).toBeCalledTimes(1);
  });
  test('Decorated as microtask callback receives a list of call arguments', async () => {
    const fn = jest.fn();
    const decorated = microtask(fn);
    const params = [Symbol('Arg 1'), Symbol('Arg 2'), Symbol('Arg 3')];

    for (const param of params) decorated(param);
    await Promise.resolve();
    expect(fn).toBeCalledWith(expect.arrayContaining(params));
  });
});
