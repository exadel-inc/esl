import {ExportNs} from '../../esl-utils/environment/export-ns';
import {dispatchCustomEvent} from '../../esl-utils/dom/events/misc';
import {ESLEventListener} from './listener';
import {getAutoDescriptors, isEventDescriptor, initDescriptor} from './descriptors';

import {ESLEventTargetDecorator} from './targets/decorated.target';
import {ESLResizeObserverTarget} from './targets/resize.adapter';

import type {
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerEventMap,
  ESLListenerDescriptorFn
} from './types';


@ExportNs('EventUtils')
export class ESLEventUtils {
  /**
   * Dispatches custom event. Alias for {@link dispatchCustomEvent}
   * @see dispatchCustomEvent
   */
  public static dispatch = dispatchCustomEvent;


  /** @deprecated alias for {@link getAutoDescriptors} */
  public static descriptors = getAutoDescriptors;

  /** Gets {@link ESLListenerDescriptorFn}s of the passed object */
  public static getAutoDescriptors = getAutoDescriptors;

  /**
   * Decorates passed `key` of the `host` as an {@link ESLListenerDescriptorFn} using `desc` meta information
   * @param host - object holder of the function to decorate
   * @param key - string key of the function in holder object
   * @param desc - descriptor meta information to assign
   * @returns ESLListenerDescriptorFn created on the host
   */
  public static initDescriptor = initDescriptor;

  /** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
  public static isEventDescriptor = isEventDescriptor;


  /**
   * Gets currently subscribed listeners of the host
   * @param host - host object (listeners context) to associate subscription
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners list
   */
  public static listeners(host: object, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventListener.get(host, ...criteria);
  }

  /**
   * Subscribes all auto descriptors of the host
   * @param host - host object (listeners context) to find descriptors and associate subscription
   * */
  public static subscribe(host: object): ESLEventListener[];
  /**
   * Subscribes decorated as an {@link ESLListenerDescriptorFn} `handler` function
   * @param host - host object (listeners context) to associate subscription
   * @param handler - handler function decorated as {@link ESLListenerDescriptorFn}
   */
  public static subscribe(host: object, handler: ESLListenerHandler): ESLEventListener[];
  /**
   * Subscribes `handler` function with the passed event type or {@link ESLListenerDescriptor} with event type declared
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - event or {@link ESLListenerDescriptor} with defined event type
   * @param handler - handler function to subscribe
   */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: object,
    descriptor: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  /**
   * Subscribes `handler` function decorated with {@link ESLListenerDescriptorFn} with the passed additional {@link ESLListenerDescriptor} data
   * @param host - host object (listeners context) to associate subscription
   * @param descriptor - {@link ESLListenerDescriptor} additional data
   * @param handler - handler function decorated as {@link ESLListenerDescriptorFn}
   */
  public static subscribe<EType extends keyof ESLListenerEventMap>(
    host: object,
    descriptor: Partial<ESLListenerDescriptor>,
    handler: ESLListenerDescriptorFn<EType>
  ): ESLEventListener[];
  public static subscribe(
    host: object,
    eventDesc?: string | Partial<ESLListenerDescriptor> | ESLListenerHandler,
    handler: ESLListenerHandler = eventDesc as ESLListenerDescriptorFn
  ): ESLEventListener[] {
    if (arguments.length === 1) {
      const descriptors = getAutoDescriptors(host);
      // TODO: flatMap when ES5 will be out of support list
      return descriptors.reduce(
        (acc, desc) => acc.concat(ESLEventListener.subscribe(host, desc)),
        [] as ESLEventListener[]
      );
    }
    if (typeof eventDesc === 'string') eventDesc = {event: eventDesc};
    const listeners = ESLEventListener.subscribe(host, handler, eventDesc as ESLListenerDescriptor);
    if (!listeners.length) console.warn('[ESL]: Empty subscription %o', Object.assign({}, eventDesc, {handler}));
    return listeners;
  }

  /**
   * Unsubscribes {@link ESLEventListener}(s) from the object
   * @param host - host element that stores subscriptions (listeners context)
   * @param criteria - optional set of criteria {@link ESLListenerCriteria} to filter listeners to remove
   */
  public static unsubscribe(host: object, ...criteria: ESLListenerCriteria[]): ESLEventListener[] {
    const listeners = ESLEventListener.get(host, ...criteria);
    listeners.forEach((listener) => listener.unsubscribe());
    return listeners;
  }

  // === EventTargets adapters ===
  /**
   * Creates an {@link EventTarget} adapter ({@link ESLResizeObserverTarget}) for {@link ResizeObserver}
   * Note: the {@link ESLResizeObserverTarget} instances are unique for the related `targets`
   */
  public static resize = ESLResizeObserverTarget.create;

  /**
   * Creates an {@link ESLEventTargetDecorator} decorator for any {@link EventTarget}
   * Decorated {@link EventTarget} produces event according provided handler decoration
   */
  public static decorate = ESLEventTargetDecorator.cached;
}

/** @deprecated alias for {@link ESLEventUtils} */
export const EventUtils = ESLEventUtils;
