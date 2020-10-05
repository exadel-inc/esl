import {ExportNs} from '../../esl-utils/enviroment/export-ns';

import {attr, boolAttr} from '../../esl-base-element/esl-base-element';
import {afterNextRender} from '../../esl-utils/async/raf';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLBasePopup, PopupActionParams} from '../../esl-base-popup/ts/esl-base-popup';
import {ESLMediaQuery} from '../../esl-utils/conditions/esl-media-query';
import ESLPanelStack from './esl-panel-stack';

export interface PanelActionParams extends PopupActionParams {
}

@ExportNs('Panel')
export class ESLPanel extends ESLBasePopup {
  public static is = 'esl-panel';
  public static eventNs = 'esl:panel';

  @attr({defaultValue: 'open'}) public activeClass: string;
  @attr({defaultValue: 'animate'}) public animateClass: string;
  @attr({defaultValue: 'fade-animate'}) public postAnimateClass: string;
  @attr({defaultValue: 'auto'}) public fallbackDuration: number;
  @attr({defaultValue: 'accordion'}) public accordionClass: string;
  @attr({defaultValue: 'esl-fade'}) public fadeAnimateClass: string;
  @attr() public accordionTransformation: string;
  @boolAttr() public noAnimation: boolean;
  @boolAttr() public fadeAnimation: boolean;

  public initialHeight: number;

  private _accordionTransformationQuery: ESLMediaQuery;

  static get observedAttributes() {
    return ['no-animation'];
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.onTransformationChange();
    if (this.stack || this.fadeAnimation) {
      this.fadeAnimation = this.fadeAnimation || this.stack?.fadeAnimation || false;
      CSSUtil.addCls(this, this.fadeAnimateClass);
    }
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (!this.connected && oldVal === newVal) return;
    if (attrName === 'no-animation') {
      this.afterAnimate();
    }
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener('transitionend', this.onTransitionEnd);
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.removeEventListener('transitionend', this.onTransitionEnd);
  }

  protected onShow(params: PanelActionParams) {
    super.onShow(params);
    this.initialHeight = this.scrollHeight;
    // Skip max-height animation
    this.noAnimation && this.beforeAnimate(params);
    if (!this.noAnimation) {
      this.onAnimate('show', params);
    }
    if (this.fallbackDuration >= 0 && !this.noAnimation) {
      setTimeout(this.onTransitionEnd, this.fallbackDuration);
    }
    this.noAnimation && this.afterAnimate();
  }

  protected onHide(params: PanelActionParams) {
    this.initialHeight = this.scrollHeight;
    super.onHide(params);

    // Skip max-height animation
    this.noAnimation && this.beforeAnimate(params);
    if (!this.noAnimation) {
      this.onAnimate('hide', params);
    }
    if (this.fallbackDuration >= 0 && !this.noAnimation) {
      setTimeout(this.onTransitionEnd, this.fallbackDuration);
    }
    this.noAnimation && this.afterAnimate();
  }

  protected onTransitionEnd = (e?: TransitionEvent) => {
    if (!e || e.propertyName === 'max-height' || e.propertyName === 'opacity') {
      this.afterAnimate();
      this.$$fireNs('transitionend', {
        detail: {open: this.open}
      });
    }
  };

  protected beforeAnimate(params: PanelActionParams) {
    CSSUtil.addCls(this, this.animateClass);
    this.postAnimateClass && afterNextRender(() => CSSUtil.addCls(this, this.postAnimateClass));
  }

  protected onAnimate(action: string, params: PanelActionParams) {
    // set initial height
    this.style.setProperty('max-height', `${action === 'hide' ? this.initialHeight : 0}px`);
    // make sure that browser apply initial height for animation
    afterNextRender(() => {
      this.style.setProperty('max-height', `${action === 'hide' ? 0 : this.initialHeight}px`);
    });
  }

  protected afterAnimate() {
    this.style.removeProperty('max-height');
    CSSUtil.removeCls(this, this.animateClass);
    CSSUtil.removeCls(this, this.postAnimateClass);
  }

  get transformationQuery() {
    if (!this._accordionTransformationQuery) {
      const stackQuery = this.stack && this.stack.accordionTransformation;
      const query = this.accordionTransformation || stackQuery || ESLMediaQuery.NOT_ALL;
      this.transformationQuery = new ESLMediaQuery(query);
    }
    return this._accordionTransformationQuery;
  }

  set transformationQuery(query) {
    if (this._accordionTransformationQuery) {
      this._accordionTransformationQuery.removeListener(this.onTransformationChange);
    }
    this._accordionTransformationQuery = query;
    this._accordionTransformationQuery.addListener(this.onTransformationChange);
  }

  get isAccordion() {
    return this.transformationQuery.matches;
  }

  protected onTransformationChange = () => {
    if (this.stack) {
      this.noAnimation = !this.stack.isAccordion;
    }
    CSSUtil.toggleClsTo(this, this.accordionClass, this.isAccordion);
  };

  public get stack(): ESLPanelStack | null {
    return this.closest(ESLPanelStack.is);
  }
}

export default ESLPanel;
