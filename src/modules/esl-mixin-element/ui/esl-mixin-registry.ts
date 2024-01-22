import type {
  ESLMixinElement,
  ESLMixinElementInternal,
  ESLMixinElementConstructable
} from './esl-mixin-element';

// Private key to store mixin instances
const STORE = (window.Symbol || String)('__esl_mixins');

// Singleton for registry
let global: ESLMixinRegistry;

/** Registry to store and initialize {@link ESLMixinElement} instances */
export class ESLMixinRegistry {
  /** Map that stores available mixins under their identifier (attribute) */
  protected store = new Map<string, ESLMixinElementConstructable>();
  /** MutationObserver instance to track DOM changes and init mixins on-fly */
  protected mutation$$ = new MutationObserver(this._onMutation.bind(this));

  public constructor() {
    if (global) return global;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    global = this;
  }

  /** Array of registered mixin tags */
  public get observedAttributes(): string[] {
    const attrs: string[] = [];
    this.store.forEach((mixin, name) => attrs.push(name));
    return attrs;
  }

  /** Registers mixin definition using {@link ESLMixinElement} constructor */
  public register(mixin: ESLMixinElementConstructable): void {
    if (!mixin.is || mixin.is.indexOf('-') === -1) {
      throw new DOMException(`[ESL]: Illegal mixin attribute name "${mixin.is}"`, 'NotSupportedError');
    }
    const registered = this.store.get(mixin.is);
    if (registered && registered !== mixin) {
      throw new DOMException(`[ESL]: Attribute ${mixin.is} is already occupied by another mixin`, 'InUseAttributeError');
    }
    if (!registered) {
      this.store.set(mixin.is, mixin);
      this.invalidateRecursive(document.documentElement, mixin.is);
      this.resubscribe();
    }
  }

  /** Resubscribes DOM observer */
  public resubscribe(root: Element = document.documentElement): void {
    // Don't let flushed changes from being unhandled
    this._onMutation(this.mutation$$.takeRecords());
    // Resubscribe for all observed attributes
    this.mutation$$.disconnect();
    this.mutation$$.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: this.observedAttributes,
      attributeOldValue: true
    });
  }

  /**
   * Invalidates all mixins on the element and subtree
   * @param root - root HTMLElement to start traversing
   * @param name - optional filter for mixin name
   */
  public invalidateRecursive(root: HTMLElement = document.body, name?: string): void {
    if (!root) return;
    name ? this.invalidate(root, name) : this.invalidateAll(root);
    if (!root.children || !root.children.length) return;
    Array.prototype.forEach.call(root.children, (child: Element) => this.invalidateRecursive(child as HTMLElement, name));
  }

  /**
   * Invalidates all mixins on the element
   * @param el - host element to invalidate mixins
   */
  public invalidateAll(el: HTMLElement): void {
    const hasStore = Object.hasOwnProperty.call(el, STORE);
    this.store.forEach((mixin: ESLMixinElementConstructable, name: string) => {
      if (el.hasAttribute(name)) {
        ESLMixinRegistry.init(el, mixin);
      } else if (hasStore) {
        ESLMixinRegistry.destroy(el, name);
      }
    });
  }

  /**
   * Invalidates passed mixin name on the element
   * @param el - host element to invalidate mixin
   * @param name - mixin name to invalidate
   * @param oldValue - optional previous value of mixins attribute
   */
  public invalidate(el: HTMLElement, name: string, oldValue: string | null = null): void {
    const newValue = el.getAttribute(name);
    if (newValue === null) return ESLMixinRegistry.destroy(el, name);
    const instance = ESLMixinRegistry.get(el, name) as ESLMixinElementInternal;
    if (instance) {
      instance.attributeChangedCallback(name, oldValue, newValue);
    } else {
      const type = this.store.get(name);
      type && ESLMixinRegistry.init(el, type);
    }
  }

  /** Handles DOM {@link MutationRecord} list */
  protected _onMutation(mutations: MutationRecord[]): void {
    mutations.forEach((record: MutationRecord) => {
      if (record.type === 'attributes' && record.attributeName) {
        this.invalidate(record.target as HTMLElement, record.attributeName, record.oldValue);
      }
      if (record.type === 'childList') {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) this.invalidateRecursive(node as HTMLElement);
        });
        record.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) ESLMixinRegistry.destroyAll(node as HTMLElement);
        });
      }
    });
  }

  /** Returns mixin instance by element */
  public static get<T extends ESLMixinElementConstructable>(this: T, $el: HTMLElement): InstanceType<T> | null;
  /** Returns mixin instance by element and mixin name */
  public static get($el: HTMLElement, name: string): ESLMixinElement | null;
  /** @returns mixin instance by name */
  public static get(this: any, el: HTMLElement, mixin: string = this.is): ESLMixinElement | null {
    const store = (el as any)[STORE] as Record<string, ESLMixinElement> | undefined;
    return (store && store[mixin]) || null;
  }

  /** @returns all mixins initialized on passed host element */
  public static getAll(el: HTMLElement): ESLMixinElement[] {
    const store = (el as any)[STORE] as Record<string, ESLMixinElement> | undefined;
    return store ? Object.values(store) : [];
  }

  /** @returns if the passed mixin exists on the element */
  public static has(el: HTMLElement, mixin: string): boolean {
    return !!this.get(el, mixin);
  }

  /** Sets mixin instance to the element store */
  private static set(el: HTMLElement, mixin: ESLMixinElement): void {
    if (!Object.hasOwnProperty.call(el, STORE)) Object.defineProperty(el, STORE, {value: {}, configurable: true});
    const store = (el as any)[STORE] as Record<string, ESLMixinElement>;
    store[(mixin.constructor as ESLMixinElementConstructable).is] = mixin;
  }

  /** Inits mixin instance on the element */
  private static init(el: HTMLElement, Mixin: ESLMixinElementConstructable): ESLMixinElement | null {
    if (this.has(el, Mixin.is)) return null;
    const instance = new Mixin(el);
    ESLMixinRegistry.set(el, instance);
    (instance as ESLMixinElementInternal).connectedCallback();
    return instance;
  }

  /** Destroys passed mixin on the element */
  private static destroy(el: HTMLElement, mixin: string): void {
    const store = (el as any)[STORE] as Record<string, ESLMixinElement>;
    if (!store) return;
    const instance = store[mixin];
    if (!instance) return;
    (instance as ESLMixinElementInternal).disconnectedCallback();
    delete store[mixin];
  }

  /** Destroys all mixins on the element */
  private static destroyAll(el: HTMLElement): void {
    const store = (el as any)[STORE] as Record<string, ESLMixinElement> | undefined;
    store && Object.keys(store).forEach((name) => ESLMixinRegistry.destroy(el, name));
  }
}
