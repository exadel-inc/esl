import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';

import {ESLEventListener} from '../listener';

export type ESLEventListenerDecorator = (target: EventListener, timeout?: number) => EventListener;

const cache = memoizeOne((target: EventTarget) => {
  return memoizeOne((decorator: ESLEventListenerDecorator) => {
    return memoizeOne((timeout?: number) => {
      return new ESLEventTargetDecorator(target, decorator, timeout);
    }, Map);
  }, WeakMap);
}, WeakMap);

/**
 * {@link EventTarget} proxy that decorates original target listening
 */
export class ESLEventTargetDecorator extends SyntheticEventTarget {
  public static create(target: EventTarget, decorator: ESLEventListenerDecorator, timeout: number = 250): ESLEventTargetDecorator {
    return cache(target)(decorator)(timeout);
  }

  constructor(
    public readonly target: EventTarget,
    public readonly decorator: ESLEventListenerDecorator,
    public readonly timeout?: number
  ) {
    super();
  }

  /** Subscribes to the instance active rule change */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: string, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (!this.hasEventListener(event, 1)) {
      const {target} = this;
      ESLEventListener.subscribe(this, this.onResizeDebounced, {event, target});
    }
  }

  /** Unsubscribes from the instance active rule change */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: string, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);

    if (!this.hasEventListener(event)) {
      ESLEventListener.get(this, event).forEach((listener: ESLEventListener) => listener.unsubscribe());
    }
  }

  /** @returns debounced handler */
  protected get onResizeDebounced(): EventListener {
    return this.decorator(this.dispatchEvent.bind(this), this.timeout);
  }
}

// TODO: temporary before memoize update in bounds of 5th release
export function memoizeOne<C extends (typeof Map | typeof WeakMap), T extends ((typeof WeakMap) extends C ? object : any), R>(
  fn: (arg: T) => R,
  Cache: C
): (arg: T) => R {
  function memo(arg: T): any {
    if (!memo.cache.has(arg)) memo.cache.set(arg, fn.call(this, arg));
    return memo.cache.get(arg);
  }
  memo.cache = new (Cache as any)() as InstanceType<C>;
  return memo;
}
