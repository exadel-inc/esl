import {Observable} from '@exadel/esl/modules/esl-utils/abstract/observable';
import {UIPPlugin} from './plugin';

/** Type for function which changes attribute's current value. */
export type TransformSignature = (current: string | null) => string | boolean | null;

/** Config used for changing attribute's value. */
export type ChangeAttrConfig = {
  /** Target whose {@link attribute} is changed. */
  target: string,
  /** Attribute that is changed. */
  attribute: string,
  /** Changes initiator. */
  modifier: UIPPlugin
} & ({
  /** New {@link attribute} value. */
  value: string | boolean
} | {
  /**
   * Function which transforms current
   * {@link attribute} value to the new one.
   */
  transform: TransformSignature
});

/**
 * State manager class which contains current markup
 * and provides methods for changing it.
 */
export class UIPStateModel extends Observable {
  private _html = new DOMParser().parseFromString('', 'text/html').body;
  /** Last {@link UIPPlugin} element which changed markup. */
  private _lastModifier: UIPPlugin;

  /**
   * Update current markup.
   * Triggers [onRootStateChange]{@link UIPPlugin#_onRootStateChange}.
   */
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

  /** Get attributes values from targets. */
  public getAttribute(target: string, attr: string): (string | null)[] {
    return Array.from(this._html.querySelectorAll(target)).map(el => el.getAttribute(attr));
  }

  /** Apply change config to current markup. */
  public changeAttribute(cfg: ChangeAttrConfig) {
    const {target, attribute, modifier} = cfg;
    const elements = Array.from(this._html.querySelectorAll(target));
    if (!elements.length) return;

    UIPStateModel.setAttribute(elements, attribute, 'transform' in cfg ? cfg.transform : cfg.value);
    this._lastModifier = modifier;
    this.fire();
  }

  /** Transform attributes values. */
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
