export class UIPStateModel {
  protected root: Element;

  public set html(markup: string) {
    this.root = new DOMParser().parseFromString(markup, 'text/html').body;
  }

  public get html(): string {
    return this.root.innerHTML;
  }

  public getAttribute(target: string, name: string): (string | null)[] {
    return Array.from(this.root.querySelectorAll(target)).map(el => el.getAttribute(name));
  }

  public setAttribute(target: string, name: string, value: string | boolean): void {
    const elements = Array.from(this.root.querySelectorAll(target));


    if (typeof value === 'string') {
      elements.forEach(el => el.setAttribute(name, value));
    } else {
      elements.forEach(el => value ? el.setAttribute(name, '') : el.removeAttribute(name));
    }
  }

  public transformAttribute(target: string, name: string, transform: (current: string | null) => string | null) {
    Array.from(this.root.querySelectorAll(target)).forEach(el => {
      const transformed = transform(el.getAttribute(name));
      transformed === null ? el.removeAttribute(name) : el.setAttribute(name, transformed);
    });
  }
}
