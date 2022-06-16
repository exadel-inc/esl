import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, jsonAttr, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {format} from '../../esl-utils/misc/format';
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
  /** Rendering mode class pattern. Uses {@link format} syntax for `mode` placeholder */
  @attr({defaultValue: 'esl-{mode}-view'}) public modeCls: string;
  /** Element {@link TraversingQuery} selector to add class that identifies the rendering mode (ESLPanelGroup itself by default) */
  @attr({defaultValue: ''}) public modeClsTarget: string;
  /** Class(es) to be added during animation ('animate' by default) */
  @attr({defaultValue: 'animate'}) public animationClass: string;
  /** List of comma-separated "modes" to disable collapse/expand animation (for both Group and Panel animations) */
  @attr() public noAnimate: string;
  /**
   * Define accordion behavior
   * `single` allows only one Panel to be open.
   * `multiple` allows any number of open Panels.
   * */
  @attr({defaultValue: 'single'}) public accordionGroup: string;
  /** Action params to pass into panels when executing reset action (happens when mode is changed) */
  @jsonAttr({defaultValue: {noAnimate: true}}) public transformParams: PanelActionParams;


  /** Height of previous active panel */
  protected _previousHeight: number = 0;

  static get observedAttributes(): string[] {
    return ['mode', 'accordion-group'];
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.bindEvents();

    this.modeRules.addEventListener(this._onModeChange);
    this.updateMode();
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.modeRules.removeEventListener(this._onModeChange);

    this.unbindEvents();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'mode') {
      this.modeRules.removeEventListener(this._onModeChange);
      memoize.clear(this, 'modeRules');
      this.modeRules.addEventListener(this._onModeChange);
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

  protected bindEvents(): void {
    this.addEventListener('esl:before:show', this._onBeforeShow);
    this.addEventListener('esl:show', this._onShow);
    this.addEventListener('esl:before:hide', this._onBeforeHide);

    this.addEventListener('transitionend', this._onTransitionEnd);
  }

  protected unbindEvents(): void {
    this.removeEventListener('esl:before:show', this._onBeforeShow);
    this.removeEventListener('esl:show', this._onShow);
    this.removeEventListener('esl:before:hide', this._onBeforeHide);

    this.removeEventListener('transitionend', this._onTransitionEnd);
  }

  /** Updates element state according to current mode */
  protected updateMode(): void {
    const prevMode = this.getAttribute('current-mode');
    const currentMode = this.currentMode;
    this.setAttribute('current-mode', currentMode);

    this.updateModeCls();
    this.reset();

    if (prevMode !== currentMode) {
      this.$$fire('esl:change:mode', {detail: {prevMode, currentMode}});
    }
  }

  /** Updates mode class marker */
  protected updateModeCls(): void {
    const {modeCls, currentMode} = this;
    if (!modeCls) return;
    const $target = TraversingQuery.first(this.modeClsTarget, this);
    if (!$target) return;
    ESLPanelGroup.supportedModes.forEach((mode) => {
      const className = format(modeCls, {mode});
      $target.classList.toggle(className, currentMode === mode);
    });
  }

  /** @returns ESLMediaRuleList instance of the mode mapping */
  @memoize()
  public get modeRules(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.mode);
  }

  /** @returns current mode */
  public get currentMode(): string {
    return this.modeRules.activeValue || '';
  }

  /** @returns panels that are processed by the current panel group */
  public get $panels(): ESLPanel[] {
    const els = Array.from(this.querySelectorAll(ESLPanel.is));
    return els.filter((el) => this.includesPanel(el)) as ESLPanel[];
  }

  /** @returns panels that are active */
  public get $activePanels(): ESLPanel[] {
    return this.$panels.filter((el: ESLPanel) => el.open);
  }

  /** @returns whether the collapse/expand animation should be handheld by the group */
  public get shouldAnimate(): boolean {
    const noAnimateModes = this.noAnimate.split(',').map((mode) => mode.trim());
    return !noAnimateModes.includes('all') && !noAnimateModes.includes(this.currentMode);
  }

  /** @returns action params config that's used (inherited) by controlled {@link ESLPanel}s */
  public get panelConfig(): PanelActionParams {
    return {
      capturedBy: this.currentMode === 'tabs' ? this : undefined,
      noAnimate: !this.shouldAnimate || (this.currentMode === 'tabs')
    };
  }

  /** @returns merged panel action params for show/hide requests from the group */
  protected mergeActionParams(...params: PanelActionParams[]): PanelActionParams {
    return Object.assign({initiator: 'group', activator: this}, ...params);
  }

  /** Condition-guard to check if the passed target is a Panel that should be controlled by the Group */
  public includesPanel(target: any): target is ESLPanel {
    if (!(target instanceof ESLPanel)) return false;
    return target.$group === this;
  }

  /** Shows all panels besides excluded ones */
  public showAll(excluded: ESLPanel[] = [], params: PanelActionParams = {}): void {
    this.$panels.forEach((el) => !excluded.includes(el) && el.show(this.mergeActionParams(params)));
  }
  /** Hides all active panels besides excluded ones */
  public hideAll(excluded: ESLPanel[] = [], params: PanelActionParams = {}): void {
    this.$activePanels.forEach((el) => !excluded.includes(el) && el.hide(this.mergeActionParams(params)));
  }
  /** Toggles all panels by predicate */
  public toggleAllBy(shouldOpen: (panel: ESLPanel) => boolean, params: PanelActionParams = {}): void {
    this.$panels.forEach((panel) => panel.toggle(shouldOpen(panel), this.mergeActionParams(params)));
  }

  /** Resets to default state applicable to the current mode */
  public reset(): void {
    ESLPanel.registered.then(() => {
      if (this.currentMode === 'open') this.toggleAllBy(() => true, this.transformParams);
      if (this.currentMode === 'tabs' || (this.currentMode === 'accordion' && this.accordionGroup === 'single')) {
        const $activePanel = this.$panels.find((panel) => panel.initiallyOpened);
        this.toggleAllBy((panel) => panel === $activePanel, this.transformParams);
      }
      if (this.currentMode === 'accordion' && this.accordionGroup === 'multiple') {
        this.toggleAllBy((panel) => panel.initiallyOpened, this.transformParams);
      }
    });
  }

  /** Animates the height of the component */
  protected onAnimate(from: number, to: number): void {
    const hasCurrent = this.style.height && this.style.height !== 'auto';
    if (hasCurrent) {
      this.style.height = `${to}px`;
      this.fallbackAnimate();
    } else {
      // set initial height
      this.style.height = `${from}px`;
      // make sure that browser applies initial height to animate
      afterNextRender(() => {
        this.style.height = `${to}px`;
        this.fallbackAnimate();
      });
    }
  }

  /** Checks if transition happens and runs afterAnimate step if transition is not presented */
  protected fallbackAnimate(): void {
    afterNextRender(() => {
      const distance = parseFloat(this.style.height) - this.clientHeight;
      if (Math.abs(distance) <= 1) this.afterAnimate();
    });
  }

  /** Pre-processing animation action */
  protected beforeAnimate(): void {
    CSSClassUtils.add(this, this.animationClass);
  }

  /** Post-processing animation action */
  protected afterAnimate(silent?: boolean): void {
    this.style.removeProperty('height');
    CSSClassUtils.remove(this, this.animationClass);

    if (silent) return;
    this.$activePanels.forEach((panel) => panel.$$fire('esl:after:show'));
  }

  /** Process {@link ESLPanel} pre-show event */
  @bind
  protected _onBeforeShow(e: CustomEvent): void {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    if (this.currentMode === 'accordion' && this.accordionGroup === 'multiple') return;
    this.hideAll([panel]);
  }

  /** Process {@link ESLPanel} show event */
  @bind
  protected _onShow(e: CustomEvent): void {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    if (this.currentMode !== 'tabs') return;

    this.beforeAnimate();
    if (this.shouldAnimate) {
      this.onAnimate(this._previousHeight, panel.initialHeight);
    } else {
      afterNextRender(() => this.afterAnimate(true));
    }
  }

  /** Process {@link ESLPanel} pre-hide event */
  @bind
  protected _onBeforeHide(e: CustomEvent): void {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    if (this.currentMode === 'open') {
      // TODO: refactor
      e.preventDefault();
      return;
    }
    this._previousHeight = this.clientHeight;
  }

  /** Catches CSS transition end event to start post-animate processing */
  @bind
  protected _onTransitionEnd(e?: TransitionEvent): void {
    if (!e || (e.propertyName === 'height' && e.target === this)) {
      this.afterAnimate();
    }
  }

  /** Handles mode change */
  @bind
  protected _onModeChange(): void {
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
