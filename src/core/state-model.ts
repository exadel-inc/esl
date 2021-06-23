import {Observable} from '@exadel/esl';
import {UIPPlugin} from './plugin';

export interface changeAttributeConfig {
  target: string,
  name: string,
  modifier: UIPPlugin,
  value?: string | boolean,
  transform?: (current: string | null) => string | null
}

export class UIPStateModel extends Observable {
  private _html = new DOMParser().parseFromString('', 'text/html').body;
  private _lastModifier: UIPPlugin;

  public setHtml(markup: string, modifier: UIPPlugin) {
    const root = new DOMParser().parseFromString(markup, 'text/html').body;
    if (root.innerHTML !== this._html.innerHTML) {
      this._html = root;
      this._lastModifier = modifier;
      this.fire();
    }
  }

  public get html(): string {
    return this._html ? this._html.innerHTML : '';
  }

  public get lastModifier() {
    return this._lastModifier;
  }

  public getAttribute(target: string, name: string): (string | null)[] {
    return Array.from(this._html.querySelectorAll(target)).map(el => el.getAttribute(name));
  }

  public setAttribute(cfg: changeAttributeConfig): void {
    const {target, name, value, modifier} = cfg;
    const elements = Array.from(this._html.querySelectorAll(target));
    if (!elements.length || typeof value === 'undefined') return;

    if (typeof value === 'string') {
      elements.forEach(el => el.setAttribute(name, value));
    } else {
      elements.forEach(el => value ? el.setAttribute(name, '') : el.removeAttribute(name));
    }
    this._lastModifier = modifier;
    this.fire();
  }

  public transformAttribute(cfg: changeAttributeConfig) {
    const {target, name, transform, modifier} = cfg;
    const elements = Array.from(this._html.querySelectorAll(target));
    if (!elements.length || !transform) return;

    elements.forEach(el => {
      const transformed = transform(el.getAttribute(name));
      transformed === null ? el.removeAttribute(name) : el.setAttribute(name, transformed);
    });
    this._lastModifier = modifier;
    this.fire();
  }
}
