import {prop, attr, boolAttr, listen} from '@exadel/esl/modules/esl-utils/decorators';
import {CSSClassUtils} from '@exadel/esl/modules/esl-utils/dom/class';
import {afterNextRender} from '@exadel/esl/modules/esl-utils/async/raf';
import {parseNumber} from '@exadel/esl/modules/esl-utils/misc/format';
import {ESLTraversingQuery} from '@exadel/esl/modules/esl-traversing-query/core';
import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';
import {requestGss} from '../../search/search-script';

import type {ESLToggleableActionParams} from '@exadel/esl/modules/esl-toggleable/core';

export class ESLDemoSearchBox extends ESLToggleable {
  static override is = 'esl-d-search-box';

  @attr() public postCls: string;
  @attr() public postClsDelay: string;
  @attr({defaultValue: '::find(input)'}) public firstFocusable: string;

  @boolAttr() public override autofocus: boolean;

  @prop() public override closeOnOutsideAction = true;

  public override onShow(params: ESLToggleableActionParams): void {
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

  public override onHide(params: ESLToggleableActionParams): void {
    super.onHide(params);
    window.setTimeout(() => {
      CSSClassUtils.remove(this, this.postCls);
      this.activator?.focus({preventScroll: true});
    }, parseNumber(this.postClsDelay));
  }

  @listen({
    event: 'focusout',
    target: '::parent(.header-search)'
  })
  protected onFocusOut(e: FocusEvent): void {
    if (!e.relatedTarget || !e.currentTarget || (e.currentTarget as Node).contains(e.relatedTarget as Node)) return;
    this.hide({hideDelay: 100});
    this.activator = e.relatedTarget as HTMLElement;
  }
}
