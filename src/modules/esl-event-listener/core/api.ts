import {ExportNs} from '../../esl-utils/environment/export-ns';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';
import {ESLEventListener} from './listener';
import {getAutoDescriptors, setAutoDescriptor, isEventDescriptor} from './descriptors';

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

  /** Gets {@link ESLListenerDescriptorFn}s of the passed object */
  public static descriptors = getAutoDescriptors;

  /** Mark field, instanceof {@link ESLListenerDescriptorFn}, as collectable event descriptor */
  public static setAutoDescriptor = setAutoDescriptor;

  /** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
  public static isEventDescriptor = isEventDescriptor;

  /**
   * Gets currently subscribed listeners of the host
   * @param host - host element (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static listeners(host: unknown, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(host, ...criteria);
  }

  /** Subscribes decorated `handler` method of the `host` */
  public static subscribe(host: unknown, handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function with the passed event type */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: unknown,
    descriptor: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  /** Subscribes `handler` descriptor function with the passed additional descriptor data */
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
