import {ExportNs} from '../../environment/export-ns';
import {ESLEventListener, isDescriptorFn} from './listener';
import type {ESLListenerDescriptor, ESLListenerDescriptorFn, ESLListenerHandler} from './listener';

@ExportNs('EventUtils')
export class EventUtils {
  // Meta api // move
  /** Gets descriptors from the passed object */
  public static descriptors(target?: any): ESLListenerDescriptorFn[] {
    if (!target) return [];
    const desc: ESLListenerDescriptorFn[] = [];
    for (const key in target) {
      if (isDescriptorFn(target[key])) desc.push(target[key]);
    }
    return desc;
  }

  // Pub api
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

  /** Creates and subscribe {@link ESLEventListener} */
  public static subscribe(
    target: HTMLElement,
    handler?: ESLListenerHandler,
    desc: string | ESLListenerDescriptor = handler as ESLListenerDescriptorFn
  ): void {
    if (handler) return new ESLEventListener(handler, desc).subscribe(target);
    EventUtils.descriptors(this).forEach((item) => {
      item.auto && EventUtils.subscribe(target, item, item);
    });
  }

  /** Unsubscribes {@link ESLEventListener}(s) from the object */
  public static unsubscribe(
    target: HTMLElement,
    handler?: ESLListenerHandler,
    desc?: Partial<ESLListenerDescriptor> | string
  ): void {
    ESLEventListener.get(target).forEach((listener) => {
      if (listener.equal(handler) || listener.equal(desc)) listener.unsubscribe();
    });
  }
}
