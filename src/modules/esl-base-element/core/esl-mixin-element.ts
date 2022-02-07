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
    public readonly $root: HTMLElement
  ) {}

  /** Callback of mixin instance initialization */
  public connectedCallback(): void {
    const constructor = this.constructor as typeof ESLMixinElement;
    if (constructor.observedAttributes.length) {
      this._attr$$ = new MutationObserver(this._onAttrMutation.bind(this));
      this._attr$$.observe(this.$root, {attributes: true, attributeFilter: constructor.observedAttributes});
    }
  }
  /** Callback to execute on mixin instance destroy */
  public disconnectedCallback(): void {
    if (this._attr$$) this._attr$$.disconnect();
  }
  /** Callback to handle changing of additional attributes */
  public attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {}

  /** Proxy for {@link Element.prototype.hasAttribute} */
  public readonly hasAttribute: typeof Element.prototype.hasAttribute;
  /** Proxy for {@link Element.prototype.getAttribute} */
  public readonly getAttribute: typeof Element.prototype.getAttribute;
  /** Proxy for {@link Element.prototype.setAttribute} */
  public readonly setAttribute: typeof Element.prototype.setAttribute;
  /** Proxy for {@link Element.prototype.removeAttribute} */
  public readonly removeAttribute: typeof Element.prototype.removeAttribute;
  /** Proxy for {@link Element.prototype.toggleAttribute} */
  public readonly toggleAttribute: typeof Element.prototype.toggleAttribute;

  /** Attribute change mutation record processor */
  private _onAttrMutation(records: MutationRecord[]): void {
    records.forEach(({attributeName, oldValue}: MutationRecord) => {
      if (!attributeName) return;
      const newValue = this.getAttribute(attributeName);
      this.attributeChangedCallback(attributeName, oldValue, newValue);
    });
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

['hasAttribute', 'getAttribute', 'setAttribute', 'removeAttribute', 'toggleAttribute'].forEach((methodName: string) => {
  Object.defineProperty(ESLMixinElement.prototype, methodName, {
    configurable: true,
    value(this: ESLMixinElement) {
      // eslint-disable-next-line prefer-rest-params
      return (Element.prototype as any)[methodName].apply(this.$root, arguments);
    }
  });
});

export type ConstructableESLMixin = typeof ESLMixinElement & (new($root: HTMLElement) => ESLMixinElement);
