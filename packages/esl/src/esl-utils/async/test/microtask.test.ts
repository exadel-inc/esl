import {microtask} from '../microtask';

describe('sync/microtask', () => {
  test('Decorated as microtask callback call does not lead to original function immediate execution', () => {
    const fn = vi.fn();
    const decorated = microtask(fn);
    for (let i = 0; i < 5; i++) decorated();
    expect(fn).toHaveBeenCalledTimes(0);
  });
  test('Decorated as microtask callback called once the macrotask done', async () => {
    const fn = vi.fn();
    const decorated = microtask(fn);
    for (let i = 0; i < 5; i++) decorated();
    await Promise.resolve();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  test('Decorated as microtask callback receives a list of call arguments', async () => {
    const fn = vi.fn();
    const decorated = microtask(fn);
    const params = [Symbol('Arg 1'), Symbol('Arg 2'), Symbol('Arg 3')];

    for (const param of params) decorated(param);
    await Promise.resolve();
    expect(fn).toHaveBeenCalledWith(expect.arrayContaining(params));
  });
  test('Decorated as microtask callback refreshes after decorated method call (leak protected)', async () => {
    const fn = vi.fn();
    const decorated = microtask(fn);
    const params1 = [Symbol('Arg 1'), Symbol('Arg 2')];
    for (const param of params1) decorated(param);
    await Promise.resolve();

    const params2 = [Symbol('Arg 3'), Symbol('Arg 4')];
    for (const param of params2) decorated(param);
    await Promise.resolve();
    expect(fn).toHaveBeenLastCalledWith(params2);
  });
});
