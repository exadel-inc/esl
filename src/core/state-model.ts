import {Observable} from '@exadel/esl';

export interface StateModelFiredObj {
  markup: string,
}

export class UIPStateModel extends Observable {
  protected root: Element;

  constructor() {
    super();
    this.root = new DOMParser().parseFromString('', 'text/html').body;
  }

  public set html(markup: string) {
    const root = new DOMParser().parseFromString(markup, 'text/html').body;
    if (root.innerHTML !== this.root.innerHTML) {
      this.root = root;
      this.fire({markup: markup});
    }
  }

  public get html(): string {
    return this.root ? this.root.innerHTML : '';
  }

  public getAttribute(target: string, name: string): (string | null)[] {
    return Array.from(this.root.querySelectorAll(target)).map(el => el.getAttribute(name));
  }

  public setAttribute(target: string, name: string, value: string | boolean): void {
    const elements = Array.from(this.root.querySelectorAll(target));
    if (!elements.length) return;

    if (typeof value === 'string') {
      elements.forEach(el => el.setAttribute(name, value));
    } else {
      elements.forEach(el => value ? el.setAttribute(name, '') : el.removeAttribute(name));
    }

    this.fire({markup: this.html});
  }

  public transformAttribute(target: string, name: string, transform: (current: string | null) => string | null) {
    const elements = Array.from(this.root.querySelectorAll(target));
    if (!elements.length) return;

    elements.forEach(el => {
      const transformed = transform(el.getAttribute(name));
      transformed === null ? el.removeAttribute(name) : el.setAttribute(name, transformed);
    });

    this.fire({markup: this.html});
  }
}
