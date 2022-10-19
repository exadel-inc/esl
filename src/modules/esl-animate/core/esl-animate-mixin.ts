import {jsonAttr, ESLMixinElement} from '../../esl-mixin-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ready} from '../../esl-utils/decorators/ready';

import {ESLAnimateService} from './esl-animate-service';

/** ESLAnimateMixin animation options */
export interface ESLAnimateMixinOptions {
  /**
   * Class(es) to add on viewport intersection
   * @see ESLAnimateConfig.cls
   */
  cls?: string;
  /**
   * Re-animate item after its getting hidden
   * @see ESLAnimateConfig.repeat
   */
  repeat?: boolean;
  /**
   * Intersection ratio to consider element as visible.
   * Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
   * with a fixed set of thresholds defined.
   */
  ratio?: number;
}

/** ESLAnimateMixin animation inner options */
interface ESLAnimateMixinOptionsInner extends Required<ESLAnimateMixinOptions> {
  /** Animate if class already presented */
  force: boolean;
}

/**
 * ESLAnimateMixin - custom mixin element for quick {@link ESLAnimateService} attaching
 *
 * Use example:
 * `<div esl-animate>Content</div>`
 * Supports aditional parameters^
 * `<div esl-animate={repeat: true, ratio: 0.8, cls: 'in'}>Content</div>`
 */
@ExportNs('AnimateMixin')
export class ESLAnimateMixin extends ESLMixinElement {
  public static is = 'esl-animate';

  public static defaultConfig: ESLAnimateMixinOptionsInner = {
    force: true,
    cls: 'in',
    repeat: false,
    ratio: 0.4
  };

  @jsonAttr({name: ESLAnimateMixin.is})
  public options?: ESLAnimateMixinOptions;

  protected mergeDefaultParams(): ESLAnimateMixinOptionsInner {
    const type = this.constructor as typeof ESLAnimateMixin;
    return Object.assign({}, type.defaultConfig, this.options, {ratio: this.options?.ratio || type.defaultConfig.ratio});
  }

  @ready
  public connectedCallback(): void {
    super.connectedCallback();
    this.reanimate();
  }

  @ready
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this.$host);
  }

  /** Reinitialize {@link ESLAnimateService} for targets */
  public reanimate(): void {
    ESLAnimateService.unobserve(this.$host);
    ESLAnimateService.observe(this.$host, this.mergeDefaultParams());
  }
}
