import {sequentialUID} from '../../misc/uid';
import {TraversingQuery} from '../../../esl-traversing-query/core';
import {isSimilar} from '../../misc/object/compare';

/** Describes callback handler */
export type ESLListenerHandler = (e: Event, listener: ESLEventListener) => void;
/** Descriptor to create {@link ESLEventListener} */
export type ESLListenerDescriptor = {
  /** Event type */
  event: string;
  /** Use capture phase */
  capture?: boolean;

  /** Selector to delegate event */
  match?: string; // TODO: rename !!! (add selector "meaning")
  /** Selector {@link TraversingQuery} to subscribe */
  target?: string | Element | Document | Window;

  /** Listener identifier */
  id?: string;
  /** Marker to automatically create and subscribe {@link ESLEventListener} from {@link ESLListenerDescriptor} */
  auto?: boolean;
};
export type ESLListenerDescriptorFn = ESLListenerHandler & ESLListenerDescriptor;

/** Type guard to check if the passed function is typeof {@link ESLListenerDescriptorFn} */
export const isDescriptorFn = (obj: any): obj is ESLListenerDescriptorFn => typeof obj === 'function' && typeof obj.event === 'string';

const STORE = '__listeners'; // '__events'

export class ESLEventListener implements ESLListenerDescriptor {
  public $host: HTMLElement;
  public readonly id: string;
  public readonly event: string;
  public readonly capture?: boolean;
  public readonly match?: string;
  public readonly target?: string | Element | Document | Window;

  constructor(
    public readonly handler: ESLListenerHandler,
    desc: ESLListenerDescriptor | string
  ) {
    desc = typeof desc === 'string' ? {event: desc} : desc;
    Object.assign(this, {capture: false}, desc);
    this.id = this.id || sequentialUID('esl.event');
    this.handle = this.handle.bind(this);
  }

  /** @returns target element to listen */
  public get $targets(): HTMLElement[] | [Element | Document | Window] {
    if (this.target instanceof Document || this.target instanceof Element || this.target instanceof Window) {
      return [this.target];
    }
    return TraversingQuery.all(this.target || '', this.$host) as HTMLElement[];
  }

  // rename
  public equal(desc?: Partial<ESLListenerDescriptor> | ESLListenerHandler | string): boolean {
    if (typeof desc === 'function') return this.handler === desc;
    if (typeof desc === 'string') return this.event === desc;
    if (typeof desc === 'object') return isSimilar(this, desc);
    return true;
  }

  // rename
  public accept(e: Event): boolean {
    if (typeof this.match !== 'string') return true;
    const target = e.target;
    const current = e.currentTarget;
    if (!(target instanceof HTMLElement) || !(current instanceof HTMLElement)) return false;
    return current.contains(target.closest(this.match));
  }

  public handle(e: Event): void {
    if (this.accept(e)) this.handler.call(this.$host, e, this);
  }

  public subscribe(target: HTMLElement): void {
    this.$host = target === undefined ? this.$host : target;
    this.$targets.forEach((el: HTMLElement) => el.addEventListener(this.event, this.handle, this.capture));
    ESLEventListener.get(this.$host).push(this);
  }

  public unsubscribe(): void {
    this.$targets.forEach((el: HTMLElement) => el.removeEventListener(this.event, this.handle, this.capture));
    const listeners = ESLEventListener.get(this.$host);
    const value = listeners.filter((listener) => listener !== this);
    Object.defineProperty(this.$host, STORE, {value, configurable: true});
  }

  /** Get listeners array by the target object */
  public static get(target?: any): ESLEventListener[] {
    if (!target) return [];
    if (!Object.hasOwnProperty.call(target, STORE)) target[STORE] = [];
    return target[STORE];
  }
}
