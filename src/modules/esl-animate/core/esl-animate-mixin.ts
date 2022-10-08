import {jsonAttr, ESLMixinElement} from '../../esl-mixin-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ready} from '../../esl-utils/decorators/ready';
import {memoize} from '../../esl-utils/decorators/memoize';
import {parseNumber} from '../../esl-utils/misc/format';

import {ESLAnimateService} from './esl-animate-service';

interface AnimateOptions {
  /**
   * Class(es) to add on viewport intersection
   * @see ESLAnimateConfig.cls
   */
  cls: string;
  /**
   * Re-animate item after its getting hidden
   * @see ESLAnimateConfig.repeat
   */
  repeat: boolean;
  /**
   * Intersection ratio to consider element as visible.
   * Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
   * with a fixed set of thresholds defined.
   */
  ratio: string;
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

  @jsonAttr({name: ESLAnimateMixin.is})
  public options: AnimateOptions;

  public static defaultConfig: Partial<AnimateOptions> = {cls: 'in'};

  protected mergeDefaultParams(): AnimateOptions {
    const type = this.constructor as typeof ESLAnimateMixin;
    return Object.assign({}, type.defaultConfig, this.options);
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
    const {cls, ratio, repeat} = this.mergeDefaultParams();
    ESLAnimateService.unobserve(this.$host);
    memoize.clear(this, '$targets');
    ESLAnimateService.observe(this.$host, {force: true, cls, ratio: parseNumber(ratio, 0.4), repeat});
  }
}
