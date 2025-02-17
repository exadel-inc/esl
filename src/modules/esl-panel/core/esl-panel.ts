import {ExportNs} from '../../esl-utils/environment/export-ns';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {attr, boolAttr, jsonAttr, listen} from '../../esl-utils/decorators';
import {afterNextRender, skipOneRender} from '../../esl-utils/async/raf';
import {ESLToggleable} from '../../esl-toggleable/core';

import type {ESLPanelGroup} from '../../esl-panel-group/core';
import type {ESLToggleableActionParams} from '../../esl-toggleable/core';

/** {@link ESLPanel} action params interface */
export interface ESLPanelActionParams extends ESLToggleableActionParams {
  /** Panel group */
  capturedBy?: ESLPanelGroup;
  /** Prevents collapsing/expanding animation */
  noAnimate?: boolean;
}

/**
 * ESLPanel component
 * @author Julia Murashko
 *
 * ESLPanel is a custom element that is used as a wrapper for content that can be shown or hidden.
 * Can use collapsing/expanding animation (smooth height change).
 * Can be used in conjunction with {@link ESLPanelGroup} to control a group of ESLPopups
 */
@ExportNs('Panel')
export class ESLPanel extends ESLToggleable {
  public static override is = 'esl-panel';

  /** Class(es) to be added for active state ('open' by default) */
  @attr({defaultValue: 'open'}) public override activeClass: string;
  /** Class(es) to be added during animation ('animate' by default) */
  @attr({defaultValue: 'animate'}) public animateClass: string;
  /** Class(es) to be added during animation after next render ('post-animate' by default) */
  @attr({defaultValue: 'post-animate'}) public postAnimateClass: string;

  /** CSS selector of the parent group (default: 'esl-panel-group') */
  @attr({defaultValue: 'esl-panel-group'}) public panelGroupSel: string;

  /** Initial params for current ESLPanel instance */
  @jsonAttr<ESLPanelActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public override initialParams: ESLPanelActionParams;

  /** Active while animation in progress */
  @boolAttr({readonly: true}) public animating: boolean;

  /** Inner height state that updates after show/hide actions but before show/hide events triggered */
  protected _initialHeight: number = 0;

  /** @returns Previous active panel height at the start of the animation */
  public get initialHeight(): number {
    return this._initialHeight;
  }

  /** @returns Closest panel group or null if not presented */
  public get $group(): ESLPanelGroup | null {
    if (this.groupName === 'none' || this.groupName) return null;
    return this.closest(this.panelGroupSel);
  }

  /** Process show action */
  protected override onShow(params: ESLPanelActionParams): void {
    this._initialHeight = this.scrollHeight;
    super.onShow(params);

    this.beforeAnimate();
    if (params.noAnimate) return this.postAnimate(params.capturedBy);
    this.onAnimate(0, this._initialHeight);
  }

  /** Process hide action */
  protected override onHide(params: ESLPanelActionParams): void {
    this._initialHeight = this.scrollHeight;
    super.onHide(params);

    this.beforeAnimate();
    if (params.noAnimate) return this.postAnimate(null);
    this.onAnimate(this._initialHeight, 0);
  }

  /** Pre-processing animation action */
  protected beforeAnimate(): void {
    this.toggleAttribute('animating', true);
    CSSClassUtils.add(this, this.animateClass);
    this.postAnimateClass && afterNextRender(() => CSSClassUtils.add(this, this.postAnimateClass));
  }

  /** Handles post animation process to initiate after animate step */
  protected postAnimate(capturedBy?: ESLPanelGroup | null): void {
    if (capturedBy && capturedBy.animating) {
      capturedBy.$$on({
        event: capturedBy.AFTER_ANIMATE_EVENT,
        once: true
      }, () => this.afterAnimate());
    } else {
      skipOneRender(() => this.afterAnimate());
    }
  }

  /** Process animation */
  protected onAnimate(from: number, to: number): void {
    // set initial height
    this.style.setProperty('max-height', `${from}px`);
    // make sure that browser applies initial height for animation
    afterNextRender(() => {
      this.style.setProperty('max-height', `${to}px`);
      this.fallbackAnimate();
    });
  }

  /** Checks if transition happens and runs afterAnimate step if transition is not presented*/
  protected fallbackAnimate(): void {
    afterNextRender(() => {
      const distance = parseFloat(this.style.maxHeight) - this.clientHeight;
      if (Math.abs(distance) <= 1) this.afterAnimate();
    });
  }

  /** Post-processing animation action */
  protected afterAnimate(): void {
    const {animating} = this;
    this.clearAnimation();
    // Prevent fallback calls from being tracked
    if (!animating) return;
    this.$$fire(this.open ? this.AFTER_SHOW_EVENT : this.AFTER_HIDE_EVENT);
  }

  /** Clear animation properties */
  protected clearAnimation(): void {
    this.toggleAttribute('animating', false);
    this.style.removeProperty('max-height');
    CSSClassUtils.remove(this, this.animateClass);
    CSSClassUtils.remove(this, this.postAnimateClass);
  }

  /** Catching CSS transition end event to start post-animate processing */
  @listen('transitionend')
  protected _onTransitionEnd(e?: TransitionEvent): void {
    if (!e || (e.propertyName === 'max-height' && e.target === this)) {
      this.afterAnimate();
    }
  }

  /** Merge params that are used by panel group for actions */
  protected override mergeDefaultParams(params?: ESLToggleableActionParams): ESLToggleableActionParams {
    const type = this.constructor as typeof ESLToggleable;
    const stackConfig = this.$group?.panelConfig || {};
    return Object.assign({}, stackConfig, type.DEFAULT_PARAMS, this.defaultParams, params || {});
  }
}

declare global {
  export interface ESLLibrary {
    Panel: typeof ESLPanel;
  }
  export interface HTMLElementTagNameMap {
    'esl-panel': ESLPanel;
  }
}
