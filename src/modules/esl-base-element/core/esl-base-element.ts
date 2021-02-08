/**
 * Base class for ESL custom elements.
 * Allows to define custom element with the optional custom tag name.
 */
import {EventUtils} from '../../esl-utils/dom/events';

export abstract class ESLBaseElement extends HTMLElement {
  /** Custom element tag name */
  public static is = '';

  protected _connected: boolean = false;

  protected connectedCallback() {
    this._connected = true;
    this.classList.add((this.constructor as typeof ESLBaseElement).is);
  }
  protected disconnectedCallback() {
    this._connected = false;
  }

  /**
   * Check that element is connected and connectedCallback has been executed.
   */
  public get connected() {
    return this._connected;
  }

  /**
   * Dispatch component custom event.
   * Uses 'esl:' prefix for event name, overridable to customize event namespaces.
   * @param eventName - event name
   * @param [eventInit] - custom event init. See {@link CustomEventInit}
   */
  public $$fire(eventName: string, eventInit?: CustomEventInit): boolean {
    return EventUtils.dispatch(this, 'esl:' + eventName, eventInit);
  }

  /**
   * Register component in the {@link customElements} registry
   * @param [tagName] - custom tag name to register custom element
   */
  public static register(this: typeof ESLBaseElement, tagName?: string) {
    tagName = tagName || this.is;
    if (!tagName) throw new Error('Can not define custom element');
    const constructor = customElements.get(tagName);
    if (constructor) {
      if (constructor.is !== tagName) throw new Error('Element declaration tag inconsistency');
      return;
    }
    if (this.is !== tagName) {
      this.is = tagName;
    }
    customElements.define(tagName, this as any as CustomElementConstructor);
  }
}
