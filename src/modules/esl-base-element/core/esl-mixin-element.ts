import {ESLMixinRegistry} from './esl-mixin-registry';

/** Base class for mixin element that attaches to the dom element via attribute */
export class ESLMixinElement {
  /** Root attribute to identify mixin targets. Should contain dash in the name. */
  static is: string;
  /** Additional observed attributes */
  static observedAttributes: string[] = [];

  /** Additional attributes observer */
  private __attr$$: MutationObserver;

  public constructor(
    public readonly $root: HTMLElement
  ) {}

  /** Callback of mixin instance initialization */
  public connectedCallback(): void {
    const constructor = this.constructor as typeof ESLMixinElement;
    if (constructor.observedAttributes.length) {
      this.__attr$$ = new MutationObserver(([record]) => {
        if (!record.attributeName || !record.target) return;
        const value = this.getAttribute(record.attributeName);
        this.attributeChangedCallback(record.attributeName, record.oldValue, value);
      });
      this.__attr$$.observe(this.$root, {attributes: true, attributeFilter: constructor.observedAttributes});
    }
  }
  /** Callback to execute on mixin instance destroy */
  public disconnectedCallback(): void {
    if (this.__attr$$) this.__attr$$.disconnect();
  }
  /** Callback to handle additional attributes change */
  public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {}

  /** Proxy for {@link Element.prototype.hasAttribute} */
  public hasAttribute(attr: string): boolean {
    return this.$root.hasAttribute(attr);
  }
  /** Proxy for {@link Element.prototype.getAttribute} */
  public getAttribute(attr: string): string | null {
    return this.$root.getAttribute(attr);
  }
  /** Proxy for {@link Element.prototype.setAttribute} */
  public setAttribute(attr: string, value: string): void {
    this.$root.setAttribute(attr, value);
  }
  /** Proxy for {@link Element.prototype.toggleAttribute} */
  public toggleAttribute(attr: string, force?: boolean): boolean {
    return this.$root.toggleAttribute(attr, force);
  }

  /** Register current mixin definition */
  public static register(): void {
    (new ESLMixinRegistry()).register(this);
  }
}

export type ConstructableESLMixin = typeof ESLMixinElement & (new($root: HTMLElement) => ESLMixinElement);
