import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ready, jsonAttr} from '../../esl-utils/decorators';
import {ExportNs} from '../../esl-utils/environment/export-ns';

import {ESLAnimateService} from './esl-animate-service';
import type {ESLAnimateConfig} from './esl-animate-service';

/**
 * ESLAnimateMixin - custom mixin element for quick {@link ESLAnimateService} attaching
 *
 * Use example:
 * `<div esl-animate>Content</div>`
 *
 * Supports additional parameters:
 * `<div esl-animate={repeat: true, ratio: 0.8, cls: 'in'}>Content</div>`
 */
@ExportNs('AnimateMixin')
export class ESLAnimateMixin extends ESLMixinElement {
  public static override is = 'esl-animate';

  public static defaultConfig: ESLAnimateConfig = {
    force: true
  };

  @jsonAttr({name: ESLAnimateMixin.is})
  public options?: ESLAnimateConfig;

  protected mergeDefaultParams(): ESLAnimateConfig {
    const type = this.constructor as typeof ESLAnimateMixin;
    return Object.assign({}, type.defaultConfig, this.options);
  }

  @ready
  public override connectedCallback(): void {
    super.connectedCallback();
    this.reanimate();
  }

  @ready
  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this.$host);
  }

  /** Reinitialize {@link ESLAnimateService} for targets */
  public reanimate(): void {
    ESLAnimateService.unobserve(this.$host);
    ESLAnimateService.observe(this.$host, this.mergeDefaultParams());
  }
}
