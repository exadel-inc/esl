import {prop} from '../../../../src/modules/esl-utils/decorators/prop';
import {memoizeFn} from '../../../../src/modules/esl-utils/misc/memoize';
import {CSSClassUtils} from '../../../../src/modules/esl-utils/dom/class';
import {afterNextRender} from '../../../../src/modules/esl-utils/async/raf';
import {parseNumber} from '../../../../src/modules/esl-utils/misc/format';
import {attr, boolAttr} from '../../../../src/modules/esl-base-element/core';
import {TraversingQuery} from '../../../../src/modules/esl-traversing-query/core';
import {ESLToggleable} from '../../../../src/modules/esl-toggleable/core';
import {loadSearchScript} from '../../search/search-script';

import type {ToggleableActionParams} from '../../../../src/modules/esl-toggleable/core';

export class ESLDemoSearchBox extends ESLToggleable {
  static is = 'esl-d-search-box';

  @attr() public postCls: string;
  @attr() public postClsDelay: string;
  @attr({defaultValue: '::find(input)'}) public firstFocusable: string;

  @boolAttr() public autofocus: boolean;

  @prop() public closeOnOutsideAction = true;

  searchScript = memoizeFn(() => loadSearchScript());

  public onShow(params: ToggleableActionParams): void {
    CSSClassUtils.add(this, this.postCls);
    this.searchScript();

    (window as any).__gcse = {
      parsetags: 'onload',
      initializationCallback: (): void => this.afterSearchScriptLoad(params)
    };
  }

  private afterSearchScriptLoad(params: ToggleableActionParams): void {
    afterNextRender(() => super.onShow(params));
    if (this.autofocus) {
      const $focusEl = TraversingQuery.first(this.firstFocusable, this) as HTMLElement;
      $focusEl && window.setTimeout(() => $focusEl.focus(), parseNumber(this.postClsDelay));
    }
    const loadingAnimationEL = this.querySelector('.animation-loading')!;
    CSSClassUtils.add(loadingAnimationEL, 'disabled');
  }

  public onHide(params: ToggleableActionParams): void {
    super.onHide(params);
    window.setTimeout(() => {
      CSSClassUtils.remove(this, this.postCls);
      this.activator?.focus({preventScroll: true});
    }, parseNumber(this.postClsDelay));
  }
}
