import {ExportNs} from '../../environment/export-ns';
import {ESLEventListener} from './listener';

import type {ESLListenerDescriptor, ESLListenerHandler} from './listener';

export type ESLEventCriteria = undefined | string | ESLListenerHandler | Partial<ESLListenerDescriptor>;
export type ESLListenerDescriptorFn = ESLListenerHandler & ESLListenerDescriptor;

// TODO: rename
/** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
export const isDescriptorFn = (obj: any): obj is ESLListenerDescriptorFn => typeof obj === 'function' && typeof obj.event === 'string';

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

  // TODO: remove or move
  /** Gets descriptors from the passed object */
  public static descriptors(target?: any): ESLListenerDescriptorFn[] {
    if (!target) return [];
    const desc: ESLListenerDescriptorFn[] = [];
    for (const key in target) {
      if (isDescriptorFn(target[key])) desc.push(target[key]);
    }
    return desc;
  }

  /** Get currently subscribed listeners of the target */
  public static listeners(target: HTMLElement, ...criteria: ESLEventCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(target).filter((listener) => !criteria.length || criteria.every(listener.matches, listener));
  }

  /** Subscribe all decorated (auto-subscribable) methods of the `target` */
  public static subscribe(target: HTMLElement): void;
  /** Subscribe decorated `handler` method of the `target` */
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  public static subscribe(target: HTMLElement, handler: ESLListenerHandler): void;
  /** Subscribe `handler` function with the passed `descriptor` or event*/
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  public static subscribe(target: HTMLElement, handler: ESLListenerHandler, descriptor?: string | ESLListenerDescriptor): void;
  /** Creates and subscribe {@link ESLEventListener} */
  public static subscribe(
    target: HTMLElement,
    handler?: ESLListenerHandler,
    desc?: string | ESLListenerDescriptor
  ): void {
    // TODO: refactor
    if (isDescriptorFn(handler) && desc === undefined) {
      handler.event.split(' ').forEach((event) => {
        EventUtils.subscribe(target, handler, Object.assign({}, handler, {event}));
      });
      return;
    }
    if (typeof handler === 'function' && desc) {
      desc = typeof desc === 'string' ? {event: desc} : desc;
      new ESLEventListener(target, handler, desc).subscribe();
      return;
    }
    EventUtils.descriptors(target)
      .forEach((item) => item.auto && EventUtils.subscribe(target, item));
  }

  /** Unsubscribes {@link ESLEventListener}(s) from the object */
  public static unsubscribe(target: HTMLElement, ...criteria: ESLEventCriteria[]): void {
    EventUtils.listeners(target, ...criteria).forEach((listener) => listener.unsubscribe());
  }
}
