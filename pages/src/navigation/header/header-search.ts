import {prop, attr, boolAttr} from '../../../../src/modules/esl-utils/decorators';
import {CSSClassUtils} from '../../../../src/modules/esl-utils/dom/class';
import {afterNextRender} from '../../../../src/modules/esl-utils/async/raf';
import {parseNumber} from '../../../../src/modules/esl-utils/misc/format';
import {ESLTraversingQuery} from '../../../../src/modules/esl-traversing-query/core';
import {ESLToggleable} from '../../../../src/modules/esl-toggleable/core';
import {requestGss} from '../../search/search-script';

import type {ESLToggleableActionParams} from '../../../../src/modules/esl-toggleable/core';

export class ESLDemoSearchBox extends ESLToggleable {
  static is = 'esl-d-search-box';

  @attr() public postCls: string;
  @attr() public postClsDelay: string;
  @attr({defaultValue: '::find(input)'}) public firstFocusable: string;

  @boolAttr() public autofocus: boolean;

  @prop() public closeOnOutsideAction = true;

  public onShow(params: ESLToggleableActionParams): void {
    CSSClassUtils.add(this, this.postCls);
    requestGss().then(() => this.showSearchElements(params));
  }

  private showSearchElements(params: ESLToggleableActionParams): void {
    afterNextRender(() => super.onShow(params));
    if (this.autofocus) {
      const $focusEl = ESLTraversingQuery.first(this.firstFocusable, this) as HTMLElement;
      $focusEl && window.setTimeout(() => $focusEl.focus(), parseNumber(this.postClsDelay));
    }

    const loadingAnimationEL = this.querySelector('.animation-loading');
    if (loadingAnimationEL) {
      CSSClassUtils.add(loadingAnimationEL, 'disabled');
    }
  }

  public onHide(params: ESLToggleableActionParams): void {
    super.onHide(params);
    window.setTimeout(() => {
      CSSClassUtils.remove(this, this.postCls);
      this.activator?.focus({preventScroll: true});
    }, parseNumber(this.postClsDelay));
  }
}
