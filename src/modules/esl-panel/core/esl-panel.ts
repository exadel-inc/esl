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
  noCollapse?: boolean;
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
  /** Time to clear animation common params (max-height style + classes) (1s by default) */
  @attr({defaultValue: '1000'}) public fallbackDuration: number | 'auto';

  /** Initial params for current ESLPanel instance */
  @jsonAttr<PanelActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public initialParams: PanelActionParams;

  /** Active while animation in progress */
  @boolAttr({readonly: true}) public animating: boolean;

  /** Inner height state that updates after show/hide actions but before show/hide events triggered */
  protected _initialHeight: number = 0;
  /** Inner timer to cleanup animation styles */
  protected _fallbackTimer: number = 0;

  /** @returns Previous active panel height at the start of the animation */
  public get initialHeight() {
    return this._initialHeight;
  }

  /** @returns Closest panel group or null if not presented */
  public get $group(): ESLPanelGroup | null {
    if (this.groupName === 'none' || this.groupName) return null;
    return this.closest(ESLPanelGroup.is);
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener('transitionend', this._onTransitionEnd);
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.removeEventListener('transitionend', this._onTransitionEnd);
  }

  /** Process show action */
  protected onShow(params: PanelActionParams) {
    super.onShow(params);
    this._initialHeight = this.offsetHeight;

    this.beforeAnimate();
    if (params.noCollapse) {
      afterNextRender(() => this.afterAnimate());
    } else {
      this.onAnimate('show');
    }
  }

  /** Process hide action */
  protected onHide(params: PanelActionParams) {
    this._initialHeight = this.offsetHeight;
    super.onHide(params);

    this.beforeAnimate();
    if (params.noCollapse) {
      afterNextRender(() => this.afterAnimate());
    } else {
      this.onAnimate('hide');
    }
  }

  /** Pre-processing animation action */
  protected beforeAnimate() {
    this.toggleAttribute('animating', true);
    CSSClassUtils.add(this, this.animateClass);
    this.postAnimateClass && afterNextRender(() => CSSClassUtils.add(this, this.postAnimateClass));
  }

  /** Process animation */
  protected onAnimate(action: string) {
    // set initial height
    this.style.setProperty('max-height', `${action === 'hide' ? this._initialHeight : 0}px`);
    // make sure that browser apply initial height for animation
    afterNextRender(() => {
      this.style.setProperty('max-height', `${action === 'hide' ? 0 : this._initialHeight}px`);
      this.fallbackAnimate();
    });
  }

  /** Post-processing animation action */
  protected afterAnimate() {
    this.clearAnimation();
    this.$$fire(this.open ? 'after:show' : 'after:hide');
  }

  /** Clear animation properties */
  protected clearAnimation() {
    this.toggleAttribute('animating', false);
    this.style.removeProperty('max-height');
    CSSClassUtils.remove(this, this.animateClass);
    CSSClassUtils.remove(this, this.postAnimateClass);
  }

  /** Init a fallback timer to call post-animate action */
  protected fallbackAnimate() {
    const time = +this.fallbackDuration;
    if (isNaN(time) || time < 0) return;
    if (this._fallbackTimer) clearTimeout(this._fallbackTimer);
    this._fallbackTimer = window.setTimeout(() => this.afterAnimate(), time);
  }

  /** Catching CSS transition end event to start post-animate processing */
  @bind
  protected _onTransitionEnd(e?: TransitionEvent) {
    if (!e || e.propertyName === 'max-height') {
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
