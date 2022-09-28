import {ESLEventUtils} from '../../esl-event-listener/core';

import type {PropertyProvider} from '../misc/functions';
import type {ESLListenerHandler, ESLListenerEventMap, ESLListenerDescriptor} from '../dom/events';

type ListenDecorator<EType extends Event> =
  (target: any, property: string, descriptor: TypedPropertyDescriptor<ESLListenerHandler<EType>>) => void;

type ESLListenerDescriptorExt<T extends keyof ESLListenerEventMap = string> = Partial<ESLListenerDescriptor<T>> & {
  /** Defines if the listener metadata should be inherited from the method of the superclass */
  inherit?: boolean;
};

/**
 * Decorator to declare listener ({@link ESLEventListener}) meta information
 * Defines auto-subscribable event
 * @param event - event type string or event provider function
 */
export function listen<K extends keyof ESLListenerEventMap>(event: K | PropertyProvider<K>): ListenDecorator<ESLListenerEventMap[K]>;
/**
 * Decorator to declare listener ({@link ESLEventListener}) meta information using {@link ESLListenerDescriptor}
 * Defines auto-subscribable event by default
 * @param desc - event listener configuration {@link ESLListenerDescriptor}
 */
export function listen<K extends keyof ESLListenerEventMap>(desc: ESLListenerDescriptorExt<K>): ListenDecorator<ESLListenerEventMap[K]>;

export function listen(desc: string | ESLListenerDescriptorExt): ListenDecorator<Event> {
  return function listener<T extends ESLListenerHandler>(target: HTMLElement,
                                                         propertyKey: string,
                                                         descriptor: TypedPropertyDescriptor<T>): void {
    const superDesc = Object.getPrototypeOf(target)[propertyKey];
    desc = typeof desc === 'string' || typeof desc === 'function' ? {event: desc} : desc;
    desc = Object.assign({auto: true}, desc.inherit && ESLEventUtils.isEventDescriptor(superDesc) ? superDesc : {}, desc);

    const fn = descriptor.value || descriptor.get && descriptor.get.call(target);
    if (typeof fn !== 'function') {
      throw new TypeError('Only class methods can be decorated via listener decorator');
    }
    if (ESLEventUtils.isEventDescriptor(fn) && fn.event !== desc.event) {
      throw new TypeError(`Method ${propertyKey} already decorated as ESLListenerDescriptor`);
    }

    Object.assign(fn, desc);
    // Allow collecting
    descriptor.enumerable = true;
  };
}
