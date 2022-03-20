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
   * Get currently subscribed listeners of the target
   * @param target - host element (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static listeners(target: HTMLElement, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(target).filter((listener) => !criteria.length || criteria.every(listener.matches, listener));
  }

  /** Subscribe all decorated (auto-subscribable) methods of the `target` */
  public static subscribe(target: HTMLElement): void;
  /** Subscribe decorated `handler` method of the `target` */
  public static subscribe(target: HTMLElement, handler: ESLListenerHandler): void;
  /** Subscribe `handler` function with the passed event type */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    target: HTMLElement,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>,
    descriptor?: EType | ESLListenerDescriptor<EType>
  ): void;
  /** Creates and subscribe {@link ESLEventListener} */
  public static subscribe(
    target: HTMLElement,
    handler?: ESLListenerHandler,
    desc: string | ESLListenerDescriptor = handler as ESLListenerDescriptorFn
  ): void {
    if (typeof handler === 'function' && typeof desc !== 'undefined') {
      ESLEventListener.create(target, handler, desc)
        .forEach((listener) => listener.subscribe());
    } else {
      ESLEventListener.descriptors(target)
        .forEach((item) => item.auto && EventUtils.subscribe(target, item));
    }
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param target - host element (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe(target: HTMLElement, ...criteria: ESLListenerCriteria[]): void {
    EventUtils.listeners(target, ...criteria).forEach((listener) => listener.unsubscribe());
  }
}
