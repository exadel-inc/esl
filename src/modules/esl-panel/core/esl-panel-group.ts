import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLPanel, PanelActionParams} from './esl-panel';
import {TraversingQuery} from '../../esl-traversing-query/core';

/**
 * ESLPanelGroup - is a custom element, that is used as a wrapper for content that
 * can be shown/hidden or collapsed (height animation).
 * @author Julia Murashko
 */
@ExportNs('PanelGroup')
export class ESLPanelGroup extends ESLBaseElement {
  public static is = 'esl-panel-group';
  /** List of supported modes */
  public static supportedModes = ['tabs', 'accordion'];

  /** Mode of the component (takes values from list of supported modes) */
  @attr({defaultValue: 'accordion'}) public mode: string;
  /** Target element {@link TraversingQuery} select to add mode classes */
  @attr({defaultValue: ''}) public modeClsTarget: string;
  /** Classes to be added during animation */
  @attr({defaultValue: 'animate'}) public animationClass: string;
  /** Time after which the animation will be cleared */
  @attr({defaultValue: 'auto'}) public fallbackDuration: number | 'auto';
  /** Prevent collapse animation according to {@link ESLMediaRuleList} */
  @attr() public noCollapse: string;

  private _modeRules: ESLMediaRuleList<string>;

  /** Height of previous active panel */
  protected _previousHeight: number = 0;
  /** Fallback setTimeout timer */
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

  /** @returns {ESLPanel[]} panels that are processed by the current panel group */
  public get $panels(): ESLPanel[] {
    const els = Array.from(this.querySelectorAll(ESLPanel.is));
    return els.filter((el) => this.includesPanel(el)) as ESLPanel[];
  }

  /** @returns {ESLPanel[]} panels that are active */
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

  /** Process on show event */
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

  /** Record height of previous active panel */
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
    if (!e || e.propertyName === 'height') {
      this.afterAnimate();
    }
  }

  /** @returns {boolean} if animate height (collapse animation) */
  public get shouldCollapse() {
    const noCollapseModes = this.noCollapse.split(',').map((mode) => mode.trim());
    return !noCollapseModes.includes('all') && !noCollapseModes.includes(this.currentMode);
  }

  /** @returns {PanelActionParams} config that is used to form result panel action params */
  public get panelConfig(): PanelActionParams {
    return {
      noCollapse: !this.shouldCollapse || (this.currentMode === 'tabs')
    };
  }


  /** @returns {string}  rules for mode */
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

  /** @returns {string} current mode */
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
