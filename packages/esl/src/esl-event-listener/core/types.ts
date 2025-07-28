import type {Trim, MaybeArgFn, ResolvableProperty} from '../../esl-utils/misc';

declare global {
  /** Extended event map with the custom event definition */
  export interface ESLListenerEventMap extends HTMLElementEventMap {
    '': never; // Prevents using empty string as event name
  }
}

export type TypedTarget<EClass> = EventTarget & {readonly __eventClass__: EClass};

/** Event name definition */
export type ESLEventName = keyof ESLListenerEventMap | string;
export type ESLEventTarget = ESLListenerTarget | PropertyProvider<ESLListenerTarget>;

/**
 * Helper type to extract Event types union by event string
 * @example
 * ```typescript
 * type MyEvent = ESLEventFor<'click'>; // MouseEvent
 * type MyEvent = ESLEventFor<'custom'>; // Event
 * type MyEvent = ESLEventFor<'click custom'>; // MouseEvent | Event
 * ```
 */
export type ESLEventType<EName extends ESLEventName> =
  Trim<EName> extends keyof ESLListenerEventMap ? ESLListenerEventMap[Trim<EName>] :
    Trim<EName> extends `${infer T} ${infer U}` ? ESLEventType<T> | ESLEventType<U> :
      EName extends '' ? never : Event;

/** An extended event with a delegated event target */
export type DelegatedEvent<EventType extends Event = Event> = EventType & {
  /** Delegated target element, that exactly accepted by `selector` CSS selector */
  $delegate: Element | null;
};

/** String CSS selector to find the target or {@link EventTarget} object or array of {@link EventTarget}s */
export type ESLListenerTarget = EventTarget | EventTarget[] | string | null;

type EventTypeName<EType> = {
  [EKey in keyof ESLListenerEventMap]: (ESLListenerEventMap[EKey] extends CustomEvent<infer Detail> ?
    Detail : ESLListenerEventMap[EKey]) extends infer EName ?
    EName extends EType ?
      EKey : never
    : never
}[keyof ESLListenerEventMap];

type ESLEventConstraint<EName extends ESLEventName, ETarget> =
  ETarget extends TypedTarget<infer EClass>
    ? EClass extends object
      ? EName extends EventTypeName<EClass>
        ? unknown
        : {event: ResolvableProperty<EventTypeName<EClass>>}
      : unknown
    : unknown;

/** Descriptor to create {@link ESLEventListener} */
export type ESLListenerDescriptor <ETarget extends ESLListenerTarget = ESLListenerTarget, EName extends ESLEventName = string> =
ESLEventConstraint<EName, ETarget> & {
  /** A case-sensitive string (or provider function) representing the event type to listen for */
  event: ResolvableProperty<EName>;
  /**
   * A boolean value indicating that events for this listener will be dispatched on the capture phase.
   * @see AddEventListenerOptions.capture
   */
  capture?: boolean;
  /**
   * A boolean value that indicates that the function specified by listener will never call preventDefault()
   * @see AddEventListenerOptions.passive
   */
  passive?: boolean;

  /**
   * A condition (boolean value or predicate) to apply subscription
   * Subscription rejected by condition does not count as warning during subscription process
   * Rejected by condition subscription does not count as warning during subscription process
   */
  condition?: ResolvableProperty<boolean>;

  /** A string (or provider function) representing CSS selector to check delegated event target (undefined (disabled) by default) */
  selector?: ResolvableProperty<string>;
  /**
   * An ESLEventTarget (or provider function) to subscribe the event listener to
   * **Note**: string values are processed by the {@link ESLTraversingQuery} syntax
   * (e.g. `button` selects all buttons globally, while `::find(button)` selects only buttons inside current element)
   */
  target?: ResolvableProperty<ETarget>;

  /** A boolean value indicating that the listener should be automatically subscribed within connected callback */
  auto?: boolean;
  /** A boolean value indicating that the listener should be invoked at most once after being added */
  once?: boolean;

  /** Auxiliary group name to group listeners. Used for a batch un/re-subscribe */
  group?: string;
};

/** Resolved descriptor (definition) to create {@link ESLEventListener} */
export type ESLListenerDefinition<ETarget extends ESLListenerTarget = ESLListenerTarget, EName extends ESLEventName = string> =
  ESLListenerDescriptor<ETarget, EName> & {
    /** A case-sensitive string (or provider function) representing the event type to listen for */
    event: EName;
  };

/** Describes callback handler */
export type ESLListenerHandler<E extends ESLEventName | Event = Event> =
  E extends '' ? never : // Prevents using empty string as event name
    MaybeArgFn<E extends ESLEventName ? ESLEventType<E> : E>;

/** Condition (criteria) to find {@link ESLListenerDescriptor} */
export type ESLListenerDescriptorCriteria =
  | undefined
  | string
  | Partial<ESLListenerDefinition>;

/** Condition (criteria) to find {@link ESLEventListener} */
export type ESLListenerCriteria = ESLListenerDescriptorCriteria | ESLListenerHandler;

/** Function decorated as {@link ESLListenerDescriptor} */
export type ESLListenerDescriptorFn<ETarget extends ESLListenerTarget = ESLListenerTarget, EName extends ESLEventName = string> =
  ESLListenerHandler<EName> & ESLListenerDescriptor<ETarget, EName>;

/** Descriptor to create {@link ESLEventListener} based on class property */
export type ESLListenerDescriptorExt<ETarget extends ESLListenerTarget = ESLListenerTarget, EName extends ESLEventName = string> =
  ESLEventConstraint<EName, ETarget> & Partial<Omit<ESLListenerDescriptor<ETarget, EName>, keyof ESLEventConstraint<any, any>>> & {
    /** Defines if the listener metadata should be inherited from the method of the superclass */
    inherit?: boolean;
  };
