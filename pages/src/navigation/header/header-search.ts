import {prop} from '../../../../src/modules/esl-utils/decorators/prop';
import {loadScript} from '../../../../modules/esl-utils/dom/script';
import {CSSClassUtils} from '../../../../src/modules/esl-utils/dom/class';
import {afterNextRender} from '../../../../src/modules/esl-utils/async/raf';
import {parseNumber} from '../../../../src/modules/esl-utils/misc/format';
import {attr, boolAttr} from '../../../../src/modules/esl-base-element/core';
import {TraversingQuery} from '../../../../src/modules/esl-traversing-query/core';
import {ESLToggleable} from '../../../../src/modules/esl-toggleable/core';

import type {ToggleableActionParams} from '../../../../src/modules/esl-toggleable/core';

export class ESLDemoSearchBox extends ESLToggleable {
  static is = 'esl-d-search-box';

  @attr() public postCls: string;
  @attr() public postClsDelay: string;
  @attr({defaultValue: '::find(input)'}) public firstFocusable: string;

  @boolAttr() public autofocus: boolean;

  @prop() public closeOnOutsideAction = true;

  public onShow(params: ToggleableActionParams): void {
    loadScript('gss', 'https://cse.google.com/cse.js?cx=3171f866738b34f02');
    CSSClassUtils.add(this, this.postCls);
    afterNextRender(() => super.onShow(params));
    if (this.autofocus) {
      const $focusEl = TraversingQuery.first(this.firstFocusable, this) as HTMLElement;
      $focusEl && window.setTimeout(() => $focusEl.focus(), parseNumber(this.postClsDelay));
    }
  }

  public onHide(params: ToggleableActionParams): void {
    super.onHide(params);
    window.setTimeout(() => {
      CSSClassUtils.remove(this, this.postCls);
      this.activator?.focus({preventScroll: true});
    }, parseNumber(this.postClsDelay));
  }
}
