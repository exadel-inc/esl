import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * Task planner with a single place evicting query.
 */
export class TaskPlanner {
  protected _fn: AnyToVoidFnSignature | null;
  protected _timeout: number | null;

  /** Execute deferred task immediately */
  protected run = () => {
    this._timeout = null;
    this._fn && this._fn();
  };

  /** @return {Function} of currently deferred (planned) task*/
  public get task() {
    return this._fn;
  }

  /**
   * Cancel deferred task and planning passed {@param task}
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
      this._timeout = window.setTimeout(this.run, delay);
    } else {
      task();
    }
    return true;
  }

  /** Cancel deferred (planned) task */
  public clear() {
    this._fn = null;
    (typeof this._timeout === 'number') && clearTimeout(this._timeout);
    this._timeout = null;
  }
}
