// TODO: make possible to extract type from complex selectors
type ElementType<Sel extends string> = Sel extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Sel] : HTMLElement;
type ElementsAccessorTemplate<T extends {[key: string]: string}> = ESLTestTemplate & {
  [Prop in keyof T as `$${string & Prop}`]: ElementType<T[Prop]>;
} & {
  [Prop in keyof T as `$$${string & Prop}`]: ElementType<T[Prop]>[];
};

type AliasList = Readonly<Record<string, string>>;

/** Jest utility to create and manage HTML fragments for testing */
export class ESLTestTemplate {
  /** Div fragment container */
  public $fragment?: HTMLElement;
  protected _aliasesCache: any = {};

  /** Create template instance */
  static create(html: string): ESLTestTemplate;
  static create<T extends AliasList>(html: string, selectors?: T): ESLTestTemplate & ElementsAccessorTemplate<Readonly<T>>;
  static create<T extends Record<string, string>>(html: string, selectors: any = {}): ESLTestTemplate & ElementsAccessorTemplate<T> {
    const template: any = new ESLTestTemplate(html, selectors);
    return new Proxy(template, {
      get(target, prop): any {
        if (typeof prop === 'string' && prop.startsWith('$')) return target.alias(prop);
        if (prop in target) return target[prop];
        return null;
      }
    });
  }

  protected constructor(
    public readonly html: string,
    public readonly aliases: AliasList = {}
  ) {
    this.inject = this.inject.bind(this);
    this.clear = this.clear.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  /** Inject a fragment into DOM (document.body by default) */
  public inject($root = document.body): void {
    if (this.$fragment) this.clear();
    this.$fragment = document.createElement('div');
    this.$fragment.className = 'esl-test-fragment';
    this.$fragment.innerHTML = this.html;
    this.fillAliases();
    $root.appendChild(this.$fragment);
  }

  protected fillAliases(): void {
    this._aliasesCache = {};
    for (const [key, selector] of Object.entries(this.aliases)) {
      this._aliasesCache[key] = this.getAll(selector);
    }
  }

  /** Remove fragment from DOM */
  public clear(): void {
    if (this.$fragment) {
      this.$fragment.remove();
      this.$fragment = undefined;
      this._aliasesCache = {};
    }
  }

  public alias(name: `$$${string}`): HTMLElement[];
  public alias(name: string): HTMLElement | null;
  public alias(name: string): HTMLElement[] | HTMLElement | null {
    const isMultiple = name.startsWith('$$');
    const key = name.replace(/^[$]{1,2}/, '');
    const value = this._aliasesCache[key] || [];
    return (isMultiple ? value : value[0]) || null;
  }

  /** Get element by selector */
  public get<Sel extends string>(selector: Sel): ElementType<Sel> | null {
    if (!this.$fragment) return null;
    return this.$fragment.querySelector(selector);
  }
  /** Get all elements by selector */
  public getAll<Sel extends string>(selector: string): ElementType<Sel>[] {
    if (!this.$fragment) return [];
    return [...this.$fragment.querySelectorAll(selector)] as ElementType<Sel>[];
  }

  /** Bind template injection to Jest lifecycle */
  public bind(type: 'beforeall' | 'beforeeach'): this {
    if (type === 'beforeall') {
      beforeAll(() => this.inject());
      afterAll(() => this.clear());
    }
    if (type === 'beforeeach') {
      beforeEach(() => this.inject());
      afterEach(() => this.clear());
    }
    return this;
  }
}
