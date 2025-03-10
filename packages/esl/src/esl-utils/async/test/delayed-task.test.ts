import {DelayedTask} from '../delayed-task';

describe('async/delayed-task', () => {
  test('basic intimidate run', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const task = new DelayedTask();

    task.put(fn1);
    expect(fn1).toBeCalledTimes(1);
    task.put(fn2, -1);
    expect(fn2).toBeCalledTimes(1);
    task.put(fn2);
    expect(fn2).toBeCalledTimes(2);
    task.put(fn1);
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
  });

  test('simple microtask', (done) => {
    const fn1 = jest.fn();

    const task = new DelayedTask();

    task.put(fn1, 0);
    task.put(fn1, 0);
    expect(fn1).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn1).toBeCalledTimes(1);
      done();
    }, 10);
  });

  test('simple eviction', (done) => {
    const fn1 = jest.fn();

    const task = new DelayedTask();

    task.put(fn1, 0);
    task.put(fn1);
    expect(fn1).toBeCalledTimes(1);
    setTimeout(() => {
      expect(fn1).toBeCalledTimes(1);
      done();
    }, 10);
  });

  test('delayed task', (done) => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const task = new DelayedTask();

    task.put(fn2, 50);
    task.put(fn1, 40);
    expect(fn1).toBeCalledTimes(0);
    expect(fn2).toBeCalledTimes(0);

    setTimeout(() => {
      task.put(fn2, 20);
      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(0);

      setTimeout(() => {
        expect(fn1).toBeCalledTimes(0);
        expect(fn2).toBeCalledTimes(1);
        task.put(fn1, false);
        expect(fn1).toBeCalledTimes(1);
        expect(fn2).toBeCalledTimes(1);
        done();
      }, 30);
    }, 10);
  });


  test('cancel / fn', (done) => {
    const fn1 = jest.fn();

    const task = new DelayedTask();

    task.put(fn1, 0);
    expect(task.fn).toBe(fn1);
    task.cancel();
    expect(fn1).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn1).toBeCalledTimes(0);
      done();
    }, 10);
  });

  test('put/cancel return value', () => {
    const fn1 = function () {};
    const fn2 = function () {};
    const task = new DelayedTask();

    expect(task.put(fn1, 0)).toBeNull();
    expect(task.put(fn2, 0)).toBe(fn1);
    expect(typeof task.fn).toBe('function');
    expect(task.put(fn1, 0)).toBe(fn2);
    expect(task.cancel()).toBe(fn1);
    expect(task.fn).toBeNull();
  });
});
