import {TraversingQuery} from '@exadel/esl';

export class UIPStateModel {
  protected root: Element;

  public set html(markup: string) {
    this.root = new DOMParser().parseFromString(markup, 'text/html').body;
  }

  public get html(): string {
    return this.root.innerHTML;
  }

  public getAttribute(target: string, name: string): (string | null)[] {
    return TraversingQuery.all(target, this.root).map(el => el.getAttribute(name));
  }

  public setAttribute(target: string, name: string, value: string | boolean): void {
    const elements = TraversingQuery.all(target, this.root);

    if (typeof value === 'string') {
      elements.forEach(el => el.setAttribute(name, value));
    } else {
      elements.forEach(el => value ? el.setAttribute(name, '') : el.removeAttribute(name));
    }
  }

  public transformAttribute(target: string, name: string, transform: (current: string | null) => string | null) {
    TraversingQuery.all(target, this.root).forEach(el => {
      const transformed = transform(el.getAttribute(name));
      transformed === null ? el.removeAttribute(name) : el.setAttribute(name, transformed);
    });
  }
}
