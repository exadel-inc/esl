import {TraversingQuery} from "@exadel/esl";

export class UIPStateModel {
  public html: string;

  protected get root(): Element {
    return new DOMParser().parseFromString(this.html, 'text/html').body;
  }

  protected getTargets(target: string): Element[] {
    return TraversingQuery.all(target, this.root);
  }

  public getAttribute(target: string, name: string): (string | null)[] {
    return this.getTargets(target).map(el => el.getAttribute(name))
  }

  public setAttribute(target: string, name: string, value: string | boolean): void {
    const query = this.getTargets(target);

    if (typeof value === 'string') {
      query.forEach(el => el.setAttribute(name, value));
    }
    else {
      query.forEach(el => {
        value ? el.setAttribute(name, '') : el.removeAttribute(name);
      })
    }
  }
}
