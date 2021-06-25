import {Observable} from '@exadel/esl';
import {UIPPlugin} from './plugin';

export type TransformSignature = (current: string | null) => string | boolean | null;

export type ChangeAttrConfig = {
  target: string,
  attribute: string,
  modifier: UIPPlugin
} & ({
  value: string | boolean
} | {
  transform: TransformSignature
});

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

  public changeAttribute(cfg: ChangeAttrConfig) {
    const {target, attribute, modifier} = cfg;
    const elements = Array.from(this._html.querySelectorAll(target));
    if (!elements.length) return;

    if ('transform' in cfg) {
      UIPStateModel.setAttribute(elements, attribute, cfg.transform);
    } else {
      UIPStateModel.setAttribute(elements, attribute, cfg.value);
    }
    this._lastModifier = modifier;
    this.fire();
  }

  public static setAttribute(elements: Element[], name: string, transform: TransformSignature | string | boolean) {
    elements.forEach(el => {
      const transformed = typeof transform === 'function' ? transform(el.getAttribute(name)) : transform;
      if (typeof transformed === 'string') {
        el.setAttribute(name, transformed);
      } else {
         transformed ? el.setAttribute(name, '') : el.removeAttribute(name);
      }
    });
  }
}
