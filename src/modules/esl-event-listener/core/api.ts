import {ExportNs} from '../../esl-utils/environment/export-ns';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';
import {extractValues} from '../../esl-utils/misc/object';
import {ESLEventListener} from './listener';

import type {
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerEventMap,
  ESLListenerDescriptorFn
} from './types';


@ExportNs('EventUtils')
export class EventUtils {
  /**
   * Dispatches custom event. Alias for {@link dispatchCustomEvent}
   * @see dispatchCustomEvent
   */
  public static dispatch(el: EventTarget, eventName: string, eventInit?: CustomEventInit): boolean {
    return dispatchCustomEvent(el, eventName, eventInit);
  }

  /** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
  public static isEventDescriptor(obj: any): obj is ESLListenerDescriptorFn {
    return typeof obj === 'function' && Object.hasOwnProperty.call(obj, 'event');
  }

  /** Gets {@link ESLListenerDescriptorFn}s of the passed object */
  public static descriptors(target: any, auto: boolean = true): ESLListenerDescriptorFn[] {
    return extractValues(target, (value) => EventUtils.isEventDescriptor(value) && value.auto === auto);
  }

  /**
   * Gets currently subscribed listeners of the host
   * @param host - host element (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static listeners(host: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(host, ...criteria);
  }

  /** Subscribes decorated `handler` method of the `host` */
  public static subscribe(host: HTMLElement, handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function with the passed event type */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: HTMLElement,
    descriptor: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  /** Subscribes `handler` descriptor function with the passed additional descriptor data */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: HTMLElement,
    descriptor: Partial<ESLListenerDescriptor>,
    handler: ESLListenerDescriptorFn<EType>
  ): ESLEventListener[];
  public static subscribe(
    host: HTMLElement,
    eventDesc: string | Partial<ESLListenerDescriptor> | ESLListenerHandler,
    handler: ESLListenerHandler = eventDesc as ESLListenerDescriptorFn
  ): ESLEventListener[] {
    if (typeof handler !== 'function') return [];
    if (typeof eventDesc === 'string') eventDesc = {event: eventDesc};
    if (EventUtils.isEventDescriptor(handler) && eventDesc !== handler) eventDesc = Object.assign({}, handler, eventDesc);

    const listeners = ESLEventListener.createOrResolve(host, handler, eventDesc as ESLListenerDescriptor);
    const subscribed = listeners.filter((listener) => listener.subscribe());
    if (!subscribed.length) console.warn('[ESL]: Empty subscription %o for %o', eventDesc, handler);
    return subscribed;
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param host - host element that stores subscriptions (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe(host: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    const listeners = ESLEventListener.get(host, ...criteria);
    listeners.forEach((listener) => listener.unsubscribe());
    return listeners;
  }
}
