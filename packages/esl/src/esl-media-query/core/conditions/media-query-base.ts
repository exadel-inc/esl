export interface IMediaQueryCondition extends EventTarget {
  /** @returns true if current environment satisfies query */
  readonly matches: boolean;

  /** Subscribes to media query state change. Shortcut for `addEventListener('change', callback)` */
  addEventListener(callback: EventListener): void;
  /** Subscribes to media query state change. Implements {@link EventTarget} interface */
  addEventListener(type: 'change', callback: EventListener): void;

  /** Unsubscribes from media query state change event. Shortcut for `removeEventListener('change', callback)` */
  removeEventListener(callback: EventListener): void;
  /** Unsubscribes from media query state change event. Implements {@link EventTarget} interface */
  removeEventListener(type: 'change', callback: EventListener): void;

  /** Optimize condition with nested hierarchy */
  optimize(): IMediaQueryCondition;

  /** Returns serialized value of the condition (any IMediaQueryCondition instance should be able to be serializable) */
  toString(): string;
}

/** A custom event dispatched by {@link ESLMediaQuery} instances */
export class ESLMediaChangeEvent extends Event {
  /** `true` if the query is matched device conditions when event was dispatched */
  public readonly matches: boolean;
  public override readonly target: IMediaQueryCondition;

  constructor(matches: boolean) {
    super('change');
    this.matches = matches;
  }

  /** Returns serialized value of the current {@link ESLMediaQuery} */
  public get media(): string {
    return String(this.target);
  }
}
