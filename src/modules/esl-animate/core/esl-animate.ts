import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ready} from '../../esl-utils/decorators/ready';
import {memoize} from '../../esl-utils/decorators/memoize';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {parseNumber} from '../../esl-utils/misc/format';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';

import {ESLAnimateService} from './esl-animate-service';

/**
 * ESLAnimate - custom element for quick {@link ESLAnimateService} attaching
 *
 * Have two types of usage:
 * - trough the target-s definition, then esl-animate (without it's own content) became invisible plugin-component
 * `<esl-animate target="::next"></esl-animate><div>Content</div>`
 * - trough the content wrapping
 * `<esl-animate>Content</esl-animate>`
 */
@ExportNs('Animate')
export class ESLAnimate extends ESLBaseElement {
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
    return TraversingQuery.all(this.target, this) as HTMLElement[];
  }

  protected attributeChangedCallback(): void {
    if (!this.connected) return;
    this.reanimate();
  }

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    this.reanimate();
  }

  @ready
  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this.$targets);
  }

  /** Reinitialize {@link ESLAnimateService} for targets */
  public reanimate(): void {
    ESLAnimateService.unobserve(this.$targets);
    memoize.clear(this, '$targets');
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
