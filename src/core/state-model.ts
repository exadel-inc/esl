import {Observable} from '@exadel/esl/modules/esl-utils/abstract/observable';
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

    if (!root || root.innerHTML !== this.html) {
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

  public getAttribute(target: string, attr: string): (string | null)[] {
    return Array.from(this._html.querySelectorAll(target)).map(el => el.getAttribute(attr));
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

  protected static setAttribute(elements: Element[], attr: string, transform: TransformSignature | string | boolean) {
    elements.forEach(el => {
      const transformed = typeof transform === 'function' ? transform(el.getAttribute(attr)) : transform;
      if (typeof transformed === 'string') {
        el.setAttribute(attr, transformed);
      } else {
         transformed ? el.setAttribute(attr, '') : el.removeAttribute(attr);
      }
    });
  }
}
