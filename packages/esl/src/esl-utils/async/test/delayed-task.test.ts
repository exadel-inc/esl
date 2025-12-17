import {DelayedTask} from '../delayed-task';

describe('async/delayed-task', () => {
  test('basic intimidate run', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const task = new DelayedTask();

    task.put(fn1);
    expect(fn1).toHaveBeenCalledTimes(1);
    task.put(fn2, -1);
    expect(fn2).toHaveBeenCalledTimes(1);
    task.put(fn2);
    expect(fn2).toHaveBeenCalledTimes(2);
    task.put(fn1);
    expect(fn1).toHaveBeenCalledTimes(2);
    expect(fn2).toHaveBeenCalledTimes(2);
  });

  test('simple microtask', async () => {
    const fn1 = vi.fn();

    const task = new DelayedTask();

    task.put(fn1, 0);
    task.put(fn1, 0);
    expect(fn1).toHaveBeenCalledTimes(0);
    
    await new Promise<void>(resolve => {
      setTimeout(() => {
        expect(fn1).toHaveBeenCalledTimes(1);
        resolve();
      }, 10);
    });
  });

  /*

      test('$$fire - bubbling', () => new Promise<void>(resolve => {
      document.addEventListener('testevent', (e) => {
        expect(e).toBeInstanceOf(CustomEvent);
        resolve();
      }, {once: true});
      el.$$fire('testevent');
    }));

  */

  test('simple eviction', async () => {
    const fn1 = vi.fn();

    const task = new DelayedTask();

    task.put(fn1, 0);
    task.put(fn1);
    expect(fn1).toHaveBeenCalledTimes(1);
    
    await new Promise<void>(resolve => {
      setTimeout(() => {
        expect(fn1).toHaveBeenCalledTimes(1);
        resolve();
      }, 10);
    });
  });

  test('delayed task', async () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();

    const task = new DelayedTask();

    task.put(fn2, 50);
    task.put(fn1, 40);
    expect(fn1).toHaveBeenCalledTimes(0);
    expect(fn2).toHaveBeenCalledTimes(0);

    await new Promise<void>(resolve => {
      setTimeout(() => {
        task.put(fn2, 20);
        expect(fn1).toHaveBeenCalledTimes(0);
        expect(fn2).toHaveBeenCalledTimes(0);

        setTimeout(() => {
          expect(fn1).toHaveBeenCalledTimes(0);
          expect(fn2).toHaveBeenCalledTimes(1);
          task.put(fn1, false);
          expect(fn1).toHaveBeenCalledTimes(1);
          expect(fn2).toHaveBeenCalledTimes(1);
          resolve();
        }, 30);
      }, 10);
    });
  });


  test('cancel / fn', async () => {
    const fn1 = vi.fn();

    const task = new DelayedTask();

    task.put(fn1, 0);
    expect(task.fn).toBe(fn1);
    task.cancel();
    expect(fn1).toHaveBeenCalledTimes(0);
    
    await new Promise<void>(resolve => {
      setTimeout(() => {
        expect(fn1).toHaveBeenCalledTimes(0);
        resolve();
      }, 10);
    });
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
