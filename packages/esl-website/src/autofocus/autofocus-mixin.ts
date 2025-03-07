import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {attr, listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {getKeyboardFocusableElements} from '@exadel/esl/modules/esl-utils/dom';
import {ESLTraversingQuery} from '@exadel/esl/modules/esl-traversing-query/core';
import type {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';

export class ESLDemoAutofocus extends ESLMixinElement {
  static override is = 'esl-d-autofocus';

  public override $host: ESLToggleable;

  @attr({name: ESLDemoAutofocus.is}) public target: string;

  @memoize()
  get $focusable(): HTMLElement | undefined {
    if (this.target) return ESLTraversingQuery.first(this.target, this.$host) as HTMLElement | undefined;
    return getKeyboardFocusableElements(this.$host)[0] as HTMLElement | undefined;
  }

  @listen('esl:show')
  protected _onShow(): void {
    const {$focusable} = this;
    if (!$focusable) return;
    setTimeout(() => {
      this.$host.open && $focusable.focus();
    }, 500);
  }
}
