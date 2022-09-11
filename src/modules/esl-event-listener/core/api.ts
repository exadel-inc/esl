import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLEventListener} from './listener';

import type {ESLListenerHandler, ESLListenerCriteria} from './listener';
import type {ESLListenerDescriptor, ESLListenerEventMap} from './descriptor';

/** Function decorated as {@link ESLListenerDescriptor} */
export type ESLListenerDescriptorFn<EType extends keyof ESLListenerEventMap = string> =
  ESLListenerHandler<ESLListenerEventMap[EType]> & ESLListenerDescriptor<EType>;

/** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
export const isDescriptorFn = (obj: any): obj is ESLListenerDescriptorFn =>
  typeof obj === 'function' && Object.hasOwnProperty.call(obj, 'event');

@ExportNs('EventUtils')
export class EventUtils {
  /**
   * Dispatches custom event.
   * Event bubbles and is cancelable by default, use `eventInit` to override that.
   * @param el - element target
   * @param eventName - event name
   * @param eventInit - custom event init. See {@link CustomEventInit}
   */
  public static dispatch(el: EventTarget, eventName: string, eventInit?: CustomEventInit): boolean {
    const init = Object.assign({
      bubbles: true,
      composed: true,
      cancelable: true
    }, eventInit || {});
    return el.dispatchEvent(new CustomEvent(eventName, init));
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
   * Gets currently subscribed listeners of the target
   * @param target - host element (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static listeners(target: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(target, ...criteria);
  }

  /** Subscribes decorated `handler` method of the `target` */
  public static subscribe(target: HTMLElement, handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function with the passed event type */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    target: HTMLElement,
    descriptor: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  /** Subscribes `handler` descriptor function with the passed additional descriptor data */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    target: HTMLElement,
    descriptor: Partial<ESLListenerDescriptor>,
    handler: ESLListenerDescriptorFn<EType>
  ): ESLEventListener[];
  public static subscribe(
    target: HTMLElement,
    eventDesc: string | Partial<ESLListenerDescriptor> | ESLListenerHandler,
    handler: ESLListenerHandler = eventDesc as ESLListenerDescriptorFn
  ): ESLEventListener[] {
    if (typeof handler !== 'function') return [];
    if (typeof eventDesc === 'string') eventDesc = {event: eventDesc};
    if (isDescriptorFn(handler) && eventDesc !== handler) eventDesc = Object.assign({}, handler, eventDesc);
    const listeners = ESLEventListener.createOrResolve(target, handler, eventDesc as ESLListenerDescriptor);
    listeners.forEach((listener) => listener.subscribe());
    return listeners;
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param target - host element (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe(target: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    const listeners = EventUtils.listeners(target, ...criteria);
    listeners.forEach((listener) => listener.unsubscribe());
    return listeners;
  }
}
