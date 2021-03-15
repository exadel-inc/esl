import {ExportNs} from '../../esl-utils/environment/export-ns';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {afterNextRender} from '../../esl-utils/async/raf';
import {attr, boolAttr, jsonAttr} from '../../esl-base-element/core';
import {ESLToggleable, ToggleableActionParams} from '../../esl-toggleable/core';
import {ESLPanelGroup} from './esl-panel-group';

export interface PanelActionParams extends ToggleableActionParams {
  noCollapse?: boolean;
  noAnimation?: boolean;
}

@ExportNs('Panel')
export class ESLPanel extends ESLToggleable {
  public static is = 'esl-panel';

  @attr({defaultValue: 'open'}) public activeClass: string;
  @attr({defaultValue: 'animate'}) public animateClass: string;
  @attr({defaultValue: 'post-animate'}) public postAnimateClass: string;
  @attr({defaultValue: 'auto'}) public fallbackDuration: number | 'auto';

  @boolAttr() public isAccordion: boolean;
  @boolAttr() public startAnimation: boolean;
  @boolAttr() public noAnimation: boolean;

  @jsonAttr<PanelActionParams>({defaultValue: {force: true, initiator: 'init', noAnimation: true}})
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
    this._initialHeight = this.offsetHeight;

    if (params.noAnimation) return;

    this.beforeAnimate();
    if (params.noCollapse) {
      afterNextRender(() => this.afterAnimate());
    } else {
      this.onAnimate('show');
      this.fallbackAnimate();
    }
  }

  protected onHide(params: PanelActionParams) {
    this._initialHeight = this.offsetHeight;
    super.onHide(params);

    if (params.noAnimation) return;

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
    this.style.removeProperty('max-height');
    CSSUtil.removeCls(this, this.animateClass);
    CSSUtil.removeCls(this, this.postAnimateClass);

    this.$$fire(this.open ? 'after:show' : 'after:hide');
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

  /** The panels use panel stack config for actions */
  protected mergeDefaultParams(params?: ToggleableActionParams): ToggleableActionParams {
    const groupConfig = this.$group?.panelConfig || {};
    const mergedAttrs =  Object.assign({noAnimation: this.noAnimation}, {noAnimation: groupConfig?.noAnimation});
    return Object.assign({}, groupConfig, this.defaultParams, {noAnimation: groupConfig}, mergedAttrs, params || {});
  }
}
