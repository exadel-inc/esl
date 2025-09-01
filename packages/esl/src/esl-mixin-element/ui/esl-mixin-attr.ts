import {ESLMixinRegistry} from './esl-mixin-registry';
import type {ESLMixinElement, ESLMixinElementInternal} from './esl-mixin-element';

// TODO: fix duplicate in separate scopes (non-critical as only one instance per mixin type is created)
// Singleton cache for ESLMixinAttributesObserver instances
const instances = new Map<string, ESLMixinAttributesObserver>();

/**
 * Internal {@link ESLMixinElement}s observedAttributes mutation listener.
 * Creates a single instance per mixin type
 * Ignores mixin primary attribute changes (they are observed by {@link ESLMixinRegistry} ootb)
 */
export class ESLMixinAttributesObserver {
  protected observer = new MutationObserver(
    (records: MutationRecord[]) => records.forEach(this.handleRecord, this)
  );

  private constructor(protected readonly type: string) {
    if (instances.has(type)) return instances.get(type)!;
    instances.set(type, this);
  }

  /** Processes single mutation record */
  protected handleRecord(record: MutationRecord): void {
    const name = record.attributeName;
    const target = record.target as HTMLElement;
    if (!name || !target) return;
    const mixin = ESLMixinRegistry.get(target, this.type) as ESLMixinElementInternal;
    mixin && mixin.attributeChangedCallback(name, record.oldValue, target.getAttribute(name));
  }

  /** Subscribes to the {@link ESLMixinElement} host instance mutations */
  public observe(mixin: ESLMixinElement): void {
    const {is, observedAttributes} = mixin.constructor as typeof ESLMixinElement;
    const attributeFilter = observedAttributes.filter((name: string) => name !== is);
    if (!attributeFilter.length) return;
    this.observer.observe(mixin.$host, {
      attributes: true,
      attributeFilter,
      attributeOldValue: true
    });
  }

  /** Unsubscribes from the {@link ESLMixinElement} host instance mutations */
  public unobserve(mixin: ESLMixinElement): void {
    this.observer.observe(mixin.$host, {
      attributes: true,
      attributeFilter: []
    });
  }

  private static instanceFor(mixin: ESLMixinElement): ESLMixinAttributesObserver | null {
    const {is, observedAttributes} = mixin.constructor as typeof ESLMixinElement;
    const attributes = (observedAttributes || []).filter((name: string) => name !== is);
    if (!is || !attributes.length) return null;
    return new ESLMixinAttributesObserver(is);
  }

  /** Subscribes to the {@link ESLMixinElement} host instance mutations */
  public static observe(mixin: ESLMixinElement): void {
    const observer = this.instanceFor(mixin);
    observer && observer.observe(mixin);
  }

  /** Unsubscribes from the {@link ESLMixinElement} host instance mutations */
  public static unobserve(mixin: ESLMixinElement): void {
    const observer = this.instanceFor(mixin);
    observer && observer.unobserve(mixin);
  }
}
