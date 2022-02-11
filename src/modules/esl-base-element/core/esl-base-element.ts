import {EventUtils} from '../../esl-utils/dom/events';
import {CSSClassUtils} from '../../esl-utils/dom/class';

/**
 * Base class for ESL custom elements.
 * Allows defining custom element with the optional custom tag name.
 */
export abstract class ESLBaseElement extends HTMLElement {
  /** Custom element tag name */
  public static is = '';

  protected _connected: boolean = false;

  protected connectedCallback(): void {
    this._connected = true;
    this.classList.add((this.constructor as typeof ESLBaseElement).is);
  }
  protected disconnectedCallback(): void {
    this._connected = false;
  }

  /** Check that the element is connected and `connectedCallback` has been executed */
  public get connected(): boolean {
    return this._connected;
  }

  /** Set CSS classes for current element */
  public $$cls(cls: string, value?: boolean): boolean {
    if (value === undefined) return CSSClassUtils.has(this, cls);
    CSSClassUtils.toggle(this, cls, value);
    return value;
  }
  // /** Get if passed CSS classes presented on the current element */
  // public $$hasCls(cls: string): boolean {
  //   return CSSClassUtils.has(this, cls);
  // }

  /** Get or set attribute */
  public $$attr(name: string, value?: null | boolean | string): string | null {
    const prevValue = this.getAttribute(name);
    if (value === undefined) return prevValue;
    if (value === null || value === false) {
      this.removeAttribute(name);
    } else {
      this.setAttribute(name, value === true ? '' : value);
    }
    return prevValue;
  }
  // /** Get if passed attribute presented on the current element */
  // public $$hasAttr(name: string) {
  //   return this.hasAttribute(name);
  // }

  /**
   * Dispatch component custom event.
   * Uses 'esl:' prefix for event name, overridable to customize event namespaces.
   * @param eventName - event name
   * @param eventInit - custom event init. See {@link CustomEventInit}
   */
  public $$fire(eventName: string, eventInit?: CustomEventInit): boolean {
    return EventUtils.dispatch(this, 'esl:' + eventName, eventInit);
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

  public static get registered(): Promise<CustomElementConstructor> {
    return customElements.whenDefined(this.is);
  }
}
