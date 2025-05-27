import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * Task placeholder with a single place for executing deferred task.
 * Only one task can be planed per DelayedTask instance.
 * @see put DelayedTask.put behavior description.
 */
export class DelayedTask {
  protected _fn: AnyToVoidFnSignature | null = null;
  protected _timeout: number | null = null;

  /** Execute deferred task immediately */
  protected run = (): void => {
    this._timeout = null;
    this._fn && this._fn();
  };

  /** @returns Function of currently deferred (planned) task */
  public get fn(): AnyToVoidFnSignature | null {
    return this._fn;
  }

  /**
   * Cancel deferred task and planning passed
   * @param task - task function
   * @param delay - time to delay task execution
   *  - pass negative or false to execute task immediately
   *  - pass 0 to plan task to the macrotask
   *  - pass positive number x to delay task on x ms.
   * */
  public put(task: AnyToVoidFnSignature, delay: number | string | boolean = false): AnyToVoidFnSignature | null {
    const prev = this.cancel();
    if (typeof task === 'function') {
      if (delay && typeof delay === 'string') delay = +delay;
      if (typeof delay === 'number' && delay >= 0) {
        this._fn = task;
        this._timeout = window.setTimeout(this.run, delay);
      } else {
        task();
      }
    }
    return prev;
  }

  /** Cancel deferred (planned) task */
  public cancel(): AnyToVoidFnSignature | null {
    const prev = this._fn;
    (typeof this._timeout === 'number') && clearTimeout(this._timeout);
    this._fn = this._timeout = null;
    return prev;
  }
}
