import {ExportNs} from '../../esl-utils/environment/export-ns';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {afterNextRender} from '../../esl-utils/async/raf';
import {attr, boolAttr, jsonAttr} from '../../esl-base-element/core';
import {ESLBasePopup, PopupActionParams} from '../../esl-base-popup/core';

import ESLPanelStack from './esl-panel-stack';

export interface PanelActionParams extends PopupActionParams {
  noCollapse?: boolean;
  noAnimation?: boolean;
}

@ExportNs('Panel')
export class ESLPanel extends ESLBasePopup {
  public static is = 'esl-panel';

  @attr({defaultValue: 'open'}) public activeClass: string;
  @attr({defaultValue: 'animate'}) public animateClass: string;
  @attr({defaultValue: 'post-animate'}) public postAnimateClass: string;
  @attr({defaultValue: 'auto'}) public fallbackDuration: number;

  @boolAttr() public isAccordion: boolean;
  @boolAttr() public startAnimation: boolean;

  @jsonAttr<PanelActionParams>({defaultValue: {silent: true, force: true, initiator: 'init', noAnimation: true}})
  public initialParams: PopupActionParams;

  public initialHeight: number;

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
    this.initialHeight = this.scrollHeight;

    if (params.noAnimation) return;

    this.beforeAnimate(params);
    if (!params.noCollapse) {
      this.onHeightAnimate('show', params);
      this.fallbackDuration >= 0 && setTimeout(this._onTransitionEnd, this.fallbackDuration);
    }
    this.afterAnimate(params);
  }

  protected onHide(params: PanelActionParams) {
    this.initialHeight = this.scrollHeight;
    super.onHide(params);

    if (params.noAnimation) return;

    this.beforeAnimate(params);
    if (!params.noCollapse) {
      this.onHeightAnimate('hide', params);
      this.fallbackDuration >= 0 && setTimeout(this._onTransitionEnd, this.fallbackDuration);
    }
    this.afterAnimate(params);
  }

  @bind
  protected _onTransitionEnd(e?: TransitionEvent) {
    if (!e || e.propertyName === 'max-height') {
      // TODO: state is not 'safe' as we can not be sure in caller
      this.style.removeProperty('max-height');
      // TODO: move to afterAnimate!
      this.$$fire(this.open ? 'after:show' : 'after:hide');
    }
  }

  protected beforeAnimate(params: PanelActionParams) {
    CSSUtil.addCls(this, this.animateClass);
    this.postAnimateClass && afterNextRender(() => CSSUtil.addCls(this, this.postAnimateClass));
  }

  protected onHeightAnimate(action: string, params: PanelActionParams) {
    // set initial height
    this.style.setProperty('max-height', `${action === 'hide' ? this.initialHeight : 0}px`);
    // make sure that browser apply initial height for animation
    afterNextRender(() => {
      this.style.setProperty('max-height', `${action === 'hide' ? 0 : this.initialHeight}px`);
    });
  }

  protected afterAnimate(params: PanelActionParams) {
    // FIXME: that is not working!!!
    params.noCollapse && this.style.removeProperty('max-height');
    CSSUtil.removeCls(this, this.animateClass);
    CSSUtil.removeCls(this, this.postAnimateClass);
  }

  /**
   * the panels use panel stack config for actions
   */
  protected mergeDefaultParams(params?: PopupActionParams): PopupActionParams {
    const stackConfig = this.stack?.panelConfig || {};
    return Object.assign({}, stackConfig, this.defaultParams, params || {});
  }

  public get stack(): ESLPanelStack | null {
    return this.closest(ESLPanelStack.is);
  }
}

export default ESLPanel;
