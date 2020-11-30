import {TaskPlanner} from '../task-planner';

describe('async/task-planner', () => {
  test('basic intimidate run', () => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const planner = new TaskPlanner();

    planner.push(fn1);
    expect(fn1).toBeCalledTimes(1);
    planner.push(fn2, -1);
    expect(fn2).toBeCalledTimes(1);
    planner.push(fn2);
    expect(fn2).toBeCalledTimes(2);
    planner.push(fn1)
    expect(fn1).toBeCalledTimes(2);
    expect(fn2).toBeCalledTimes(2);
  });

  test('simple microtask', (done) => {
    const fn1 = jest.fn();

    const planner = new TaskPlanner();

    planner.push(fn1, 0);
    planner.push(fn1, 0);
    expect(fn1).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn1).toBeCalledTimes(1);
      done();
    }, 10);
  });

  test('simple eviction', (done) => {
    const fn1 = jest.fn();

    const planner = new TaskPlanner();

    planner.push(fn1, 0);
    planner.push(fn1);
    expect(fn1).toBeCalledTimes(1);
    setTimeout(() => {
      expect(fn1).toBeCalledTimes(1);
      done();
    }, 10);
  });

  test('delayed task', (done) => {
    const fn1 = jest.fn();
    const fn2 = jest.fn();

    const planner = new TaskPlanner();

    planner.push(fn2, 50);
    planner.push(fn1, 40);
    expect(fn1).toBeCalledTimes(0);
    expect(fn2).toBeCalledTimes(0);

    setTimeout(() => {
      planner.push(fn2, 20);
      expect(fn1).toBeCalledTimes(0);
      expect(fn2).toBeCalledTimes(0);

      setTimeout(() => {
        expect(fn1).toBeCalledTimes(0);
        expect(fn2).toBeCalledTimes(1);
        planner.push(fn1, false);
        expect(fn1).toBeCalledTimes(1);
        expect(fn2).toBeCalledTimes(1);
        done();
      }, 30);
    }, 10);
  });


  test('cancel/top', (done) => {
    const fn1 = jest.fn();

    const planner = new TaskPlanner();

    planner.push(fn1, 0);
    expect(planner.task).toBe(fn1);
    planner.clear();
    expect(fn1).toBeCalledTimes(0);
    setTimeout(() => {
      expect(fn1).toBeCalledTimes(0);
      done();
    }, 10);
  });

  test('test ', () => {
    const planner = new TaskPlanner();

    expect(planner.push(function () {}, 0)).toBeTruthy();
    expect(planner.push('something' as any)).toBeFalsy();
    expect(typeof planner.task).toBe('function')
  });
});
