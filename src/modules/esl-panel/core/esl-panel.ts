import {ExportNs} from '../../esl-utils/environment/export-ns';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {bind} from '../../esl-utils/decorators/bind';
import {afterNextRender} from '../../esl-utils/async/raf';
import {attr, boolAttr, jsonAttr} from '../../esl-base-element/core';
import {ESLToggleable} from '../../esl-toggleable/core';
import {ESLPanelGroup} from '../../esl-panel-group/core';

import type {ToggleableActionParams} from '../../esl-toggleable/core';

/** {@link ESLPanel} action params interface */
export interface PanelActionParams extends ToggleableActionParams {
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
  public static is = 'esl-panel';

  /** Class(es) to be added for active state ('open' by default) */
  @attr({defaultValue: 'open'}) public activeClass: string;
  /** Class(es) to be added during animation ('animate' by default) */
  @attr({defaultValue: 'animate'}) public animateClass: string;
  /** Class(es) to be added during animation after next render ('post-animate' by default) */
  @attr({defaultValue: 'post-animate'}) public postAnimateClass: string;

  /** Initial params for current ESLPanel instance */
  @jsonAttr<PanelActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public initialParams: PanelActionParams;

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
    return this.closest(ESLPanelGroup.is);
  }

  protected bindEvents(): void {
    super.bindEvents();
    this.addEventListener('transitionend', this._onTransitionEnd);
  }

  protected unbindEvents(): void {
    super.unbindEvents();
    this.removeEventListener('transitionend', this._onTransitionEnd);
  }

  /** Process show action */
  protected onShow(params: PanelActionParams): void {
    this._initialHeight = this.scrollHeight;
    super.onShow(params);

    this.beforeAnimate();
    if (params.noAnimate) {
      afterNextRender(() => this.afterAnimate());
    } else {
      this.onAnimate(0, this._initialHeight);
    }
  }

  /** Process hide action */
  protected onHide(params: PanelActionParams): void {
    this._initialHeight = this.scrollHeight;
    super.onHide(params);

    this.beforeAnimate();
    if (params.noAnimate) {
      afterNextRender(() => this.afterAnimate());
    } else {
      this.onAnimate(this._initialHeight, 0);
    }
  }

  /** Pre-processing animation action */
  protected beforeAnimate(): void {
    this.toggleAttribute('animating', true);
    CSSClassUtils.add(this, this.animateClass);
    this.postAnimateClass && afterNextRender(() => CSSClassUtils.add(this, this.postAnimateClass));
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
    this.$$fire(this.open ? 'after:show' : 'after:hide');
  }

  /** Clear animation properties */
  protected clearAnimation(): void {
    this.toggleAttribute('animating', false);
    this.style.removeProperty('max-height');
    CSSClassUtils.remove(this, this.animateClass);
    CSSClassUtils.remove(this, this.postAnimateClass);
  }

  /** Catching CSS transition end event to start post-animate processing */
  @bind
  protected _onTransitionEnd(e?: TransitionEvent): void {
    if (!e || (e.propertyName === 'max-height' && e.target === this)) {
      this.afterAnimate();
    }
  }

  /** Merge params that are used by panel group for actions */
  protected mergeDefaultParams(params?: ToggleableActionParams): ToggleableActionParams {
    const stackConfig = this.$group?.panelConfig || {};
    return Object.assign({}, stackConfig, this.defaultParams, params || {});
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
