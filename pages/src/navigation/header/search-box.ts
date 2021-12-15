import {
  prop,
  afterNextRender,
  CSSClassUtils,
  ESLToggleable,
  ToggleableActionParams,
  TraversingQuery,
  FormatUtils
} from '../../../../src/modules/all';
import { attr } from '../../../../src/modules/esl-base-element/core';

export class ESLDemoSearchBox extends ESLToggleable {
  static is = 'esl-d-search-box';

  @attr() public postCls: string;
  @attr() public postClsDelay: string;
  @attr({defaultValue: '::find(input)'}) public autofocus: string;

  @prop() public closeOnOutsideAction = true;

  public onShow(params: ToggleableActionParams): void {
    CSSClassUtils.add(this, this.postCls);
    afterNextRender(() => {
      super.onShow(params);
      const $focusEl = TraversingQuery.first(this.autofocus, this) as HTMLElement;
      $focusEl && $focusEl.focus();
    });
  }

  public onHide(params: ToggleableActionParams): void {
    super.onHide(params);
    window.setTimeout(() => CSSClassUtils.remove(this, this.postCls), FormatUtils.parseNumber(this.postClsDelay));
  }
}
