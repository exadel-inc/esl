import {bind} from '../../esl-utils/decorators/bind';
import type {ESLMixinElement, ConstructableESLMixin} from './esl-mixin-element';

const STORE = '__mixin';

export class ESLMixinRegistry {
  protected store = new Map<string, ConstructableESLMixin>();
  protected observer = new MutationObserver(this.onMutation);

  public get observedAttributes(): string[] {
    const attrs: string[] = [];
    this.store.forEach((mixin, name) => attrs.push(name));
    return attrs;
  }

  public register(mixin: ConstructableESLMixin): void {
    if (this.store.has(mixin.is) && this.store.get(mixin.is) !== mixin) throw Error(`[ESL]: Attribute ${mixin.is} reserved by another instance`);
    this.store.set(mixin.is, mixin);
    this.invalidateRecursive();

    this.observer.disconnect();
    this.observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: this.observedAttributes
    });
  }

  @bind
  public onMutation(mutations: MutationRecord[]): void {
    mutations.forEach((record: MutationRecord) => {
      if (record.type === 'attributes' && record.attributeName && this.store.has(record.attributeName)) {
        this.invalidate(record.target as HTMLElement, record.attributeName);
      }
      if (record.type === 'childList') {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) this.invalidateRecursive(node as HTMLElement);
        });
        record.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) this.destroyAll(node as HTMLElement);
        });
      }
    });
  }

  public invalidateRecursive(root: HTMLElement = document.body): void {
    if (!root) return;
    this.invalidateAll(root);
    Array.prototype.forEach.call(root.children, (child: Element) => this.invalidateRecursive(child as HTMLElement));
  }
  public invalidateAll(el: HTMLElement): void {
    const hasStore = Object.hasOwnProperty.call(el, STORE);
    this.store.forEach((mixin: ConstructableESLMixin, name: string) => {
      if (el.hasAttribute(name)) {
        ESLMixinRegistry.init(el, mixin);
      } else if (hasStore) {
        ESLMixinRegistry.destroy(el, name);
      }
    });
  }
  public invalidate(el: HTMLElement, mixin: string): void {
    if (el.hasAttribute(mixin)) {
      const mixinType = this.store.get(mixin);
      mixinType && ESLMixinRegistry.init(el, mixinType);
    } else {
      ESLMixinRegistry.destroy(el, mixin);
    }
  }

  public destroy(el: HTMLElement, mixin: string | ConstructableESLMixin | undefined): void {
    if (typeof mixin === 'string') mixin = this.store.get(mixin);
    if (!mixin) return;
    const current = ESLMixinRegistry.get(el, mixin.is);
    if (current) current.disconnectedCallback();
  }
  public destroyAll(el: HTMLElement): void {
    const store = (el as any).__mixins as Record<string, ESLMixinElement> | undefined;
    store && Object.keys(store).forEach((name) => ESLMixinRegistry.destroy(el, name));
  }

  public static get(el: HTMLElement, mixin: string): ESLMixinElement | null {
    const store = (el as any).__mixins as Record<string, ESLMixinElement> | undefined;
    return (store && store[mixin]) || null;
  }
  public static has(el: HTMLElement, mixin: string): boolean {
    return !!this.get(el, mixin);
  }
  private static set(el: HTMLElement, mixin: ESLMixinElement): void {
    if (!Object.hasOwnProperty.call(el, STORE)) Object.defineProperty(el, STORE, {value: {}, configurable: true});
    const store = (el as any)[STORE] as Record<string, ESLMixinElement>;
    store[(mixin.constructor as ConstructableESLMixin).is] = mixin;
  }
  private static init(el: HTMLElement, Mixin: ConstructableESLMixin): ESLMixinElement | null {
    if (this.has(el, Mixin.is)) return null;
    const instance = new Mixin(el);
    ESLMixinRegistry.set(el, instance);
    instance.connectedCallback();
    return instance;
  }
  private static destroy(el: HTMLElement, mixin: string): void {
    const store = (el as any)[STORE] as Record<string, ESLMixinElement>;
    if (!store) return;
    const instance = store[mixin];
    if (!instance) return;
    instance.disconnectedCallback();
    delete store[mixin];
  }
}
