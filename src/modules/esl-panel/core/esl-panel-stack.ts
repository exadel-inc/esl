import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLMediaQuery} from '../../esl-media-query/core';

import {ESLPanel} from './esl-panel';

@ExportNs('PanelStack')
export class ESLPanelStack extends ESLBaseElement {
  public static is = 'esl-panel-stack';

  @attr() public accordionTransformation: string;
  @attr({defaultValue: 'animate'}) public animationClass: string;
  @attr({defaultValue: 'accordion'}) public accordionClass: string;
  @attr({defaultValue: 'auto'}) public fallbackDuration: number;

  protected _previousHeight: number = 0;
  protected _transformationQuery: ESLMediaQuery;

  protected connectedCallback() {
    super.connectedCallback();
    this.onModeChange();
    this.bindEvents();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('esl:before:show', this._onBeforeShow);
    this.addEventListener('esl:show', this._onShow);
    this.addEventListener('esl:before:hide', this._onBeforeHide);

    this.addEventListener('transitionend', this._onTransitionEnd);
  }

  protected unbindEvents() {
    this.removeEventListener('esl:before:show', this._onBeforeShow);
    this.removeEventListener('esl:show', this._onShow);
    this.removeEventListener('esl:before:hide', this._onBeforeHide);

    this.removeEventListener('transitionend', this._onTransitionEnd);
  }

  /** Get all panels for which there is no specified group */
  public get panels(): ESLPanel[] {
    const els = Array.from(this.children);
    return els.filter((el) => (el instanceof ESLPanel) && !el.groupName) as ESLPanel[];
  }

  /** Get panel that is opened or undefined if all panels are closed */
  public get activePanel(): ESLPanel | undefined {
    return this.panels.find((el: ESLPanel) => el.open);
  }

  /** Condition-guard to check if the target is controlled panel */
  public includesPanel(target: any): target is ESLPanel {
    return this.panels.indexOf(target) !== -1;
  }

  /** Hide opened panel before a new one will be shown */
  @bind
  protected _onBeforeShow(e: CustomEvent) {
    if (!this.includesPanel(e.target)) return;
    this.activePanel?.hide();
  }

  @bind
  protected _onShow(e: CustomEvent) {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    if (this.isAccordion) return;

    this.beforeAnimate();
    this.onAnimate(this._previousHeight, panel.initialHeight);
    this.fallbackDuration >= 0 && setTimeout(() => this.afterAnimate(), this.fallbackDuration);
  }

  @bind
  protected _onBeforeHide(e: CustomEvent) {
    const target = e.target;
    if (!this.includesPanel(target)) return;
    this._previousHeight = this.offsetHeight;
  }

  /** Animate height of component */
  protected onAnimate(from?: number, to?: number) {
    // set initial height
    if (!this.style.height || this.style.height === 'auto') {
      this.style.height = `${from}px`;
    }
    // make sure that browser apply initial height to animate
    afterNextRender(() => {
      this.style.height = `${to}px`;
    });
  }

  /** Set animation class */
  protected beforeAnimate() {
    CSSUtil.addCls(this, this.animationClass);
  }

  /** Remove animation class */
  protected afterAnimate() {
    this.style.removeProperty('height');
    CSSUtil.removeCls(this, this.animationClass);
  }

  /** Clean up the bits of animation */
  @bind
  protected _onTransitionEnd(e?: TransitionEvent) {
    if (!e || e.propertyName === 'height') {
      this.afterAnimate();
    }
  }

  get transformationQuery() {
    if (!this._transformationQuery) {
      const query = this.accordionTransformation || ESLMediaQuery.NOT_ALL;
      this.transformationQuery = new ESLMediaQuery(query);
    }
    return this._transformationQuery;
  }
  set transformationQuery(query) {
    if (this._transformationQuery) {
      this._transformationQuery.removeListener(this.onModeChange);
    }
    this._transformationQuery = query;
    this._transformationQuery.addListener(this.onModeChange);
  }

  /** Check if mode is accordion */
  get isAccordion() {
    return this.transformationQuery.matches;
  }

  /** Get config that is used to form result panel action params */
  get panelConfig() {
    return {
      noCollapse: !this.isAccordion
    };
  }

  /** Toggle accordion class according to mode */
  protected onModeChange = () => {
    CSSUtil.toggleClsTo(this, this.accordionClass, this.isAccordion);
  };
}

export default ESLPanelStack;
