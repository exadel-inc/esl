import {ExportNs} from '../../esl-utils/environment/export-ns';
import {resolveProperty} from '../../esl-utils/misc/functions';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';

import {ESLEventListener} from './listener';
import {getAutoDescriptors, isEventDescriptor, initDescriptor} from './descriptors';

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

  /** Gets {@link ESLListenerDescriptorFn}s of the passed object */
  public static getAutoDescriptors = getAutoDescriptors;

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
      const descriptors = getAutoDescriptors(host);
      return descriptors.flatMap((desc) => ESLEventUtils.subscribe(host, desc));
    }
    const desc = typeof eventDesc === 'string' ? {event: eventDesc} : eventDesc as ESLListenerDescriptor;
    if (Object.hasOwnProperty.call(desc, 'condition') && !resolveProperty(desc.condition, host)) return [];
    const listeners = ESLEventListener.subscribe(host, handler, desc);
    if (!listeners.length) emptySubscriptionWarning(host, desc, handler);
    return listeners;
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param host - host element that stores subscriptions (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe = ESLEventListener.unsubscribe;
}

function emptySubscriptionWarning(host: object, descriptor: ESLListenerDescriptor, handler: ESLListenerHandler): void {
  const event = resolveProperty(descriptor.event, host);
  const target = resolveProperty(descriptor.target, host);
  console.warn('[ESL]: Empty subscription %o', {host, descriptor, handler, event, target});
}
