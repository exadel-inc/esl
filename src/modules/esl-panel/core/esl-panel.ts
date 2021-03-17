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

@ExportNs('Panel')
export class ESLPanel extends ESLToggleable {
  public static is = 'esl-panel';

  @attr({defaultValue: 'open'}) public activeClass: string;
  @attr({defaultValue: 'animate'}) public animateClass: string;
  @attr({defaultValue: 'post-animate'}) public postAnimateClass: string;
  @attr({defaultValue: 'auto'}) public fallbackDuration: number | 'auto';

  @jsonAttr<PanelActionParams>({defaultValue: {force: true, initiator: 'init'}})
  public initialParams: ToggleableActionParams;

  protected _initialHeight: number = 0;
  protected _fallbackTimer: number = 0;

  public get initialHeight() {
    return this._initialHeight;
  }

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

  protected beforeAnimate() {
    CSSUtil.addCls(this, this.animateClass);
    this.postAnimateClass && afterNextRender(() => CSSUtil.addCls(this, this.postAnimateClass));
  }

  protected onAnimate(action: string) {
    // set initial height
    this.style.setProperty('max-height', `${action === 'hide' ? this._initialHeight : 0}px`);
    // make sure that browser apply initial height for animation
    afterNextRender(() => {
      this.style.setProperty('max-height', `${action === 'hide' ? 0 : this._initialHeight}px`);
    });
  }

  protected afterAnimate() {
    this.clearAnimation();
    this.$$fire(this.open ? 'after:show' : 'after:hide');
  }

  protected clearAnimation() {
    this.style.removeProperty('max-height');
    CSSUtil.removeCls(this, this.animateClass);
    CSSUtil.removeCls(this, this.postAnimateClass);
  }

  protected fallbackAnimate() {
    const time = +this.fallbackDuration;
    if (isNaN(time) || time < 0) return;
    if (this._fallbackTimer) clearTimeout(this._fallbackTimer);
    this._fallbackTimer = window.setTimeout(() => this.afterAnimate(), time);
  }

  @bind
  protected _onTransitionEnd(e?: TransitionEvent) {
    if (!e || e.propertyName === 'max-height') {
      this.afterAnimate();
    }
  }

  /** The panels use panel group config for actions */
  protected mergeDefaultParams(params?: ToggleableActionParams): ToggleableActionParams {
    const stackConfig = this.$group?.panelConfig || {};
    return Object.assign({}, stackConfig, this.defaultParams, params || {});
  }
}
