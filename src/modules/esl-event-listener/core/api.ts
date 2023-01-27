import {ExportNs} from '../../esl-utils/environment/export-ns';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';
import {ESLEventListener} from './listener';
import {getAutoDescriptors, isEventDescriptor, initDescriptor} from './descriptors';

import type {
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerEventMap,
  ESLListenerDescriptorFn
} from './types';

@ExportNs('EventUtils')
export class ESLEventUtils {
  /**
   * Dispatches custom event. Alias for {@link dispatchCustomEvent}
   * @see dispatchCustomEvent
   */
  public static dispatch = dispatchCustomEvent;


  /** @deprecated alias for {@link getAutoDescriptors} */
  public static descriptors = getAutoDescriptors;

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
  public static listeners(host: unknown, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(host, ...criteria);
  }

  /**
   * Subscribes decorated as an {@link ESLListenerDescriptorFn} `handler` function
   * @param host - host object (listeners context) to associate subscription
   * @param handler - handler function decorated as {@link ESLListenerDescriptorFn}
   */
  public static subscribe(host: unknown, handler: ESLListenerHandler): ESLEventListener[];
  /**
   * Subscribes `handler` function with the passed event type or {@link ESLListenerDescriptor} with event type declared
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - event or {@link ESLListenerDescriptor} with defined event type
   * @param handler - handler function to subscribe
   */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: unknown,
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
    host: unknown,
    descriptor: Partial<ESLListenerDescriptor>,
    handler: ESLListenerDescriptorFn<EType>
  ): ESLEventListener[];
  public static subscribe(
    host: unknown,
    eventDesc: string | Partial<ESLListenerDescriptor> | ESLListenerHandler,
    handler: ESLListenerHandler = eventDesc as ESLListenerDescriptorFn
  ): ESLEventListener[] {
    if (typeof handler !== 'function') return [];
    if (typeof eventDesc === 'string') eventDesc = {event: eventDesc};
    if (isEventDescriptor(handler) && eventDesc !== handler) eventDesc = Object.assign({}, handler, eventDesc);

    const listeners = ESLEventListener.createOrResolve(host, handler, eventDesc as ESLListenerDescriptor);
    const subscribed = listeners.filter((listener) => listener.subscribe());
    if (!subscribed.length) console.warn('[ESL]: Empty subscription %o', Object.assign({}, eventDesc, {handler}));
    return subscribed;
  }

  /**
   * Subscribes all auto descriptors of the host
   * @param host - host object (listeners context) to find descriptors and associate subscription
   * */
  public static subscribeAll(host: unknown): ESLEventListener[] {
    return getAutoDescriptors(host).reduce((subscriptions: ESLEventListener[], desc: ESLListenerDescriptorFn) => {
      return subscriptions.concat(ESLEventUtils.subscribe(host, desc));
    }, []);
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param host - host element that stores subscriptions (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe(host: unknown, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    const listeners = ESLEventListener.get(host, ...criteria);
    listeners.forEach((listener) => listener.unsubscribe());
    return listeners;
  }
}

/** @deprecated alias for {@link ESLEventUtils} */
export const EventUtils = ESLEventUtils;
