import {attr, boolAttr, ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {listen} from '@exadel/esl/modules/esl-utils/decorators/listen';
import {ENTER, SPACE} from '@exadel/esl/modules/esl-utils/dom/keys';

import type {UIPOptions} from '../options';

/** Config used to create options. */
export type OptionConfig = {
  /** Attribute to toggle. */
  attribute: string;
  /** Callback to indicate if option should be rendered. */
  canActivate?: (scope: UIPOptions) => boolean;
};

/** Custom element to toggle {@link UIPRoot} attributes. */
export class UIPOption extends ESLBaseElement {
  static is = 'uip-option';
  @attr() public attribute: string;
  @boolAttr() public active: boolean;

  static create(optionConfig: OptionConfig): UIPOption {
    const option = document.createElement('uip-option') as UIPOption;
    option.setAttribute('attribute', optionConfig.attribute);
    return option;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.classList.add(`${this.attribute}-option`);
    this.tabIndex = 0;
  }

  @listen('click')
  protected _onClick() {
    this.toggleState();
    this.$$fire('uip:option:changed');
  }

  @listen('keydown')
  protected _onKeydown(e: KeyboardEvent) {
    if (ENTER !== e.key && SPACE !== e.key) return;
    this.toggleState();
    this.$$fire('uip:option:changed');
  }

  public toggleState(force?: boolean) {
    this.active = force === undefined ? !this.active : force;
    this.$$cls('active', this.active);
  }

  protected disconnectedCallback() {
      super.disconnectedCallback();
  }
}
