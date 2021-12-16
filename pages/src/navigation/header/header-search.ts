import {
  prop,
  afterNextRender,
  CSSClassUtils,
  ESLToggleable,
  TraversingQuery,
  FormatUtils
} from '../../../../src/modules/all';
import { attr, boolAttr } from '../../../../src/modules/esl-base-element/core';

import type {ToggleableActionParams} from '../../../../src/modules/all';

export class ESLDemoSearchBox extends ESLToggleable {
  static is = 'esl-d-search-box';

  @attr() public postCls: string;
  @attr() public postClsDelay: string;
  @attr({defaultValue: '::find(input)'}) public firstFocusable: string;

  @boolAttr() public autofocus: boolean;

  @prop() public closeOnOutsideAction = true;

  public onShow(params: ToggleableActionParams): void {
    CSSClassUtils.add(this, this.postCls);
    afterNextRender(() => super.onShow(params));
    if (this.autofocus) {
      const $focusEl = TraversingQuery.first(this.firstFocusable, this) as HTMLElement;
      $focusEl && window.setTimeout(() => $focusEl.focus(), FormatUtils.parseNumber(this.postClsDelay));
    };
  }

  public onHide(params: ToggleableActionParams): void {
    super.onHide(params);
    window.setTimeout(() => {
      CSSClassUtils.remove(this, this.postCls);
      this.activator?.focus({preventScroll: true});
    }, FormatUtils.parseNumber(this.postClsDelay));
  }
}
