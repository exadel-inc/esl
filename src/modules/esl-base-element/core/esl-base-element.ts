import {setAttr} from '../../esl-utils/dom/attr';
import {prop} from '../../esl-utils/decorators';
import {ESLEventUtils} from '../../esl-utils/dom/events';
import {CSSClassUtils} from '../../esl-utils/dom/class';

import type {
  ESLEventListener,
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerEventMap,
  ESLListenerDescriptor
} from '../../esl-utils/dom/events';

/**
 * Base class for ESL custom elements
 * Allows defining custom element with the optional custom tag name
 */
export abstract class ESLBaseElement extends HTMLElement {
  /** Custom element tag name */
  public static is = '';

  /** Event to indicate component significant state change that may affect other components state */
  @prop('esl:refresh') public REFRESH_EVENT: string;

  protected _connected: boolean = false;

  protected connectedCallback(): void {
    this._connected = true;
    this.classList.add((this.constructor as typeof ESLBaseElement).is);

    ESLEventUtils.descriptors(this).forEach((desc) => ESLEventUtils.subscribe(this, desc));
  }
  protected disconnectedCallback(): void {
    this._connected = false;

    ESLEventUtils.unsubscribe(this);
  }

  /** Check that the element is connected and `connectedCallback` has been executed */
  public get connected(): boolean {
    return this._connected;
  }

  /** Subscribes `handler` method marked with `@listen` decorator */
  public $$on(handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function by the passed DOM event descriptor {@link ESLListenerDescriptor} or event name */
  public $$on<EType extends keyof ESLListenerEventMap>(
    event: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  public $$on(event: any, handler?: any): ESLEventListener[] {
    return ESLEventUtils.subscribe(this, event, handler);
  }

  /** Unsubscribes event listener */
  public $$off(...condition: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventUtils.unsubscribe(this, ...condition);
  }

  /**
   * Gets or sets CSS classes for the current element.
   * @param cls - CSS classes query {@link CSSClassUtils}
   * @param value - boolean to set CSS class(es) state or undefined to skip mutation
   * @returns current classes state or passed state
   */
  public $$cls(cls: string, value?: boolean): boolean {
    if (value === undefined) return CSSClassUtils.has(this, cls);
    CSSClassUtils.toggle(this, cls, value);
    return value;
  }

  /**
   * Gets or sets an attribute for the current element.
   * If the `value` param is undefined then skips mutation.
   * @param name - attribute name
   * @param value - string attribute value, boolean attribute state or `null` to delete attribute
   * @returns the current attribute value or previous value for mutation
   */
  public $$attr(name: string, value?: null | boolean | string): string | null {
    const prevValue = this.getAttribute(name);
    if (value !== undefined) setAttr(this, name, value);
    return prevValue;
  }

  /**
   * Dispatches component custom event.
   * @param eventName - event name
   * @param eventInit - custom event init. See {@link CustomEventInit}
   */
  public $$fire(eventName: string, eventInit?: CustomEventInit): boolean {
    return ESLEventUtils.dispatch(this, eventName, eventInit);
  }

  /**
   * Register component in the {@link customElements} registry
   * @param tagName - custom tag name to register custom element
   */
  public static register(this: typeof ESLBaseElement, tagName?: string): void {
    tagName = tagName || this.is;
    if (!tagName) throw new Error('Can not define custom element');
    const constructor: any = customElements.get(tagName);
    if (constructor) {
      if (constructor.is !== tagName) throw new Error('Element declaration tag inconsistency');
      return;
    }
    if (this.is !== tagName) {
      this.is = tagName;
    }
    customElements.define(tagName, this as any as CustomElementConstructor);
  }

  /** Shortcut for `customElements.whenDefined(currentCustomElement)` */
  public static get registered(): Promise<CustomElementConstructor> {
    return customElements.whenDefined(this.is);
  }

  /** Creates an instance of the current custom element */
  public static create<T extends typeof ESLBaseElement>(this: T): InstanceType<T> {
    return document.createElement(this.is) as InstanceType<T>;
  }

}
