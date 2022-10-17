import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {listen, attr} from '../../esl-utils/decorators';
import {copyDefinedKeys} from '../../esl-utils/misc/object/copy';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

/**
 * ESLRelatedTarget mixin element
 * @author Anastasia Lesun, Alexey Stsefanovich (ala'n)
 *
 * ESLRelatedTarget is a custom mixin element that can be used with {@link ESLToggleable}s to sync their states
 */
@ExportNs('RelatedTarget')
export class ESLRelatedTarget extends ESLMixinElement {
  static is = 'esl-related-target';

  /** Selector to find target element */
  @attr({name: ESLRelatedTarget.is}) public selector: string;

  /** @returns related toggleable instance */
  public get $relatedTarget(): ESLToggleable | null {
    const {selector} = this;
    if (!selector) return null;
    const target = ESLTraversingQuery.first(selector);
    if (target instanceof ESLToggleable) return target;
    return null;
  }

  /** Merges params that are used by toggleable for actions */
  protected mergeLocalParams(params: ESLToggleableActionParams): ESLToggleableActionParams {
    return Object.assign(copyDefinedKeys(params), {
      initiator: 'relatedToggleable',
      activator: this.$host
    });
  }

  /** Processes {@link ESLToggleable} show event */
  @listen('esl:show')
  protected onShow(e: CustomEvent): void {
    const {params} = e.detail;
    this.$relatedTarget?.show({params: this.mergeLocalParams(params)});
  }

  /** Processes {@link ESLToggleable} hide event */
  @listen('esl:hide')
  protected onHide(e: CustomEvent): void {
    const {params} = e.detail;
    this.$relatedTarget?.hide({params: this.mergeLocalParams(params)});
  }
}
