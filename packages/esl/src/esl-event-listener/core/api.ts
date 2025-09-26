import {ExportNs} from '../../esl-utils/environment/export-ns';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';

import {ESLEventListener} from './listener';
import {getDescriptors, isEventDescriptor, initDescriptor} from './descriptors';

import type {
  DelegatedEvent,
  ESLEventType,
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerDescriptorFn,
  ESLListenerDescriptorCriteria,
  ESLListenerTarget,
  ExtractEventName
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
  public static descriptors = getDescriptors;

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
  /** Subscribes (or resubscribes) all known descriptors that matches criteria */
  public static subscribe<ETarget extends ESLListenerTarget, EName extends ExtractEventName<ETarget>>(
    host: object, criteria: ESLListenerCriteria<ETarget, EName>): ESLEventListener[];
  /**
   * Subscribes decorated as an {@link ESLListenerDescriptorFn} `handler` function
   * @param host - host object (listeners context) to associate subscription
   * @param handler - handler function decorated as {@link ESLListenerDescriptorFn}
   */
  public static subscribe(host: object, handler: ESLListenerHandler): ESLEventListener[];
  /**
   * Subscribes all descriptors that matches criteria, with a passed descriptor override
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - event or {@link ESLListenerDescriptor} with defined event type
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static subscribe<ETarget extends ESLListenerTarget, EName extends ExtractEventName<ETarget>>(
    host: object, descriptor: Partial<ESLListenerDescriptor<ETarget, EName>>, criteria: ESLListenerDescriptorCriteria<ETarget, EName>): ESLEventListener[];
  /**
   * Subscribes `handler` function with the passed event type or {@link ESLListenerDescriptor} with event type declared
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - event or {@link ESLListenerDescriptor} with defined event type
   * @param handler - handler function to subscribe
   */
  public static subscribe<ETarget extends ESLListenerTarget, EName extends ExtractEventName<ETarget>>(
    host: object,
    descriptor: EName | ESLListenerDescriptor<ETarget, EName>,
    handler: ESLListenerHandler<EName | DelegatedEvent<ESLEventType<EName>>>
  ): ESLEventListener[];
  /**
   * Subscribes `handler` function decorated with {@link ESLListenerDescriptorFn} with the passed additional {@link ESLListenerDescriptor} data
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - {@link ESLListenerDescriptor} additional data
   * @param handler - handler function decorated as {@link ESLListenerDescriptorFn}
   */
  public static subscribe<ETarget extends ESLListenerTarget, EName extends ExtractEventName<ETarget>>(
    host: object,
    descriptor: Partial<ESLListenerDescriptor<ETarget, EName>>,
    handler: ESLListenerDescriptorFn<ETarget, EName>
  ): ESLEventListener[];
  public static subscribe(
    host: object,
    eventDesc: any = {auto: true},
    handler: any = eventDesc
  ): ESLEventListener[] {
    if (typeof eventDesc === 'string') eventDesc = {event: eventDesc} as ESLListenerDescriptor;
    if (typeof handler === 'function') {
      if (typeof eventDesc === 'function' && eventDesc !== handler) throw new Error('[ESL] Multiple handler functions passed');
      return ESLEventListener.subscribe(host, handler, eventDesc);
    }
    return getDescriptors(host, handler).flatMap((desc) => ESLEventListener.subscribe(host, desc, eventDesc));
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param host - host element that stores subscriptions (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe = ESLEventListener.unsubscribe;
}
