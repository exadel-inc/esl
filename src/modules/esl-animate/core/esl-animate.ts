import {ExportNs} from '../../esl-utils/environment/export-ns';
import {memoize, ready, TraversingQuery} from '../../all';
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
 **/
@ExportNs('Animate')
export class ESLAnimate extends ESLBaseElement {
  static is = 'esl-animate';

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
   * Define target(s) to observe and animate
   * Uses {@link TraversingQuery} with multiple targets support
   * Default: ` ` - current element, `<esl-animate>` behave as a wrapper
   */
  @attr() public target: string;

  static get observedAttributes() {
    return ['group', 'repeat', 'target'];
  }

  /** Elements-targets found by target query */
  @memoize()
  public get $targets() {
    return TraversingQuery.all(this.target, this);
  }

  protected attributeChangedCallback() {
    if (!this.connected) return;
    this.reanimate();
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
    this.reanimate();
  }

  @ready
  protected disconnectedCallback() {
    super.disconnectedCallback();
    ESLAnimateService.unobserve(this.$targets);
  }

  /** Reinitialize {@link ESLAnimateService} for targets */
  public reanimate() {
    ESLAnimateService.unobserve(this.$targets);
    memoize.clear(this, '$targets');
    ESLAnimateService.observe(this.$targets, {
      force: true,
      cls: this.cls,
      repeat: this.repeat,
      group: this.group,
      groupDelay: +this.groupDelay
    });
  }
}
