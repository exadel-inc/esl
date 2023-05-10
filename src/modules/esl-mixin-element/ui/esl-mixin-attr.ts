import {ESLMixinRegistry} from './esl-mixin-registry';
import type {ESLMixinElement, ESLMixinElementInternal} from './esl-mixin-element';

let instance: ESLMixinAttributesObserver;
export class ESLMixinAttributesObserver {
  protected observer = new MutationObserver(
    (records: MutationRecord[]) => records.forEach(this.handleRecord, this)
  );

  constructor() {
    if (instance) return instance;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    instance = this;
  }

  protected handleRecord(record: MutationRecord): void {
    const name = record.attributeName;
    const target = record.target as HTMLElement;
    if (!name || !target) return;
    const mixins = ESLMixinRegistry.getAll(target) as ESLMixinElementInternal[];
    for (const mixin of mixins) {
      const observed = (mixin.constructor as typeof ESLMixinElement).observedAttributes;
      if (!observed.includes(record.attributeName)) return;
      mixin.attributeChangedCallback(name, record.oldValue, target.getAttribute(name));
    }
  }

  public observe(mixin: ESLMixinElement): void {
    const {observedAttributes} = mixin.constructor as typeof ESLMixinElement;
    if (!observedAttributes.length) return;
    this.observer.observe(mixin.$host, {
      attributes: true,
      attributeFilter: observedAttributes,
      attributeOldValue: true
    });
  }

  public unobserve(mixin: ESLMixinElement): void {
    this.observer.observe(mixin.$host, {
      attributes: true,
      attributeFilter: [],
      attributeOldValue: true
    });
  }
}
