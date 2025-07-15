import type {Trim, PropertyProvider} from '../../esl-utils/misc';

declare global {
  /** Extended event map with the custom event definition */
  export interface ESLListenerEventMap extends HTMLElementEventMap {
    '': never; // Prevents using empty string as event name
  }
}

/** Event name definition */
export type ESLEventName = keyof ESLListenerEventMap | string;

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

/** Descriptor to create {@link ESLEventListener} */
export type ESLListenerDescriptor<EName extends ESLEventName = string> = {
  /** A case-sensitive string (or provider function) representing the event type to listen for */
  event: EName | PropertyProvider<EName>;
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
  condition?: boolean | PropertyProvider<boolean>;

  /** A string (or provider function) representing CSS selector to check delegated event target (undefined (disabled) by default) */
  selector?: string | PropertyProvider<string>;
  /**
   * An ESLEventTarget (or provider function) to subscribe the event listener to
   * **Note**: string values are processed by the {@link ESLTraversingQuery} syntax
   * (e.g. `button` selects all buttons globally, while `::find(button)` selects only buttons inside current element)
   */
  target?: ESLListenerTarget | PropertyProvider<ESLListenerTarget>;

  /** A boolean value indicating that the listener should be automatically subscribed within connected callback */
  auto?: boolean;
  /** A boolean value indicating that the listener should be invoked at most once after being added */
  once?: boolean;

  /** Auxiliary group name to group listeners. Used for a batch un/re-subscribe */
  group?: string;
};

/** Resolved descriptor (definition) to create {@link ESLEventListener} */
export interface ESLListenerDefinition<EName extends ESLEventName = string> extends ESLListenerDescriptor<EName> {
  /** A case-sensitive string (or provider function) representing the event type to listen for */
  event: EName;
}

/** Describes callback handler */
export type ESLListenerHandler<E extends ESLEventName | Event = Event> =
  ((event: E extends ESLEventName ? ESLEventType<E> : E) => void) | (() => void);

/** Condition (criteria) to find {@link ESLListenerDescriptor} */
export type ESLListenerDescriptorCriteria =
  | undefined
  | string
  | Partial<ESLListenerDefinition>;

/** Condition (criteria) to find {@link ESLEventListener} */
export type ESLListenerCriteria = ESLListenerDescriptorCriteria | ESLListenerHandler;

/** Function decorated as {@link ESLListenerDescriptor} */
export type ESLListenerDescriptorFn<EName extends ESLEventName = string> = ESLListenerHandler<EName> & ESLListenerDescriptor<EName>;

/** Descriptor to create {@link ESLEventListener} based on class property */
export type ESLListenerDescriptorExt<T extends ESLEventName = string> = Partial<ESLListenerDescriptor<T>> & {
  /** Defines if the listener metadata should be inherited from the method of the superclass */
  inherit?: boolean;
};
