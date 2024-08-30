// TODO: make possible to extract type from complex selectors
type ElementType<Sel extends string> = Sel extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[Sel] : HTMLElement;
type ElementsAccessorTemplate<T extends {[key: string]: string}> = ESLTestTemplate & {
  [Prop in keyof T as `$${string & Prop}`]: ElementType<T[Prop]>;
} & {
  [Prop in keyof T as `$$${string & Prop}`]: ElementType<T[Prop]>[];
};


/** Jest utility to create and manage HTML fragments for testing */
export class ESLTestTemplate {
  /** Div fragment container */
  public $fragment?: HTMLElement;

  /** Create template instance */
  static create(html: string): ESLTestTemplate;
  static create<T extends Readonly<Record<string, string>>>(html: string, selectors?: T): ESLTestTemplate & ElementsAccessorTemplate<Readonly<T>>;
  static create<T extends Record<string, string>>(html: string, selectors: any = {}): ESLTestTemplate & ElementsAccessorTemplate<T> {
    const template: any = new ESLTestTemplate(html);
    return new Proxy(template, {
      get(target, prop): any {
        if (typeof prop === 'string' && prop.startsWith('$')) {
          const isMultiple = prop.startsWith('$$');
          const key = prop.replace(/^[$]{1,2}/, '');
          const selector = selectors[key];
          return isMultiple ? target.getAll(selector) : target.get(selector);
        }
        if (prop in target) return target[prop];
        return null;
      }
    });
  }

  protected constructor(public readonly html: string) {
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
    $root.appendChild(this.$fragment);
  }

  /** Remove fragment from DOM */
  public clear(): void {
    if (this.$fragment) {
      this.$fragment.remove();
      this.$fragment = undefined;
    }
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
  /** Check if element exists */
  public has(selector: string): boolean {
    return !!this.get(selector);
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

  // Utilities methods
  /** Dispatch 'load' or 'error' event on image element */
  public dispatchImageLoadEvent(selector: string, type: 'load' | 'error' = 'load'): void {
    for (const $img of this.getAll(selector)) {
      if (!($img instanceof HTMLImageElement)) continue;
      jest.spyOn($img, 'complete', 'get').mockReturnValue(true);
      $img.dispatchEvent(new Event(type));
    }
  }
}
