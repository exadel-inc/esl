import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLMediaQuery} from '../../esl-media-query/core';

import ESLPanel from './esl-panel';

@ExportNs('PanelStack')
export class ESLPanelStack extends ESLBaseElement {
  public static is = 'esl-panel-stack';
  public static eventNs = 'esl:panel-stack';

  @attr() public accordionTransformation: string;
  @attr({defaultValue: 'animate'}) public animateClass: string;
  @attr({defaultValue: 'accordion'}) public accordionClass: string;

  protected previousHeight: number;
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
    this.addEventListener(`${ESLPanel.eventNs}:statechange`, this.onStateChange);
    this.addEventListener(`${ESLPanel.eventNs}:beforestatechange`, this.onBeforeStateChange);
    this.addEventListener('transitionend', this.onTransitionEnd);
  }

  protected unbindEvents() {
    this.removeEventListener(`${ESLPanel.eventNs}:statechange`, this.onStateChange);
    this.removeEventListener(`${ESLPanel.eventNs}:beforestatechange`, this.onBeforeStateChange);
    this.removeEventListener('transitionend', this.onTransitionEnd);
  }

  public get panels(): ESLPanel[] {
    const els = Array.from(this.children);
    return els.filter((el) => el instanceof ESLPanel) as ESLPanel[];
  }

  public get current(): ESLPanel | undefined {
    return this.panels.find((el: ESLPanel) => el.open);
  }

  protected onStateChange = (e: CustomEvent) => {
    if (!e.detail.open) return;
    if (this.isAccordion) return;
    const panel = e.target as ESLPanel;
    this.beforeAnimate();
    this.onAnimate(this.previousHeight, panel.initialHeight);
    // TODO: fallbackDuration
  };

  protected onBeforeStateChange = (e: CustomEvent) => {
    if (e.detail.open) {
      this.previousHeight = this.offsetHeight;
    }
  };

  protected onAnimate(from?: number, to?: number) {
    // set initial height
    if (!this.style.height || this.style.height === 'auto') {
      this.style.height = `${from}px`;
    }
    // make sure that browser apply initial height for animation
    afterNextRender(() => {
      this.style.height = `${to}px`;
    });
  }

  protected beforeAnimate() {
    CSSUtil.addCls(this, this.animateClass);
  }

  protected afterAnimate() {
    CSSUtil.removeCls(this, this.animateClass);
  }

  protected onTransitionEnd = (e?: TransitionEvent) => {
    if (!e || e.propertyName === 'height') {
      this.style.removeProperty('height');
      this.afterAnimate();
    }
  };

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

  get isAccordion() {
    return this.transformationQuery.matches;
  }

  /**
   * config that used to form result panel action params
   */
  get panelConfig() {
    return {
      noCollapse: !this.isAccordion
    };
  }

  protected onModeChange = () => {
    CSSUtil.toggleClsTo(this, this.accordionClass, this.isAccordion);
  };
}

export default ESLPanelStack;
