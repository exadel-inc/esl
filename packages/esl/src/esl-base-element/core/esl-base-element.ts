import {setAttr} from '../../esl-utils/dom/attr';
import {prop} from '../../esl-utils/decorators';
import {ESLEventUtils} from '../../esl-utils/dom/events';
import {CSSClassUtils} from '../../esl-utils/dom/class';

import type {
  ESLEventName,
  ESLEventListener,
  ESLListenerHandler,
  ESLListenerCriteria,
  ESLListenerDescriptor
} from '../../esl-utils/dom/events';
import type {ESLBaseComponent} from '../../esl-utils/abstract/component';

/** Finalize tag name (`is`) for passed ESLBaseElement-based class */
const finalize = (type: typeof ESLBaseElement, tagName: string): void => {
  Object.defineProperty(type, 'is', {
    get: () => tagName,
    set(value) {
      if (this === type) throw Error(`[ESL]: Cannot override ${type.name}.is property, the class is already registered`);
      Object.defineProperty(this, 'is', {value, writable: true, configurable: true});
    }
  });
};

/**
 * Base class for ESL custom elements
 * Allows defining custom element with the optional custom tag name
 */
export abstract class ESLBaseElement extends HTMLElement implements ESLBaseComponent {
  /** Custom element tag name */
  public static is = '';

  /** Event to indicate component significant state change that may affect other components state */
  @prop('esl:refresh') public REFRESH_EVENT: string;

  protected _connected: boolean = false;

  /** @returns custom element tag name */
  public get baseTagName(): string {
    return (this.constructor as typeof ESLBaseElement).is;
  }

  protected connectedCallback(): void {
    this._connected = true;
    this.classList.add(this.baseTagName);

    // Automatic subscription happens only if the element is currently in the DOM
    if (this.isConnected) ESLEventUtils.subscribe(this);
  }
  protected disconnectedCallback(): void {
    this._connected = false;

    ESLEventUtils.unsubscribe(this);
  }

  /**
   * Callback to handle changing of element attributes.
   * Happens when attribute accessed for writing independently of the actual value change
   */
  protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {}

  /** Checks that the element's `connectedCallback` has been executed */
  public get connected(): boolean {
    return this._connected;
  }

  /** Subscribes (or resubscribes) all known descriptors that matches criteria */
  public $$on(criteria: ESLListenerCriteria): ESLEventListener[];
  /** Subscribes `handler` method marked with `@listen` decorator */
  public $$on(handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function by the passed DOM event descriptor {@link ESLListenerDescriptor} or event name */
  public $$on<EName extends ESLEventName>(
    event: EName | ESLListenerDescriptor<EName>,
    handler: ESLListenerHandler<EName>
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
    if (!tagName) throw new DOMException('[ESL]: Incorrect tag name', 'NotSupportedError');
    const constructor: any = customElements.get(tagName);
    if (constructor && (constructor !== this || constructor.is !== tagName)) {
      throw new DOMException('[ESL]: Element tag already occupied or inconsistent', 'NotSupportedError');
    }
    if (constructor) return;
    finalize(this, tagName);
    customElements.define(tagName, this as any as CustomElementConstructor);
  }

  /** Shortcut for `customElements.whenDefined(currentCustomElement)` */
  public static get registered(): Promise<CustomElementConstructor> {
    return customElements.whenDefined(this.is);
  }

  /** Creates an instance of the current custom element */
  public static create<T extends typeof ESLBaseElement>(this: T): InstanceType<T>;
  /** General signature of {@link create} to allow simplified overrides of the method */
  public static create(this: typeof ESLBaseElement): ESLBaseElement;
  public static create<T extends typeof ESLBaseElement>(this: T): InstanceType<T> {
    return document.createElement(this.is) as InstanceType<T>;
  }
}
