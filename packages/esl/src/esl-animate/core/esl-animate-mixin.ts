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
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.reanimate();
  }

  @ready
  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this.$host);
  }

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.reanimate();
  }

  /** Reinitialize {@link ESLAnimateService} for target */
  public reanimate(): void {
    ESLAnimateService.unobserve(this.$host);
    ESLAnimateService.observe(this.$host, this.mergeDefaultParams());
  }
}

declare global {
  export interface ESLLibrary {
    AnimateMixin: typeof ESLAnimateMixin;
  }
}
