import {attr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';
import {ENTER, SPACE} from '@exadel/esl/modules/esl-utils/dom/keys';

import type {UIPOptions} from '../options';
import {UIPRoot} from '../../../../core/base/root';

/** Config used to create options */
export type OptionConfig = {
  /** Attribute name used as absence marker of option icon */
  attrName: string;
  /** Controlled attribute to toggle on root */
  optionValue: string;
  /** Callback to indicate if option should be rendered */
  canActivate?: (scope: UIPOptions) => boolean;
};

/** Custom element to toggle {@link UIPRoot} attributes */
export class UIPOption extends ESLBaseElement {
  public static is = 'uip-option';

  /** {@link UIPRoot's} attribute which is changed by option */
  @attr() public attribute: string;
  public _active: boolean;

  protected $root: UIPRoot;
  protected config: OptionConfig;

  /** Build option element from {@link OptionConfig config} */
  static createEl(optionConfig: OptionConfig): UIPOption {
    const option = document.createElement('uip-option') as UIPOption;
    option.setAttribute('attribute', optionConfig.optionValue);
    option.config = optionConfig;
    return option;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.$root = this.closest('.uip-root') as UIPRoot;
    this.classList.add(`${this.attribute}-option`);
    this.tabIndex = 0;
    this.active = this.$root.hasAttribute(this.config.optionValue);
  }

  /** Check whether option is in its active state */
  public get active(): boolean {
    return this.$$cls('active');
  }

  /** Setter for `active` class */
  public set active(val: boolean) {
    this.$$cls('active', val);
  }

  /** Handle option `click` event */
  @listen('click')
  protected _onClick() {
    this.toggleState();
    this.$$fire('uip:option:changed');
  }

  /** Handle option `keydown` event */
  @listen('keydown')
  protected _onKeydown(e: KeyboardEvent) {
    if (ENTER !== e.key && SPACE !== e.key) return;
    this.toggleState();
    this.$$fire('uip:option:changed');
  }

  /** Toggle option active state */
  public toggleState(force?: boolean) {
    this.active = force === undefined ? !this.active : force;
  }
}
