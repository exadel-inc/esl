import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLPanel} from './esl-panel';

@ExportNs('PanelGroup')
export class ESLPanelGroup extends ESLBaseElement {
  public static is = 'esl-panel-group';

  @attr() public mode: string;
  @attr({defaultValue: 'animate'}) public animationClass: string;
  @attr({defaultValue: 'accordion'}) public accordionClass: string;
  @attr({defaultValue: 'auto'}) public fallbackDuration: number;

  private _modeRules: ESLMediaRuleList<string>;
  protected _previousHeight: number = 0;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'mode') {
      this.modeRules = ESLMediaRuleList.parse<string>(newVal, ESLMediaRuleList.STRING_PARSER);
      this.update();
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();

    this.modeRules.addListener(this._onModeChange);
    this.update();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.modeRules.removeListener(this._onModeChange);

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
    return this.panels.includes(target);
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
    if (this.currentMode !== 'tabs') return;

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

  /** Get config that is used to form result panel action params */
  public get panelConfig() {
    return {
      noCollapse: this.currentMode === 'tabs'
    };
  }

  public get modeRules() {
    if (!this._modeRules) {
      this.modeRules = ESLMediaRuleList.parse<string>(this.mode, ESLMediaRuleList.STRING_PARSER);
    }
    return this._modeRules;
  }

  public set modeRules(rules: ESLMediaRuleList<string>) {
    if (this._modeRules) {
      this._modeRules.removeListener(this._onModeChange);
    }
    this._modeRules = rules;
    this._modeRules.addListener(this._onModeChange);
  }

  public get currentMode() {
    return this.modeRules.activeValue;
  }

  /** Update component according to mode */
  @bind
  private _onModeChange() {
    this.update();
  }

  protected update() {
      CSSUtil.toggleClsTo(this, this.accordionClass, this.currentMode !== 'tabs');
  }
}
