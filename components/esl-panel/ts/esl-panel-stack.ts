import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/esl-base-element';
import ESLPanel from './esl-panel';
import {afterNextRender} from "../../esl-utils/async/raf";
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLMediaQuery} from "../../esl-utils/conditions/esl-media-query";

@ExportNs('PanelStack')
export class ESLPanelStack extends ESLBaseElement {
  public static is = 'esl-panel-stack';
  public static eventNs = 'esl:panel-stack';

  @attr() public accordionTransformation: string;
  @attr({defaultValue: 'animate'}) public animateClass: string;
  @attr({defaultValue: 'accordion'}) public accordionClass: string;
  @boolAttr() public fadeAnimation: boolean;

  protected previousHeight: number;
  protected accordionTransformationQuery: ESLMediaQuery;

  protected connectedCallback() {
    super.connectedCallback();
    this.onTransformationChange();
    this.updatePanels();
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
    this.addEventListener(`${ESLPanel.eventNs}:beforestatechange`, this.onBeforeStateChange);
    this.addEventListener('transitionend', this.onTransitionEnd);
  }

  get $panels(): ESLPanel[] {
    const els = this.querySelectorAll(ESLPanel.is);
    return els ? Array.from(els) as ESLPanel[] : [];
  }

  public get current(): ESLPanel | undefined {
    return this.$panels.find((el: ESLPanel) => el.open);
  }

  protected updatePanels() {
    this.$panels.forEach((el: ESLPanel) => el.noAnimation = true);
  }

  protected onStateChange = (e: CustomEvent) => {
    if (!e.detail.open) return;
    const panel = e.target as ESLPanel;
    this.beforeAnimate();
    this.onAnimate(this.previousHeight, panel.initialHeight);
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
    if (!this.accordionTransformationQuery) {
      const query = this.accordionTransformationQuery || ESLMediaQuery.NOT_ALL;
      this.transformationQuery = new ESLMediaQuery(query);
    }
    return this.accordionTransformationQuery;
  }

  set transformationQuery(query) {
    if (this.accordionTransformationQuery) {
      this.accordionTransformationQuery.removeListener(() => this.onTransformationChange());
    }
    this.accordionTransformationQuery = query;
    this.accordionTransformationQuery.addListener(() => this.onTransformationChange());
  }

  get isAccordion() {
    return this.transformationQuery.matches;
  }

  protected onTransformationChange() {}
}

export default ESLPanelStack;