import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {memoize} from '../../esl-utils/decorators/memoize';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {ESLPanel} from '../../esl-panel/core';

import type {PanelActionParams} from '../../esl-panel/core';

/**
 * ESLPanelGroup component
 * @author Julia Murashko
 *
 * ESLPanelGroup is a custom element that is used as a container for a group of {@link ESLPanel}s
 */
@ExportNs('PanelGroup')
export class ESLPanelGroup extends ESLBaseElement {
  public static is = 'esl-panel-group';
  /** List of supported modes */
  public static supportedModes = ['tabs', 'accordion', 'open'];

  /** Rendering mode of the component (takes values from the list of supported modes; 'accordion' by default) */
  @attr({defaultValue: 'accordion'}) public mode: string;
  /** Element {@link TraversingQuery} selector to add class that identifies the rendering mode (ESLPanelGroup itself by default) */
  @attr({defaultValue: ''}) public modeClsTarget: string;
  /** Class(es) to be added during animation ('animate' by default) */
  @attr({defaultValue: 'animate'}) public animationClass: string;
  /** Time to clear animation common params (max-height style + classes) ('auto' by default) */
  @attr({defaultValue: 'auto'}) public fallbackDuration: number | 'auto';
  /** List of comma-separated "modes" to disable collapse/expand animation (for both Group and Panel animations) */
  @attr() public noCollapse: string;

  /**
   * Define accordion behavior
   * `single` allows only one Panel to be open.
   * `multiple` allows any number of open Panels.
   * */
  @attr({defaultValue: 'single'}) public accordionGroup: string;


  /** Height of previous active panel */
  protected _previousHeight: number = 0;
  /** Fallback setTimeout timer */
  protected _fallbackTimer: number = 0;

  static get observedAttributes() {
    return ['mode', 'accordion-group'];
  }

  /** ESLMediaRuleList instance of the mode mapping */
  @memoize()
  public get modeRules() {
    return ESLMediaRuleList.parse(this.mode);
  }

  /** @returns current mode */
  public get currentMode(): string {
    return this.modeRules.activeValue || '';
  }

  protected get actionParams(): PanelActionParams {
    return {initiator: 'group', activator: this};
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

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'mode') {
      this.modeRules.removeListener(this._onModeChange);
      memoize.clear(this, 'modeRules');
      this.modeRules.addListener(this._onModeChange);
      this.updateMode();
    }
    if (attrName === 'accordion-group') {
      if (newVal !== 'single' && newVal !== 'multiple') {
        this.accordionGroup = oldVal;
        return;
      }
      this.reset();
    }
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

  /** Update element state according to current mode */
  protected updateMode() {
    this.setAttribute('view', this.currentMode);
    const $target = TraversingQuery.first(this.modeClsTarget, this);
    if (!$target) return;
    ESLPanelGroup.supportedModes.forEach((mode) => {
      $target.classList.toggle(`esl-${mode}-view`, this.currentMode === mode);
    });

    this.reset();
  }

  /** @returns Panels that are processed by the current panel group */
  public get $panels(): ESLPanel[] {
    const els = Array.from(this.querySelectorAll(ESLPanel.is));
    return els.filter((el) => this.includesPanel(el)) as ESLPanel[];
  }

  /** @returns Panels that are active */
  public get $activePanels() {
    return this.$panels.filter((el: ESLPanel) => el.open);
  }

  /** @returns Whether the collapse/expand animation should be handheld by the group */
  public get shouldCollapse() {
    const noCollapseModes = this.noCollapse.split(',').map((mode) => mode.trim());
    return !noCollapseModes.includes('all') && !noCollapseModes.includes(this.currentMode);
  }

  /** @returns Action params config that is used by controlled {@link ESLPanel}s */
  public get panelConfig(): PanelActionParams {
    return {
      noCollapse: !this.shouldCollapse || (this.currentMode === 'tabs')
    };
  }

  /** Condition-guard to check if the passed target is a Panel that should be controlled by the Group */
  public includesPanel(target: any): target is ESLPanel {
    if (!(target instanceof ESLPanel)) return false;
    return target.$group === this;
  }

  /** Show all panels besides excluded ones */
  public showAll(excluded: ESLPanel[] = []) {
    this.$panels.forEach((el) => !excluded.includes(el) && el.show(this.actionParams));
  }
  /** Hide all active panels besides excluded ones */
  public hideAll(excluded: ESLPanel[] = []) {
    this.$activePanels.forEach((el) => !excluded.includes(el) && el.hide(this.actionParams));
  }
  /** Toggle all panels by predicate */
  public toggleAllBy(shouldOpen: (panel: ESLPanel) => boolean) {
    this.$panels.forEach((panel) => panel.toggle(shouldOpen(panel), this.actionParams));
  }

  /** Reset to default state applicable to the current mode */
  public reset() {
    ESLPanel.registered.then(() => {
      if (this.currentMode === 'open') this.toggleAllBy(() => true);
      if (this.currentMode === 'tabs' || (this.currentMode === 'accordion' && this.accordionGroup === 'single')) {
        const $activePanel = this.$panels.find((panel) => panel.initiallyOpened);
        this.toggleAllBy((panel) => panel === $activePanel);
      }
      if (this.currentMode === 'accordion' && this.accordionGroup === 'multiple') {
        this.toggleAllBy((panel) => panel.initiallyOpened);
      }
    });
  }

  /** Animate the height of the component */
  protected onAnimate(from: number, to: number) {
    const hasCurrent = this.style.height && this.style.height !== 'auto';
    if (hasCurrent) {
      this.style.height = `${to}px`;
      this.fallbackAnimate();
    } else {
      // set initial height
      this.style.height = `${from}px`;
      // make sure that browser apply initial height to animate
      afterNextRender(() => {
        this.style.height = `${to}px`;
        this.fallbackAnimate();
      });
    }
  }

  /** Pre-processing animation action */
  protected beforeAnimate() {
    CSSClassUtils.add(this, this.animationClass);
  }

  /** Post-processing animation action */
  protected afterAnimate() {
    this.style.removeProperty('height');
    CSSClassUtils.remove(this, this.animationClass);
  }

  /** Init a fallback timer to call post-animate action */
  protected fallbackAnimate() {
    const time = +this.fallbackDuration;
    if (isNaN(time) || time < 0) return;
    if (this._fallbackTimer) clearTimeout(this._fallbackTimer);
    this._fallbackTimer = window.setTimeout(() => this.afterAnimate(), time);
  }

  /** Process {@link ESLPanel} pre-show event */
  @bind
  protected _onBeforeShow(e: CustomEvent) {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    if (this.currentMode === 'accordion' && this.accordionGroup === 'multiple') return;
    this.hideAll([panel]);
  }

  /** Process {@link ESLPanel} show event */
  @bind
  protected _onShow(e: CustomEvent) {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    if (this.currentMode !== 'tabs') return;

    this.beforeAnimate();
    if (this.shouldCollapse) {
      this.onAnimate(this._previousHeight, panel.initialHeight);
    } else {
      afterNextRender(() => this.afterAnimate());
    }
  }

  /** Process {@link ESLPanel} pre-hide event */
  @bind
  protected _onBeforeHide(e: CustomEvent) {
    // TODO: refactor
    if (this.currentMode === 'open') {
      e.preventDefault();
      return;
    }
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    this._previousHeight = this.offsetHeight;
  }

  /** Catching CSS transition end event to start post-animate processing */
  @bind
  protected _onTransitionEnd(e?: TransitionEvent) {
    if (!e || e.propertyName === 'height') {
      this.afterAnimate();
    }
  }

  /** Handles mode change */
  @bind
  protected _onModeChange() {
    this.updateMode();
  }
}

declare global {
  export interface ESLLibrary {
    PanelGroup: typeof ESLPanelGroup;
  }

  export interface HTMLElementTagNameMap {
    'esl-panel-group': ESLPanelGroup;
  }
}
