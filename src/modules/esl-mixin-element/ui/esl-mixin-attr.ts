import {ESLMixinRegistry} from './esl-mixin-registry';
import type {ESLMixinElement, ESLMixinElementInternal} from './esl-mixin-element';

const instances = new Map<string, ESLMixinAttributesObserver>();
export class ESLMixinAttributesObserver {
  protected observer = new MutationObserver(
    (records: MutationRecord[]) => records.forEach(this.handleRecord, this)
  );

  private constructor(protected readonly type: string) {
    if (instances.has(type)) return instances.get(type)!;
    instances.set(type, this);
  }

  protected handleRecord(record: MutationRecord): void {
    const name = record.attributeName;
    const target = record.target as HTMLElement;
    if (!name || !target) return;
    const mixin = ESLMixinRegistry.get(target, this.type) as ESLMixinElementInternal;
    mixin && mixin.attributeChangedCallback(name, record.oldValue, target.getAttribute(name));
  }

  public observe(mixin: ESLMixinElement): void {
    const {observedAttributes} = mixin.constructor as typeof ESLMixinElement;
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

  private static instanceFor(mixin: ESLMixinElement): ESLMixinAttributesObserver | null {
    const type = mixin.constructor as typeof ESLMixinElement;
    if (!type.is || !type.observedAttributes || !type.observedAttributes.length) return null;
    return new ESLMixinAttributesObserver(type.is);
  }

  public static observe(mixin: ESLMixinElement): void {
    const observer = this.instanceFor(mixin);
    observer && observer.observe(mixin);
  }

  public static unobserve(mixin: ESLMixinElement): void {
    const observer = this.instanceFor(mixin);
    observer && observer.unobserve(mixin);
  }
}
