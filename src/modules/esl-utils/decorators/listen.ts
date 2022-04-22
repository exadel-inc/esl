import {isDescriptorFn} from '../dom/events';

import type {ESLListenerHandler, ESLListenerEventMap, ESLListenerDescriptor} from '../dom/events';

type ListenDecorator<EType extends Event> =
  (target: any, property: string, descriptor: TypedPropertyDescriptor<ESLListenerHandler<EType>>) => void;

/**
 * Decorator to declare listener ({@link ESLEventListener}) meta information
 * Defines auto-subscribable event
 * @param event - event type string
 */
export function listen<K extends keyof ESLListenerEventMap>(event: K): ListenDecorator<ESLListenerEventMap[K]>;
/**
 * Decorator to declare listener ({@link ESLEventListener}) meta information using {@link ESLListenerDescriptor}
 * Defines auto-subscribable event by default
 * @param desc - event listener configuration {@link ESLListenerDescriptor}
 */
export function listen<K extends keyof ESLListenerEventMap>(desc: ESLListenerDescriptor<K>): ListenDecorator<ESLListenerEventMap[K]>;

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
