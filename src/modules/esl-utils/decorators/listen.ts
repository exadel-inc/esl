import {ESLEventUtils} from '../../esl-event-listener/core';

import type {PropertyProvider} from '../misc/functions';
import type {DelegatedEvent, ESLListenerHandler, ESLListenerDescriptorExt} from '../../esl-event-listener/core';

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
 *
 * Note: you are using delegation as you declare `selector` property in `desc`.
 * Consider using {@link DelegatedEvent} event type wrapper in case you need to access `event.$delegate` property
 *
 * @see DelegatedEvent.prototype.$delegate
 */
export function listen<K extends keyof ESLListenerEventMap>(
  desc: ESLListenerDescriptorExt<K> & {selector: string | PropertyProvider<string>}
): ListenDecorator<DelegatedEvent<ESLListenerEventMap[K]> | ESLListenerEventMap[K]>;
/**
 * Decorator to declare listener ({@link ESLEventListener}) meta information using {@link ESLListenerDescriptor}
 * Defines auto-subscribable event by default
 * @param desc - event listener configuration {@link ESLListenerDescriptor}
 */
export function listen<K extends keyof ESLListenerEventMap>(desc: ESLListenerDescriptorExt<K>): ListenDecorator<ESLListenerEventMap[K]>;

export function listen(desc: string | PropertyProvider<string> | ESLListenerDescriptorExt): ListenDecorator<Event> {
  return function listener<Host extends object>(target: Host, propertyKey: keyof Host & string): void {
    // Map short event or event provider value to descriptor object
    desc = typeof desc === 'string' || typeof desc === 'function' ? {event: desc} : desc;
    // Makes auto collectable/subscribable description if not inherited
    desc = Object.assign(desc.inherit ? {} : {auto: true}, desc);

    ESLEventUtils.initDescriptor(target, propertyKey, desc);
  };
}
