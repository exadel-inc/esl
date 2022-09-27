import {setAttr} from '../../esl-utils/dom/attr';
import {prop} from '../../esl-utils/decorators';
import {ESLEventUtils} from '../../esl-utils/dom/events';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLMixinRegistry} from './esl-mixin-registry';

import type {AttributeTarget} from '../../esl-utils/dom/attr';
import type {
  ESLEventListener,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerEventMap,
  ESLListenerHandler
} from '../../esl-utils/dom/events';

/**
 * Base class for mixin elements.
 * Mixin elements attaches to the DOM element via attribute.
 * Allows multiple mixin elements per one DOM element
 */
export class ESLMixinElement implements AttributeTarget {
  /** Root attribute to identify mixin targets. Should contain dash in the name. */
  static is: string;
  /** Additional observed attributes */
  static observedAttributes: string[] = [];

  /** Event to indicate component significant state change that may affect other components state */
  @prop('esl:refresh') public REFRESH_EVENT: string;

  /** Additional attributes observer */
  private _attr$$: MutationObserver;

  public constructor(
    public readonly $host: HTMLElement
  ) {}

  /** Callback of mixin instance initialization */
  public connectedCallback(): void {
    const constructor = this.constructor as typeof ESLMixinElement;
    if (constructor.observedAttributes.length) {
      this._attr$$ = new MutationObserver(this._onAttrMutation.bind(this));
      this._attr$$.observe(this.$host, {attributes: true, attributeFilter: constructor.observedAttributes});
    }

    ESLEventUtils.descriptors(this)
      .forEach((desc) => ESLEventUtils.subscribe(this.$host, {context: this}, desc));
  }

  /** Callback to execute on mixin instance destroy */
  public disconnectedCallback(): void {
    if (this._attr$$) this._attr$$.disconnect();

    ESLEventUtils.unsubscribe(this.$host, {context: this});
  }

  /** Callback to handle changing of additional attributes */
  public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {}

  /** Attribute change mutation record processor */
  private _onAttrMutation(records: MutationRecord[]): void {
    records.forEach(({attributeName, oldValue}: MutationRecord) => {
      if (!attributeName) return;
      const newValue = this.$$attr(attributeName);
      this.attributeChangedCallback(attributeName, oldValue, newValue);
    });
  }

  /** Subscribes `handler` method marked with `@listen` decorator */
  public $$on(handler: ESLListenerHandler): ESLEventListener[];
  /** Subscribes `handler` function by the passed DOM event descriptor {@link ESLListenerDescriptor} or event name */
  public $$on<EType extends keyof ESLListenerEventMap>(
    event: EType | ESLListenerDescriptor<EType>,
    handler: ESLListenerHandler<ESLListenerEventMap[EType]>
  ): ESLEventListener[];
  public $$on(event: any, handler?: any): ESLEventListener[] {
    event = Object.assign(typeof event === 'string' ? {event} : event, {context: this});
    return ESLEventUtils.subscribe(this.$host, event, handler);
  }

  /** Unsubscribes event listener */
  public $$off(...condition: ESLListenerCriteria[]): ESLEventListener[] {
    return ESLEventUtils.unsubscribe(this.$host, {context: this}, ...condition);
  }

  /**
   * Gets or sets CSS classes for the `$host`
   * @param cls - CSS classes query {@link CSSClassUtils}
   * @param value - boolean to set CSS class(es) state or undefined to skip mutation
   * @returns current classes state or passed state
   */
  public $$cls(cls: string, value?: boolean): boolean {
    if (value === undefined) return CSSClassUtils.has(this.$host, cls);
    CSSClassUtils.toggle(this.$host, cls, value);
    return value;
  }

  /**
   * Gets or sets attribute for the `$host`.
   * If the `value` param is undefined then skips mutation.
   * @param name - attribute name
   * @param value - string attribute value, boolean attribute state or `null` to delete attribute
   * @returns current attribute value or previous value for mutation
   */
  public $$attr(name: string, value?: null | boolean | string): string | null {
    const prevValue = this.$host.getAttribute(name);
    if (value !== undefined) setAttr(this, name, value);
    return prevValue;
  }

  /**
   * Dispatches component custom event on the `$host`.
   * Uses 'esl:' prefix for event name, overridable to customize event namespaces.
   * @param eventName - event name
   * @param eventInit - custom event init. See {@link CustomEventInit}
   */
  public $$fire(eventName: string, eventInit?: CustomEventInit): boolean {
    return ESLEventUtils.dispatch(this.$host, eventName, eventInit);
  }

  /** Returns mixin instance by element */
  public static get<T extends typeof ESLMixinElement>(this: T, $el: HTMLElement): InstanceType<T> | null {
    return ESLMixinRegistry.get($el, this.is) as InstanceType<T>;
  }
  /** Register current mixin definition */
  public static register(): void {
    (new ESLMixinRegistry()).register(this);
  }
}

export type ConstructableESLMixin = typeof ESLMixinElement & (new($root: HTMLElement) => ESLMixinElement);
