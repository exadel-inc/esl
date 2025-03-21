import {SyntheticEventTarget} from '../../../esl-utils/dom/events/target';

import {ESLEventListener} from '../listener';
import {isObject} from '../../../esl-utils/misc/object/types';

type ESLListenerDecorator<Args extends any[]> = (target: EventListener, ...args: Args) => EventListener;

const cache = memoizeOne((target: EventTarget) => {
  return memoizeOne(<Args extends any[]>(decorator: ESLListenerDecorator<Args>) => {
    return memoizeOne((...args: any[]) => {
      return ESLDecoratedEventTarget.create(target, decorator, ...args);
    }, Map);
  }, WeakMap);
}, WeakMap);

/**
 * {@link EventTarget} proxy that decorates original target listening
 */
export class ESLDecoratedEventTarget<Args extends any[]> extends SyntheticEventTarget {
  public static for<Args extends any[]>(
    target: EventTarget,
    decorator: ESLListenerDecorator<Args>,
    ...args: Args
  ): ESLDecoratedEventTarget<Args> {
    if (args.length > 1 || isObject(args[0])) {
      console.debug('[ESL]: Can\'t cache multi-argument decoration or decoration with object param');
      return this.create(target, decorator, ...args);
    }
    return cache(target)(decorator).call(null, ...args);
  }

  public static create<Args extends any[]>(
    target: EventTarget,
    decorator: ESLListenerDecorator<Args>,
    ...args: Args
  ): ESLDecoratedEventTarget<Args> {
    return new this(target, decorator, args);
  }

  protected constructor(
    public readonly target: EventTarget,
    public readonly decorator: (target: EventListener, ...args: Args) => EventListener,
    public readonly params: Args
  ) {
    super();
  }

  /** Subscribes to the instance active rule change */
  public override addEventListener(callback: EventListener): void;
  public override addEventListener(event: string, callback: EventListener): void;
  public override addEventListener(event: any, callback: EventListener = event): void {
    super.addEventListener(event, callback);

    if (this.getEventListeners(event).length > 1) return;
    const {target} = this;
    ESLEventListener.subscribe(this, this.createHandler(), {event, target});
  }

  /** Unsubscribes from the instance active rule change */
  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(event: string, callback: EventListener): void;
  public override removeEventListener(event: any, callback: EventListener = event): void {
    super.removeEventListener(event, callback);

    if (!this.hasEventListener(event)) ESLEventListener.unsubscribe(this);
  }

  /** @returns decorated handler */
  protected createHandler(): EventListener {
    return this.decorator(this.dispatchEvent.bind(this), ...this.params);
  }
}

// TODO: temporary before memoize update in bounds of 5th release
export function memoizeOne<
  C extends typeof Map | typeof WeakMap,
  T extends typeof WeakMap extends C ? object : any,
  R
>(fn: (arg: T) => R, Cache: C): (arg: T) => R {
  function memo(arg: T): any {
    if (!memo.cache.has(arg)) memo.cache.set(arg, fn.call(this, arg));
    return memo.cache.get(arg);
  }
  memo.cache = new (Cache as any)() as InstanceType<C>;
  return memo;
}
