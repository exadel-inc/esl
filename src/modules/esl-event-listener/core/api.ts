import {ExportNs} from '../../esl-utils/environment/export-ns';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';

import {ESLEventListener} from './listener';
import {getDescriptors, isEventDescriptor, initDescriptor} from './descriptors';

import type {
  ESLListenerHandler,
  ESLListenerDescriptor,
  ESLListenerDescriptorFn
} from './types';

// Export all related types
export type * from './types';
export type {ESLEventListener} from './listener';

@ExportNs('EventUtils')
export class ESLEventUtils {
  /**
   * Dispatches custom event. Alias for {@link dispatchCustomEvent}
   * @see dispatchCustomEvent
   */
  public static dispatch = dispatchCustomEvent;

  /** @deprecated alias for {@link getAutoDescriptors} */
  public static descriptors = (host: object): ESLListenerDescriptorFn[] => getDescriptors(host, {auto: true});

  /** @deprecated use {@link getDescriptors} with a filter instead */
  public static getAutoDescriptors = (host: object): ESLListenerDescriptorFn[] => getDescriptors(host, {auto: true});

  /** Gets {@link ESLListenerDescriptorFn}s of the passed object */
  public static getDescriptors = getDescriptors;

  /**
   * Decorates passed `key` of the `host` as an {@link ESLListenerDescriptorFn} using `desc` meta information
   * @param host - object holder of the function to decorate
   * @param key - string key of the function in holder object
   * @param desc - descriptor meta information to assign
   * @returns ESLListenerDescriptorFn created on the host
   */
  public static initDescriptor = initDescriptor;

  /** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
  public static isEventDescriptor = isEventDescriptor;

  /**
   * Gets currently subscribed listeners of the host
   * @param host - host object (listeners context) to associate subscription
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static listeners = ESLEventListener.get;

  /**
   * Subscribes all auto descriptors of the host
   * @param host - host object (listeners context) to find descriptors and associate subscription
   * */
  public static subscribe(host: object): ESLEventListener[];
  /**
   * Subscribes decorated as an {@link ESLListenerDescriptorFn} `handler` function
   * @param host - host object (listeners context) to associate subscription
   * @param handler - handler function decorated as {@link ESLListenerDescriptorFn}
   */
  public static subscribe(host: object, handler: ESLListenerHandler): ESLEventListener[];
  /**
   * Subscribes `handler` function with the passed event type or {@link ESLListenerDescriptor} with event type declared
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - event or {@link ESLListenerDescriptor} with defined event type
   * @param handler - handler function to subscribe
   */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: object,
    descriptor: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  /**
   * Subscribes `handler` function decorated with {@link ESLListenerDescriptorFn} with the passed additional {@link ESLListenerDescriptor} data
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - {@link ESLListenerDescriptor} additional data
   * @param handler - handler function decorated as {@link ESLListenerDescriptorFn}
   */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: object,
    descriptor: Partial<ESLListenerDescriptor>,
    handler: ESLListenerDescriptorFn<EType>
  ): ESLEventListener[];
  public static subscribe(
    host: object,
    eventDesc?: string | Partial<ESLListenerDescriptor> | ESLListenerHandler,
    handler: ESLListenerHandler = eventDesc as ESLListenerDescriptorFn
  ): ESLEventListener[] {
    if (arguments.length === 1) {
      const descriptors = getDescriptors(host, {auto: true});
      // TODO: flatMap when ES5 will be out of support list
      return descriptors.reduce(
        (acc, desc) => acc.concat(ESLEventUtils.subscribe(host, desc)),
        [] as ESLEventListener[]
      );
    }
    const desc = typeof eventDesc === 'string' ? {event: eventDesc} : eventDesc as ESLListenerDescriptor;
    return ESLEventListener.subscribe(host, handler, desc);
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param host - host element that stores subscriptions (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe = ESLEventListener.unsubscribe;
}

/** @deprecated alias for {@link ESLEventUtils} */
export const EventUtils = ESLEventUtils;
