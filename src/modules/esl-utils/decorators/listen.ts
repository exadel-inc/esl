import {isDescriptorFn} from '../dom/events';

import type {ESLListenerHandler, ESLListenerDescriptor} from '../dom/events';

type ListenDecorator<EType extends Event> =
  (target: any, property: string, descriptor: TypedPropertyDescriptor<ESLListenerHandler<EType>>) => void;

/**
 * Decorator to make function listen DOM Event
 * @param desc - event type string
 */
export function listen<K extends keyof HTMLElementEventMap>(desc: K): ListenDecorator<HTMLElementEventMap[K]>;
/**
 * Decorator to make function listen CustomEvent
 * @param desc - custom event type string
 */
export function listen(desc: string): ListenDecorator<Event>;
/**
 * Decorator to make function listen DOM Event
 * @param desc - event listener configuration {@link ESLListenerDescriptor}
 */
export function listen<K extends keyof HTMLElementEventMap>(desc: ESLListenerDescriptor<K>): ListenDecorator<HTMLElementEventMap[K]>;
/**
 * Decorator to make function listen DOM Event
 * @param desc - event listener configuration {@link ESLListenerDescriptor}
 */
export function listen(desc: ESLListenerDescriptor): ListenDecorator<Event>;

export function listen(desc: string | ESLListenerDescriptor): ListenDecorator<Event> {
  return function listener<T extends ESLListenerHandler>(target: HTMLElement,
                                                         propertyKey: string,
                                                         descriptor: TypedPropertyDescriptor<T>): void {
    desc = typeof desc === 'string' ? {event: desc} : desc;
    desc = Object.assign({auto: true}, desc);

    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new TypeError('Only class methods can be decorated via listener decorator');
    }

    if (isDescriptorFn(descriptor.value) && descriptor.value.event !== desc.event) {
      throw new TypeError(`Method ${propertyKey} already decorated as ESLListenerDescriptor`);
    }

    Object.assign(descriptor.value, desc);
    // Allow collecting
    descriptor.enumerable = true;
  };
}
