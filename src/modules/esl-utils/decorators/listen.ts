import {isDescriptorFn} from '../dom/events';
import type {ESLListenerDescriptor} from '../dom/events/listener';

/**
 * Decorator to declare {@link ESLListenerDescriptorFn} method
 * @param desc - event listener configuration {@link ESLListenerDescriptor} or string to declare default event listener
 */
export const listen = (desc: string | ESLListenerDescriptor) => {
  return function listener<T extends (e: Event) => void>(target: HTMLElement,
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
};
