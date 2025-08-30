import {prop} from '../../esl-utils/decorators';
import {setAttr} from '../../esl-utils/dom/attr';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLEventUtils} from '../../esl-utils/dom/events';
import {CSSClassUtils} from '../../esl-utils/dom/class';

import {ESLMixinRegistry} from './esl-mixin-registry';
import {ESLMixinAttributesObserver} from './esl-mixin-attr';

import type {
  ESLEventName,
  ESLEventListener,
  ESLListenerCriteria,
  ESLListenerDescriptor,
  ESLListenerHandler
} from '../../esl-utils/dom/events';
import type {ESLBaseComponent} from '../../esl-utils/abstract/component';
import type {ESLDomElementRelated} from '../../esl-utils/abstract/dom-target';

/**
 * Base class for mixin elements.
 * Mixin elements attaches to the DOM element via attribute.
 * Allows multiple mixin elements per one DOM element
 */
@ExportNs('Mixin')
export class ESLMixinElement implements ESLBaseComponent, ESLDomElementRelated {
  /** Root attribute to identify mixin targets. Should contain dash in the name. */
  static is: string;
  /** Additional observed attributes */
  static observedAttributes: string[] = [];

  /** Event to indicate component significant state change that may affect other components state */
  @prop('esl:refresh') public REFRESH_EVENT: string;

  public constructor(
    public readonly $host: HTMLElement
  ) {}

  /** Callback of mixin instance initialization */
  protected connectedCallback(): void {
    ESLMixinAttributesObserver.observe(this);
    ESLEventUtils.subscribe(this);
  }

  /** Callback to execute on mixin instance destroy */
  protected disconnectedCallback(): void {
    ESLMixinAttributesObserver.unobserve(this);
    ESLEventUtils.unsubscribe(this);
  }

  /**
   * Callback to handle changing of additional attributes.
   * Happens when attribute accessed for writing independently of the actual value change
   */
  protected attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {}

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

  /** Default error logger for `@safe` decorator */
  public $$error(error: Error | string): void {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ESL] ${(this.constructor as typeof ESLMixinElement).is}(%o): %s`, this.$host, message);
  }

  /** Register current mixin definition */
  public static register(): void {
    (new ESLMixinRegistry()).register(this);
  }

  // Public Registry API
  public static readonly get = ESLMixinRegistry.get;
  public static readonly getAll = ESLMixinRegistry.getAll;
}

export type ESLMixinElementInternal = ESLMixinElement & {
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
};

export type ESLMixinElementConstructable = typeof ESLMixinElement & (new($root: HTMLElement) => ESLMixinElement);
