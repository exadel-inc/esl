import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * Single place, evicted, task planner
 */
export class TaskPlanner {
  protected _fn: AnyToVoidFnSignature | null;
  protected _timeout: number | null;

  /** Execute planned task immediately */
  protected exec = () => {
    this._timeout = null;
    this._fn && this._fn();
  };

  /** Currently planned task function */
  public get top() {
    return this._fn;
  }

  /**
   * Clear execution plan and planning passed {@param task}
   * @param delay - time to delay task execution
   *  - pass negative or false to execute task immediately
   *  - pass 0 to plan task to the macrotask
   *  - pass positive number x to delay task on x ms.
   * */
  public push(task: AnyToVoidFnSignature, delay: number | boolean = false) {
    if (typeof task !== 'function') return false;
    this.clear();
    if (typeof delay === 'number' && delay >= 0) {
      this._fn = task;
      this._timeout = window.setTimeout(this.exec, delay);
    } else {
      task();
    }
    return true;
  }

  /** Clear execution plan if it is not empty */
  public clear() {
    this._fn = null;
    (typeof this._timeout === 'number') && clearTimeout(this._timeout);
    this._timeout = null;
  }
}
