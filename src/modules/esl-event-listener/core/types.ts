import type {PropertyProvider} from '../../esl-utils/misc/functions';

declare global {
  /** Extended event map with the custom event definition */
  export interface ESLListenerEventMap extends HTMLElementEventMap {
    /** User custom event or group of events */
    [e: string]: Event;
  }
}

/** Extended event with a delegated event target */
export type DelegatedEvent<EventType extends Event> = EventType & {
  $delegate: Element | null;
};

/** String CSS selector to find the target or {@link EventTarget} object or array of {@link EventTarget}s */
export type ESLListenerTarget = EventTarget | EventTarget[] | string | null;

/** Descriptor to create {@link ESLEventListener} */
export type ESLListenerDescriptor<EType extends keyof ESLListenerEventMap = string> = {
  /** A case-sensitive string (or provider function) representing the event type to listen for */
  event: EType | PropertyProvider<EType>;
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
};

/** Resolved descriptor (definition) to create {@link ESLEventListener} */
export interface ESLListenerDefinition<EType extends keyof ESLListenerEventMap = string> extends ESLListenerDescriptor<EType> {
  /** A case-sensitive string (or provider function) representing the event type to listen for */
  event: EType;
}

/** Describes callback handler */
export type ESLListenerHandler<EType extends Event = Event> = ((event: EType) => void) | (() => void);

/** Condition (criteria) to find {@link ESLListenerDescriptor} */
export type ESLListenerCriteria =
  | undefined
  | keyof ESLListenerEventMap
  | ESLListenerHandler
  | Partial<ESLListenerDefinition>;

/** Function decorated as {@link ESLListenerDescriptor} */
export type ESLListenerDescriptorFn<EType extends keyof ESLListenerEventMap = string> =
  ESLListenerHandler<ESLListenerEventMap[EType]> & ESLListenerDescriptor<EType>;

/** Descriptor to create {@link ESLEventListener} based on class property */
export type ESLListenerDescriptorExt<T extends keyof ESLListenerEventMap = string> = Partial<ESLListenerDescriptor<T>> & {
  /** Defines if the listener metadata should be inherited from the method of the superclass */
  inherit?: boolean;
};
