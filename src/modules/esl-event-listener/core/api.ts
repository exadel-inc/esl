import {ExportNs} from '../../esl-utils/environment/export-ns';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';
import {ESLEventListener} from './listener';

import type {
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerEventMap,
  ESLListenerDescriptorFn
} from './descriptor';

/** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
export const isDescriptorFn = (obj: any): obj is ESLListenerDescriptorFn =>
  typeof obj === 'function' && Object.hasOwnProperty.call(obj, 'event');

@ExportNs('EventUtils')
export class EventUtils {
  /**
   * Dispatches custom event. Alias for {@link dispatchCustomEvent}
   * @see dispatchCustomEvent
   */
  public static dispatch(el: EventTarget, eventName: string, eventInit?: CustomEventInit): boolean {
    return dispatchCustomEvent(el, eventName, eventInit);
  }

  /** Gets descriptors from the passed object */
  public static descriptors(target?: any, auto: boolean = true): ESLListenerDescriptorFn[] {
    if (!target) return [];
    const desc: ESLListenerDescriptorFn[] = [];
    for (const key in target) {
      if (isDescriptorFn(target[key]) && target[key].auto === auto) desc.push(target[key]);
    }
    return desc;
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
    if (isDescriptorFn(handler) && eventDesc !== handler) eventDesc = Object.assign({}, handler, eventDesc);

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
