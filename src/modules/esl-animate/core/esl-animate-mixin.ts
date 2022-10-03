import {attr, boolAttr, ESLMixinElement} from '../../esl-mixin-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ready} from '../../esl-utils/decorators/ready';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {parseNumber} from '../../esl-utils/misc/format';

import {ESLAnimateService} from './esl-animate-service';

/**
 * ESLAnimateMixin - custom mixin element for quick {@link ESLAnimateService} attaching
 *
 * Have two types of usage:
 * - trough the target-s definition, then esl-animate (without it's own content) became invisible plugin-component
 * `<div esl-animate target="::next"></div><div>Content</div>`
 * - trough the content wrapping
 * `<div esl-animate>Content</div>`
 */
@ExportNs('AnimateMixin')
export class ESLAnimateMixin extends ESLMixinElement {
  public static is = 'esl-animate';
  public static observedAttributes = ['group', 'repeat', 'target'];

  /**
   * Class(es) to add on viewport intersection
   * @see ESLAnimateConfig.cls
   */
  @attr({defaultValue: 'in'}) public cls: string;

  /**
   * Enable group animation for targets
   * @see ESLAnimateConfig.group
   */
  @boolAttr() public group: boolean;

  /**
   * Delay to start animation from previous item in group
   * @see ESLAnimateConfig.groupDelay
   */
  @attr({defaultValue: '100'}) public groupDelay: string;

  /**
   * Re-animate item after its getting hidden
   * @see ESLAnimateConfig.repeat
   */
  @boolAttr() public repeat: boolean;

  /**
   * Intersection ratio to consider element as visible.
   * Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
   * with a fixed set of thresholds defined.
   */
  @attr() public ratio: string;

  /**
   * Define target(s) to observe and animate
   * Uses {@link TraversingQuery} with multiple targets support
   * Default: ` ` - current element, `<esl-animate>` behave as a wrapper
   */
  @attr() public target: string;

  /** Elements-targets found by target query */
  @memoize()
  public get $targets(): HTMLElement[] {
    return ESLTraversingQuery.all(this.target, this.$host) as HTMLElement[];
  }

  public attributeChangedCallback(): void {
    this.reanimate();
  }

  @ready
  public connectedCallback(): void {
    super.connectedCallback();
    this.reanimate();
  }

  @ready
  public disconnectedCallback(): void {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this.$targets);
  }

  /** Reinitialize {@link ESLAnimateService} for targets */
  public reanimate(): void {
    ESLAnimateService.unobserve(this.$targets);
    memoize.clear(this.$host, '$targets');
    ESLAnimateService.observe(this.$targets, {
      force: true,
      cls: this.cls,
      ratio: parseNumber(this.ratio, 0.4),
      repeat: this.repeat,
      group: this.group,
      groupDelay: parseNumber(this.groupDelay, 0)
    });
  }
}
