import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLMixinRegistry} from './esl-mixin-registry';

/**
 * Base class for mixin element that attaches to the dom element via attribute
 */
export class ESLMixinElement {
  static is: string;
  static observedAttributes: string[] = [];

  private __attr$$: MutationObserver;

  constructor(public readonly $root: HTMLElement) {}

  public connectedCallback(): void {
    console.info(`Mixin ${(this.constructor as any).is} initialized on `, this.$root);
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
  public disconnectedCallback(): void {
    console.info(`Mixin ${(this.constructor as any).is} removed from `, this.$root);
    if (this.__attr$$) this.__attr$$.disconnect();
  }
  public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {}

  public hasAttribute(attr: string): boolean {
    return this.$root.hasAttribute(attr);
  }
  public getAttribute(attr: string): string | null {
    return this.$root.getAttribute(attr);
  }
  public setAttribute(attr: string, value: string): void {
    this.$root.setAttribute(attr, value);
  }
  public toggleAttribute(attr: string, force?: boolean): boolean {
    return this.$root.toggleAttribute(attr, force);
  }

  @memoize()
  protected static get registry(): ESLMixinRegistry {
    return new ESLMixinRegistry();
  }
  public static register(): void {
    this.registry.register(this);
  }
}

export type ConstructableESLMixin = typeof ESLMixinElement & (new($root: HTMLElement) => ESLMixinElement);
