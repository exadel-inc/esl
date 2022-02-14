import {prop} from '@esl/utils';
import {
  CSSClassUtils,
  afterNextRender,
  FormatUtils
} from '@esl/utils';
import {attr, boolAttr} from '@esl/element';
import {TraversingQuery} from '@esl/traversing-query';
import {ESLToggleable} from '@esl/toggleables';

import type {ToggleableActionParams} from '@esl/toggleables';

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
    }
  }

  public onHide(params: ToggleableActionParams): void {
    super.onHide(params);
    window.setTimeout(() => {
      CSSClassUtils.remove(this, this.postCls);
      this.activator?.focus({preventScroll: true});
    }, FormatUtils.parseNumber(this.postClsDelay));
  }
}
