import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, jsonAttr, prop, listen, ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {format} from '../../esl-utils/misc/format';
import {memoize} from '../../esl-utils/decorators/memoize';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLMediaQuery, ESLMediaRuleList} from '../../esl-media-query/core';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {ESLPanel} from '../../esl-panel/core';

import type {PanelActionParams} from '../../esl-panel/core';

const parseCount = (value: string): number => value === 'all' ? Number.POSITIVE_INFINITY : parseInt(value, 10);

/**
 * ESLPanelGroup component
 * @author Julia Murashko
 *
 * ESLPanelGroup is a custom element that is used as a container for a group of {@link ESLPanel}s
 */
@ExportNs('PanelGroup')
export class ESLPanelGroup extends ESLBaseElement {
  public static is = 'esl-panel-group';
  public static observedAttributes = ['mode', 'refresh-strategy', 'min-open-items', 'max-open-items'];
  /** List of supported modes */
  public static supportedModes = ['tabs', 'accordion'];

  /** Event that dispatched on instance mode change */
  @prop('esl:change:mode') public MODE_CHANGE_EVENT: string;

  /** Rendering mode of the component (takes values from the list of supported modes; 'accordion' by default) */
  @attr({defaultValue: 'accordion'}) public mode: string;
  /** Rendering mode class pattern. Uses {@link format} syntax for `mode` placeholder */
  @attr({defaultValue: 'esl-{mode}-view'}) public modeCls: string;
  /** Element {@link TraversingQuery} selector to add class that identifies the rendering mode (ESLPanelGroup itself by default) */
  @attr({defaultValue: ''}) public modeClsTarget: string;

  /** Class(es) to be added during animation ('animate' by default) */
  @attr({defaultValue: 'animate'}) public animationClass: string;
  /** List of breakpoints to disable collapse/expand animation (for both Group and Panel animations) */
  @attr({defaultValue: 'not all'}) public noAnimate: string;

  /** Define minimum number of panels that could be opened */
  @attr({defaultValue: '1'}) public minOpenItems: string;
  /** Define maximum number of panels that could be opened */
  @attr({defaultValue: 'all'}) public maxOpenItems: string;

  /** Define active panel(s) behaviour in case of mode changing ('last' by default)
   * `initial` - activates initially opened panel(s)
   * `last` - try to preserve currently active panel(s)
   * */
  @attr({defaultValue: 'last'}) public refreshStrategy: string;
  /** Action params to pass into panels when executing reset action (happens when mode is changed) */
  @jsonAttr({defaultValue: {noAnimate: true}}) public transformParams: PanelActionParams;


  /** Height of previous active panel */
  protected _previousHeight: number = 0;

  protected connectedCallback(): void {
    super.connectedCallback();
    this.updateMode();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'mode') {
      this.$$off(this._onModeChange);
      memoize.clear(this, 'modeRules');
      this.$$on(this._onModeChange);
      this.updateMode();
    }
    if (attrName === 'min-open-items') {
      memoize.clear(this, 'minOpenItems');
      this.reset();
    }
    if (attrName === 'max-open-items') {
      memoize.clear(this, 'maxOpenItems');
      this.reset();
    }
    if (attrName === 'refresh-strategy') {
      memoize.clear(this, 'refreshRules');
    }
  }

  /** Updates element state according to current mode */
  protected updateMode(): void {
    const prevMode = this.getAttribute('current-mode');
    const currentMode = this.currentMode;
    this.setAttribute('current-mode', currentMode);

    this.updateModeCls();
    this.reset();

    if (prevMode !== currentMode) {
      this.$$fire(this.MODE_CHANGE_EVENT, {detail: {prevMode, currentMode}});
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

  /** @returns ESLMediaRuleList instance of the refresh-strategy mapping */
  @memoize()
  public get refreshRules(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.refreshStrategy);
  }

  /** @returns ESLMediaRuleList instance of the min-open-items mapping */
  @memoize()
  public get minValues(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parse(this.minOpenItems, parseCount);
  }

  /** @returns ESLMediaRuleList instance of the max-open-items mapping */
  @memoize()
  public get maxValues(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parse(this.maxOpenItems, parseCount);
  }

  /** @returns active refresh-strategy */
  public get activeRefreshStrategy(): string {
    return this.refreshRules.activeValue || 'last';
  }

  /** @returns current mode */
  public get currentMode(): string {
    return this.modeRules.activeValue || '';
  }

  /** @returns current value of min-open-items */
  public get currentMinValue(): number {
    return Math.min(this.minValues.activeValue || 1, this.$panels.length) ;
  }

  /** @returns current value of max-open-items */
  public get currentMaxValue(): number {
    //attribute is ignored by tabs?
    if (this.currentMode === 'tabs') return 1;
    return Math.max(Math.min(this.maxValues.activeValue || 0, this.$panels.length), this.currentMinValue);
  }

  // TODO: does not support anything except esl-panel
  /** @returns panels that are processed by the current panel group */
  public get $panels(): ESLPanel[] {
    const els = Array.from(this.querySelectorAll(ESLPanel.is));
    return els.filter((el) => this.includesPanel(el)) as ESLPanel[];
  }

  /** @returns panels that are active */
  public get $activePanels(): ESLPanel[] {
    return this.$panels.filter((el: ESLPanel) => el.open);
  }

  /** @returns panels that was initially opened */
  public get $initialPanels(): ESLPanel[] {
    return this.$panels.filter((el: ESLPanel) => el.initiallyOpened);
  }

  /** @returns whether the collapse/expand animation should be handheld by the breakpoints */
  public get shouldAnimate(): boolean {
    return !ESLMediaQuery.for(this.noAnimate).matches;
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
  public toggleAllBy(shouldOpen: ((panel: ESLPanel) => boolean) | ESLPanel[], params: PanelActionParams = {}): void {
    const predicate = (Array.isArray(shouldOpen)) ? (panel: ESLPanel): boolean => shouldOpen.includes(panel) : shouldOpen;
    this.$panels.forEach((panel) => panel.toggle(predicate(panel), this.mergeActionParams(params)));
  }

  /** Resets to default state applicable to the current mode */
  public reset(): void {
    ESLPanel.registered.then(() => {
      const $activePanels = this.activeRefreshStrategy === 'last' ? this.$activePanels : this.$initialPanels;
      this.toggleAllBy(this.currentMinValue === this.$panels.length ? this.$panels : $activePanels.slice(0, this.currentMinValue), this.transformParams);
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
  @listen('esl:before:show')
  protected _onBeforeShow(e: CustomEvent): void {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;

    // if (!this.currentMaxValue || (this.currentMaxValue - this.$activePanels.length >= 1)) return;
    // this.currentMaxValue === 1 && this.hideAll([panel], {event: e});
    // const rest = this.currentMaxValue < this.$activePanels.length ? this.$activePanels : this.$activePanels.slice(1, this.$activePanels.length);
    // this.hideAll([panel, ...rest], {event: e});

    if ((this.currentMaxValue - this.$activePanels.length >= 1)) return;
    this.hideAll(this.currentMaxValue === 1 ? [panel] : [...this.$activePanels], {event: e});
  }

  /** Process {@link ESLPanel} show event */
  @listen('esl:show')
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
  @listen('esl:before:hide')
  protected _onBeforeHide(e: CustomEvent): void {
    const {target: panel, detail} = e;
    if (!this.includesPanel(panel)) return;

    const selfHandled = detail?.params?.event?.type === 'esl:before:show';
    const activeNumber = this.$activePanels.length - 1 + Number(selfHandled);

    if (this.currentMinValue === this.$panels.length || activeNumber === 0) {
      return e.preventDefault();
    }
    this._previousHeight = this.clientHeight;
  }

  /** Catches CSS transition end event to start post-animate processing */
  @listen('transitionend')
  protected _onTransitionEnd(e?: TransitionEvent): void {
    if (!e || (e.propertyName === 'height' && e.target === this)) {
      this.afterAnimate();
    }
  }

  /** Handles mode change */
  @listen({
    event: 'change',
    target: (group: ESLPanelGroup) => group.modeRules
  })
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
