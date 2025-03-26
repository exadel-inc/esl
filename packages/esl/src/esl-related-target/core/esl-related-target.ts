import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {listen, attr} from '../../esl-utils/decorators';
import {copyDefinedKeys} from '../../esl-utils/misc/object/copy';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

export type ESLRelatedTargetActionType = 'all' | 'show' | 'hide';

/**
 * ESLRelatedTarget mixin element
 * @author Anastasia Lesun, Alexey Stsefanovich (ala'n)
 *
 * ESLRelatedTarget is a custom mixin element that can be used with {@link ESLToggleable}s to sync their states
 */
@ExportNs('RelatedTarget')
export class ESLRelatedTarget extends ESLMixinElement {
  static override is = 'esl-related-target';

  /** Selector/query ({@link ESLTraversingQuery}) to find related ESLToggleable element */
  @attr({name: ESLRelatedTarget.is}) public selector: string;
  /** Action to synchronize between toggleables */
  @attr({name: ESLRelatedTarget.is + '-action', defaultValue: 'all'}) public action: ESLRelatedTargetActionType;

  /** @returns related toggleable instances */
  public get $targets(): ESLToggleable[] {
    const {selector} = this;
    if (!selector) return [];
    const targets = ESLTraversingQuery.all(selector, this.$host);
    return targets.filter(
      (target: HTMLElement): target is ESLToggleable => target instanceof ESLToggleable && target !== this.$host
    );
  }

  /** Merges params that are used to initiate actions */
  protected mergeParams(params: ESLToggleableActionParams): ESLToggleableActionParams {
    return Object.assign(copyDefinedKeys(params), {
      initiator: 'relatedToggleable',
      activator: this.$host
    });
  }

  /** Processes {@link ESLToggleable} show event */
  @listen('esl:show')
  protected onShow(e: CustomEvent): void {
    if (this.action === 'hide' || e.target !== this.$host) return;
    const {params} = e.detail;
    this.$targets.forEach((target) => target.show({params: this.mergeParams(params)}));
  }

  /** Processes {@link ESLToggleable} hide event */
  @listen('esl:hide')
  protected onHide(e: CustomEvent): void {
    if (this.action === 'show' || e.target !== this.$host) return;
    const {params} = e.detail;
    this.$targets.forEach((target) => target.hide({params: this.mergeParams(params)}));
  }
}
