import {ExportNs} from '../../environment/export-ns';
import {ESLEventListener} from './listener';

import type {
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerEventMap,
  ESLListenerDescriptor,
  ESLListenerDescriptorFn
} from './listener';

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

  /**
   * Gets currently subscribed listeners of the target
   * @param target - host element (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static listeners(target: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(target).filter((listener) => !criteria.length || criteria.every(listener.matches, listener));
  }

  /** Subscribes all decorated (auto-subscribable) methods of the `target` */
  public static subscribe(target: HTMLElement): ESLEventListener[];
  /** Subscribes decorated `handler` method of the `target` */
  public static subscribe(target: HTMLElement, handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function with the passed event type */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    target: HTMLElement,
    descriptor: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  public static subscribe(
    target: HTMLElement,
    eventDesc?: string | ESLListenerDescriptor | ESLListenerHandler,
    handler: ESLListenerHandler = eventDesc as ESLListenerDescriptorFn
  ): ESLEventListener[] {
    if (typeof handler === 'function' && typeof eventDesc !== 'undefined') {
      const listeners = ESLEventListener.create(target, handler, eventDesc as string | ESLListenerDescriptor);
      listeners.forEach((listener) => listener.subscribe());
      return listeners;
    } else {
      return ESLEventListener.descriptors(target).reduce((listeners, desc) => {
        return desc.auto ? listeners.concat(EventUtils.subscribe(target, desc)) : listeners;
      }, [] as ESLEventListener[]);
    }
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
