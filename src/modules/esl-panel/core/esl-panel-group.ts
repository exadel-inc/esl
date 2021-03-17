import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLPanel, PanelActionParams} from './esl-panel';
import {TraversingQuery} from '../../esl-traversing-query/core';

@ExportNs('PanelGroup')
export class ESLPanelGroup extends ESLBaseElement {
  public static is = 'esl-panel-group';
  public static supportedModes = ['tabs', 'accordion'];

  @attr({defaultValue: 'accordion'}) public mode: string;
  @attr({defaultValue: ''}) public modeClsTarget: string;
  @attr({defaultValue: 'animate'}) public animationClass: string;
  @attr({defaultValue: 'auto'}) public fallbackDuration: number | 'auto';
  @attr() public noCollapse: string;

  private _modeRules: ESLMediaRuleList<string>;

  protected _previousHeight: number = 0;
  protected _fallbackTimer: number = 0;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'mode') {
      this.modeRules = ESLMediaRuleList.parse<string>(newVal, ESLMediaRuleList.STRING_PARSER);
      this.updateMode();
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();

    this.modeRules.addListener(this._onModeChange);
    this.updateMode();
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
  public get $panels(): ESLPanel[] {
    const els = Array.from(this.querySelectorAll(ESLPanel.is));
    return els.filter((el) => this.includesPanel(el)) as ESLPanel[];
  }

  /** Get all active panels */
  public get $activePanels() {
    return this.$panels.filter((el: ESLPanel) => el.open);
  }

  /** Condition-guard to check if the target is controlled panel */
  public includesPanel(target: any): target is ESLPanel {
    if (!(target instanceof ESLPanel)) return false;
    return target.$group === this;
  }

  /** Hide opened panel before a new one will be shown */
  @bind
  protected _onBeforeShow(e: CustomEvent) {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    this.$activePanels.forEach((el) => (el !== panel) && el.hide());
  }

  @bind
  protected _onShow(e: CustomEvent) {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    if (this.currentMode !== 'tabs') return;

    this.beforeAnimate();
    if (this.shouldCollapse) {
      this.onAnimate(this._previousHeight, panel.initialHeight);
      this.fallbackAnimate();
    } else {
      afterNextRender(() => this.afterAnimate());
    }
  }

  @bind
  protected _onBeforeHide(e: CustomEvent) {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    this._previousHeight = this.offsetHeight;
  }

  /** Animate height of the component */
  protected onAnimate(from: number, to: number) {
    const hasCurrent = this.style.height && this.style.height !== 'auto';
    if (hasCurrent) {
      this.style.height = `${to}px`;
    } else {
      // set initial height
      this.style.height = `${from}px`;
      // make sure that browser apply initial height to animate
      afterNextRender(() => this.style.height = `${to}px`);
    }
  }

  /** Prepare for animation */
  protected beforeAnimate() {
    CSSUtil.addCls(this, this.animationClass);
  }

  /** Clear animation */
  protected afterAnimate() {
    this.style.removeProperty('height');
    CSSUtil.removeCls(this, this.animationClass);
  }

  protected fallbackAnimate() {
    const time = +this.fallbackDuration;
    if (isNaN(time) || time < 0) return;
    if (this._fallbackTimer) clearTimeout(this._fallbackTimer);
    this._fallbackTimer = window.setTimeout(() => this.afterAnimate(), time);
  }

  /** Clean up the bits of animation */
  @bind
  protected _onTransitionEnd(e?: TransitionEvent) {
    if (!e || e.propertyName === 'height') {
      this.afterAnimate();
    }
  }

  public get shouldCollapse() {
    const noCollapseModes = this.noCollapse.split(',').map((mode) => mode.trim());
    return !noCollapseModes.includes('all') && !noCollapseModes.includes(this.currentMode);
  }

  /** Get config that is used to form result panel action params */
  public get panelConfig(): PanelActionParams {
    return {
      noCollapse: !this.shouldCollapse || (this.currentMode === 'tabs')
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

  public get currentMode(): string {
    return this.modeRules.activeValue || '';
  }

  /** Update component according to the mode */
  @bind
  private _onModeChange() {
    this.updateMode();
  }

  /** Set active mode though view attr */
  protected updateMode() {
    this.setAttribute('view', this.currentMode);
    const $target = this.modeClsTarget && TraversingQuery.first(this.modeClsTarget, this);
    if (!$target) return;
    ESLPanelGroup.supportedModes.forEach((mode) => {
      $target.classList.toggle(`esl-${mode}-view`, this.currentMode === mode);
    });
  }
}
