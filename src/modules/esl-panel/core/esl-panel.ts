import {ExportNs} from '../../esl-utils/environment/export-ns';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {afterNextRender} from '../../esl-utils/async/raf';
import {attr, jsonAttr} from '../../esl-base-element/core';
import {ESLToggleable, ToggleableActionParams} from '../../esl-toggleable/core';
import {ESLPanelGroup} from './esl-panel-group';

export interface PanelActionParams extends ToggleableActionParams {
  noCollapse?: boolean;
}

/**
 * ESLPanel - is a custom element, that is used as a wrapper for content that
 * can be shown/hidden or collapsed (animated height change).
 * @author Julia Murashko
 */
@ExportNs('Panel')
export class ESLPanel extends ESLToggleable {
  public static is = 'esl-panel';

  /** Classes to be added while active state*/
  @attr({defaultValue: 'open'}) public activeClass: string;
  /** Classes to be added during animation */
  @attr({defaultValue: 'animate'}) public animateClass: string;
  /** Classes to be added during animation after next render*/
  @attr({defaultValue: 'post-animate'}) public postAnimateClass: string;
  /** Time after which the animation will be cleared */
  @attr({defaultValue: 'auto'}) public fallbackDuration: number | 'auto';

  /** Initial params for current ESLPanel instance */
  @jsonAttr<PanelActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public initialParams: ToggleableActionParams;

  protected _initialHeight: number = 0;
  protected _fallbackTimer: number = 0;

  /** @returns {number} panel offset height at the start */
  public get initialHeight() {
    return this._initialHeight;
  }

  /** @returns {ESLPanelGroup | null} closest panel group or null if not presented */
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

  /** Process show event */
  protected onShow(params: PanelActionParams) {
    super.onShow(params);
    this.clearAnimation();
    this._initialHeight = this.offsetHeight;

    this.beforeAnimate();
    if (params.noCollapse) {
      afterNextRender(() => this.afterAnimate());
    } else {
      this.onAnimate('show');
      this.fallbackAnimate();
    }
  }

  /** Process hide event */
  protected onHide(params: PanelActionParams) {
    this.clearAnimation();
    this._initialHeight = this.offsetHeight;
    super.onHide(params);

    this.beforeAnimate();
    if (params.noCollapse) {
      afterNextRender(() => this.afterAnimate());
    } else {
      this.onAnimate('hide');
      this.fallbackAnimate();
    }
  }

  /** Prepare for animation */
  protected beforeAnimate() {
    CSSUtil.addCls(this, this.animateClass);
    this.postAnimateClass && afterNextRender(() => CSSUtil.addCls(this, this.postAnimateClass));
  }

  /** Process animation */
  protected onAnimate(action: string) {
    // set initial height
    this.style.setProperty('max-height', `${action === 'hide' ? this._initialHeight : 0}px`);
    // make sure that browser apply initial height for animation
    afterNextRender(() => {
      this.style.setProperty('max-height', `${action === 'hide' ? 0 : this._initialHeight}px`);
    });
  }

  /** Process after animation state */
  protected afterAnimate() {
    this.clearAnimation();
    this.$$fire(this.open ? 'after:show' : 'after:hide');
  }

  /** Clear animation */
  protected clearAnimation() {
    this.style.removeProperty('max-height');
    CSSUtil.removeCls(this, this.animateClass);
    CSSUtil.removeCls(this, this.postAnimateClass);
  }

  /** Clear animation after fallback time  */
  protected fallbackAnimate() {
    const time = +this.fallbackDuration;
    if (isNaN(time) || time < 0) return;
    if (this._fallbackTimer) clearTimeout(this._fallbackTimer);
    this._fallbackTimer = window.setTimeout(() => this.afterAnimate(), time);
  }

  /** Clean up the bits of animation */
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
