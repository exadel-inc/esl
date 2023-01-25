import {ESLEventUtils} from '../../esl-event-listener/core';

import type {PropertyProvider} from '../misc/functions';
import type {ESLListenerHandler, ESLListenerEventMap, ESLListenerDescriptorExt} from '../dom/events';

type ListenDecorator<EType extends Event> =
  (target: any, property: string, descriptor: TypedPropertyDescriptor<ESLListenerHandler<EType>>) => void;

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
  return function listener<Host extends object>(target: Host, propertyKey: keyof Host & string): void {
    ESLEventUtils.initDescriptor(target, propertyKey, desc);
  };
}
