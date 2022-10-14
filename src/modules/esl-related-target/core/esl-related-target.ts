import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {listen, attr} from '../../esl-utils/decorators';
import {copyDefinedKeys} from '../../esl-utils/misc/object/copy';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

export class ESLRelatedTarget extends ESLMixinElement {
  static is = 'esl-related-target';

  @attr({name: ESLRelatedTarget.is}) public selector: string;

  protected get $relatedTarget(): ESLToggleable | null {
    const {selector} = this;
    if (!selector) return null;
    const target = ESLTraversingQuery.first(selector);
    if (target instanceof ESLToggleable) return target;
    return null;
  }

  protected mergeLocalParams(params: ESLToggleableActionParams): ESLToggleableActionParams {
    return Object.assign(copyDefinedKeys(params), {
      initiator: 'relatedToggleable',
      activator: this.$host
    });
  }

  @listen('esl:show')
  protected onShow(e: CustomEvent): void {
    const {params} = e.detail;
    this.$relatedTarget?.show({params: this.mergeLocalParams(params)});
  }

  @listen('esl:hide')
  protected onHide(e: CustomEvent): void {
    const {params} = e.detail;
    this.$relatedTarget?.hide({params: this.mergeLocalParams(params)});
  }
}
