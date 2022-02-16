import {setAttr} from '../../esl-utils/dom/attr';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLMixinRegistry} from './esl-mixin-registry';

/** Base class for mixin element that attaches to the dom element via attribute */
export class ESLMixinElement {
  /** Root attribute to identify mixin targets. Should contain dash in the name. */
  static is: string;
  /** Additional observed attributes */
  static observedAttributes: string[] = [];

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
  }
  /** Callback to execute on mixin instance destroy */
  public disconnectedCallback(): void {
    if (this._attr$$) this._attr$$.disconnect();
  }
  /** Callback to handle changing of additional attributes */
  public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {}

  /** Attribute change mutation record processor */
  private _onAttrMutation(records: MutationRecord[]): void {
    records.forEach(({attributeName, oldValue}: MutationRecord) => {
      if (!attributeName) return;
      const newValue = this.$host.getAttribute(attributeName);
      this.attributeChangedCallback(attributeName, oldValue, newValue);
    });
  }

  /** Set CSS classes for current element */
  public $$cls(cls: string, value?: boolean): boolean {
    if (value === undefined) return CSSClassUtils.has(this.$host, cls);
    CSSClassUtils.toggle(this.$host, cls, value);
    return value;
  }

  /** Get or set attribute */
  public $$attr(name: string, value?: null | boolean | string): string | null {
    const prevValue = this.$host.getAttribute(name);
    if (value !== undefined) setAttr(this, name, value);
    return prevValue;
  }

  /** Return mixin instance by element */
  public static get<T extends typeof ESLMixinElement>(this: T, $el: HTMLElement): InstanceType<T> | null {
    return ESLMixinRegistry.get($el, this.is) as InstanceType<T>;
  }
  /** Register current mixin definition */
  public static register(): void {
    (new ESLMixinRegistry()).register(this);
  }
}

export type ConstructableESLMixin = typeof ESLMixinElement & (new($root: HTMLElement) => ESLMixinElement);
