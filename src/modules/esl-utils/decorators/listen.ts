import type {ESLListenerDescriptor} from '../dom/events/listener';

/**
 * Decorator to declare {@link ESLListenerDescriptorFn} method
 * @param desc - event listener configuration {@link ESLListenerDescriptor} or string to declare default event listener
 */
export const listen = (desc: string | ESLListenerDescriptor) => {
  return function listener<T extends (e: Event) => void>(target: HTMLElement,
                                                         propertyKey: string,
                                                         descriptor: TypedPropertyDescriptor<T>): void {
    if (!descriptor || typeof descriptor.value !== 'function') {
      throw new TypeError('Only class methods can be decorated via listener decorator');
    }
    const fn = descriptor.value;
    desc = typeof desc === 'string' ? {event: desc} : desc;
    desc = Object.assign({auto: true}, desc);
    Object.assign(fn, desc);
    // Allow collecting
    descriptor.enumerable = true;
  };
};
