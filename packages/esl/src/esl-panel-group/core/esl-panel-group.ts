import {ExportNs} from '../../esl-utils/environment/export-ns';
import {defined} from '../../esl-utils/misc/object/utils';
import {ESLBaseElement} from '../../esl-base-element/core';
import {afterNextRender} from '../../esl-utils/async/raf';
import {debounce} from '../../esl-utils/async/debounce';
import {decorate, memoize, attr, boolAttr, jsonAttr, prop, listen} from '../../esl-utils/decorators';
import {format} from '../../esl-utils/misc/format';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLMediaQuery, ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLPanel} from '../../esl-panel/core';

import type {ESLPanelActionParams} from '../../esl-panel/core';

/** Converts special 'all' value to positive infinity */
const parseCount = (value: string): number => value === 'all' ? Number.POSITIVE_INFINITY : parseInt(value, 10);

/**
 * ESLPanelGroup component
 * @author Julia Murashko, Anastasia Lesun, Alexey Stsefanovich (ala'n)
 *
 * ESLPanelGroup is a custom element that is used as a container for a group of {@link ESLPanel}s
 */
@ExportNs('PanelGroup')
export class ESLPanelGroup extends ESLBaseElement {
  public static override is = 'esl-panel-group';

  public static observedAttributes = ['mode', 'refresh-strategy', 'min-open-items', 'max-open-items'];
  /** List of supported modes */
  public static supportedModes = ['accordion', 'tabs'];

  /** Event that dispatched on instance mode change */
  @prop('esl:change:mode') public MODE_CHANGE_EVENT: string;
  /** Inner event that dispatched after group-handled animation end */
  @prop('esl:after:animate') public AFTER_ANIMATE_EVENT: string;

  /** Child panels selector (Default `esl-panel`) */
  @attr({defaultValue: ESLPanel.is}) public panelSel: string;

  /** Rendering mode of the component (takes values from the list of supported modes; 'accordion' by default) */
  @attr({defaultValue: 'accordion'}) public mode: string;
  /** Rendering mode class pattern. Uses {@link format} syntax for `mode` placeholder */
  @attr({defaultValue: 'esl-{mode}-view'}) public modeCls: string;
  /** Element {@link ESLTraversingQuery} selector to add class that identifies the rendering mode (ESLPanelGroup itself by default) */
  @attr({defaultValue: ''}) public modeClsTarget: string;

  /**
   * ESLMediaQuery string to define a list of media conditions
   * to disable collapse/expand animation (for both Group and Panel animations)
   */
  @attr({defaultValue: 'not all'}) public noAnimate: string;
  /** Class(es) to be added during animation ('animate' by default) */
  @attr({defaultValue: 'animate'}) public animationClass: string;

  /** Define minimum number of panels that could be opened */
  @attr({defaultValue: '1'}) public minOpenItems: string;
  /** Define maximum number of panels that could be opened */
  @attr({defaultValue: '1'}) public maxOpenItems: string;

  /**
   * Define active panel(s) behavior in case of configuration change (mode, min-open-items, max-open-items)
   * `last` (default) - try to preserve currently active panel(s)
   * `initial` - activates initially opened panel(s)
   * `open` - open max of available panels
   * `close` - close all the panels (to the min of open items)
   */
  @attr({defaultValue: 'last'}) public refreshStrategy: string;

  /** Action params to pass into panels when executing reset action (happens when mode is changed) */
  @jsonAttr({defaultValue: {noAnimate: true}}) public transformParams: ESLPanelActionParams;

  /** Readonly attribute that indicates whether the panel group has opened panels */
  @boolAttr({readonly: true}) public hasOpened: boolean;

  /** Active while animation in progress */
  @boolAttr({readonly: true}) public animating: boolean;

  /** Height of previous active panel */
  protected _previousHeight: number = 0;

  protected override connectedCallback(): void {
    ESLPanel.registered.then(() => {
      super.connectedCallback();
      this.refresh();
    });
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'mode' || attrName === 'min-open-items' || attrName === 'max-open-items') {
      this.$$off(this._onConfigChange);
      memoize.clear(this, 'modeRules');
      memoize.clear(this, 'minValueRules');
      memoize.clear(this, 'maxValueRules');
      this.$$on(this._onConfigChange);
      this.refresh();
    }
    if (attrName === 'refresh-strategy') {
      memoize.clear(this, 'refreshRules');
    }
  }

  /** Updates element state according to current mode */
  protected refresh(): void {
    const prevMode = this.getAttribute('current-mode');
    const currentMode = this.currentMode;
    this.setAttribute('current-mode', currentMode);

    this.updateModeCls();
    this.reset();
    this.updateMarkers();

    if (prevMode !== currentMode) this.$$fire(this.MODE_CHANGE_EVENT, {detail: {prevMode, currentMode}});
  }

  protected updateMarkers(): void {
    this.$$attr('has-opened', this.$activePanels.length > 0);
  }

  /** Updates mode class marker */
  protected updateModeCls(): void {
    const {modeCls, currentMode} = this;
    if (!modeCls) return;
    const $target = ESLTraversingQuery.first(this.modeClsTarget, this);
    if (!$target) return;
    ESLPanelGroup.supportedModes.forEach((mode) => {
      const className = format(modeCls, {mode});
      $target.classList.toggle(className, currentMode === mode);
    });
  }

  /** @returns ESLMediaRuleList instance of the mode mapping */
  @memoize()
  public get modeRules(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parseQuery(this.mode);
  }

  /** @returns ESLMediaRuleList instance of the min-open-items mapping */
  @memoize()
  public get minValueRules(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parseQuery(this.minOpenItems, parseCount);
  }

  /** @returns ESLMediaRuleList instance of the max-open-items mapping */
  @memoize()
  public get maxValueRules(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parseQuery(this.maxOpenItems, parseCount);
  }

  /** @returns ESLMediaRuleList instance of the refresh-strategy mapping */
  @memoize()
  public get refreshRules(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parseQuery(this.refreshStrategy);
  }

  /** @returns current mode */
  public get currentMode(): string {
    return this.modeRules.activeValue || '';
  }

  /** @returns current value of min-open-items */
  public get currentMinItems(): number {
    const min = 0;
    const val = defined(this.minValueRules.activeValue, 1);
    const max = this.currentMode === 'tabs' ? 1 : this.$panels.length;
    return Math.min(max, Math.max(min, val)); // minmax
  }

  /** @returns current value of max-open-items */
  public get currentMaxItems(): number {
    const min = this.currentMinItems;
    const val = defined(this.maxValueRules.activeValue, 1);
    const max = this.currentMode === 'tabs' ? 1 : this.$panels.length;
    return Math.min(max, Math.max(min, val)); // minmax
  }

  /** @returns panels that are processed by the current panel group */
  public get $panels(): ESLPanel[] {
    const els = Array.from(this.querySelectorAll(this.panelSel));
    return els.filter((el) => this.includesPanel(el));
  }

  /** @returns panels that are active */
  public get $activePanels(): ESLPanel[] {
    return this.$panels.filter((el: ESLPanel) => el.open);
  }

  /** @returns panels that was initially opened */
  public get $initialPanels(): ESLPanel[] {
    return this.$panels.filter((el: ESLPanel) => el.initiallyOpened);
  }

  /** @returns panels that requested to be opened on refresh */
  public get $resetStatePanels(): ESLPanel[] {
    switch (this.refreshRules.activeValue) {
      case 'close': return [];
      case 'open': return this.$panels;
      case 'initial': return this.$initialPanels;
      default: return this.$activePanels;
    }
  }

  /** @returns whether the collapse/expand animation should be handheld by the breakpoints */
  public get shouldAnimate(): boolean {
    return !ESLMediaQuery.for(this.noAnimate).matches;
  }

  /** @returns action params config that's used (inherited) by controlled {@link ESLPanel}s */
  public get panelConfig(): ESLPanelActionParams {
    return {
      capturedBy: this.currentMode === 'tabs' ? this : undefined,
      noAnimate: !this.shouldAnimate || (this.currentMode === 'tabs')
    };
  }

  /** @returns merged panel action params for show/hide requests from the group */
  protected mergeActionParams(...params: ESLPanelActionParams[]): ESLPanelActionParams {
    return Object.assign({initiator: 'group', activator: this}, ...params);
  }

  /** Condition-guard to check if the passed target is a Panel that should be controlled by the Group */
  public includesPanel(target: any): target is ESLPanel {
    if (!(target instanceof ESLPanel)) return false;
    return target.$group === this;
  }

  /** Shows all panels besides excluded ones */
  public showAll(excluded: ESLPanel[] = [], params: ESLPanelActionParams = {}): void {
    this.$panels.forEach((el) => !excluded.includes(el) && el.show(this.mergeActionParams(params)));
  }
  /** Hides all active panels besides excluded ones */
  public hideAll(excluded: ESLPanel[] = [], params: ESLPanelActionParams = {}): void {
    this.$activePanels.forEach((el) => !excluded.includes(el) && el.hide(this.mergeActionParams(params)));
  }

  /** Resets to default state applicable to the current panel group configuration */
  public reset(): void {
    // $activePanels - collection of items to open (ideally; without normalization)
    const $activePanels = this.$resetStatePanels;
    // $orderedPanels = $activePanels U ($panels / $activePanels) - the list of ordered panels
    const $orderedPanels = $activePanels.concat(this.$panels.filter((item) => !$activePanels.includes(item)));
    // we use current open active panels count but normalized in range of minmax
    const activeCount = Math.min(this.currentMaxItems, Math.max($activePanels.length, this.currentMinItems));

    const params = this.mergeActionParams(this.transformParams);
    $orderedPanels.forEach((panel, index) => panel.toggle(index < activeCount, params));
  }

  /** Animates the height of the component */
  protected onAnimate(from: number, to: number): void {
    // overrides initial value if animation is currently in progress
    if (from < 0 || this.style.height && this.style.height !== 'auto') {
      from = this.clientHeight;
    }
    // sets the initial height
    this.style.height = `${from}px`;
    // makes sure browser realized the height change
    afterNextRender(() => {
      this.style.height = `${to}px`;
      this.fallbackAnimate();
    });
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
    this.$$attr('animating', true);
    CSSClassUtils.add(this, this.animationClass);
  }

  /** Post-processing animation action */
  protected afterAnimate(silent?: boolean): void {
    this.style.removeProperty('height');
    CSSClassUtils.remove(this, this.animationClass);
    this.$$attr('animating', false);

    if (silent) return;
    this.$$fire(this.AFTER_ANIMATE_EVENT, {bubbles: false});
  }

  /** Process {@link ESLPanel} pre-show event */
  @listen('esl:before:show')
  protected _onBeforeShow(e: CustomEvent): void {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;

    const max = this.currentMaxItems;
    const params = this.mergeActionParams({event: e});
    const balanceMarker = e.detail?.params?.event?.type !== 'esl:before:hide';

    // all currently active panels, except the one that requested to be open
    const $activePanels = this.$activePanels.filter((el) => el !== panel);

    // overflow = pretended to be active (current active + balanceMarker (1 if nothing hides)) - limit
    const overflow = Math.max(0, $activePanels.length + Number(balanceMarker) - max);
    // close all extra active panels (not includes requested one)
    $activePanels.slice(0, overflow).forEach((el) => el.hide(params));

    if (max <= 0) return e.preventDefault();

    this._previousHeight = this.clientHeight;
  }

  /** Process {@link ESLPanel} show event */
  @listen('esl:show esl:hide')
  protected _onStateChanged(e: CustomEvent): void {
    const panel = e.target;
    if (!this.includesPanel(panel)) return;
    this.updateMarkers();

    if (this.currentMode !== 'tabs') return;

    const targetHeight = panel.open ? panel.initialHeight : 0;
    this.beforeAnimate();
    if (this.shouldAnimate) {
      this.onAnimate(this._previousHeight, targetHeight);
    } else {
      afterNextRender(() => this.afterAnimate(true));
    }
  }

  /** Process {@link ESLPanel} pre-hide event */
  @listen('esl:before:hide')
  protected _onBeforeHide(e: CustomEvent): void {
    const {target: panel, detail} = e;
    if (!this.includesPanel(panel)) return;

    const min = this.currentMinItems;
    // checks if the hide event was produced by the show event
    const balanceMarker = detail?.params?.event?.type === 'esl:before:show';
    // activePanels = currentActivePanels - 1 (hide) + 1 if the event produced by 'before:show'
    const activeNumber = this.$activePanels.length - 1 + Number(balanceMarker);

    if (activeNumber < min) {
      const $firstInactive = this.$panels.find(($panel: ESLPanel) => !$panel.open);
      if (min === 1 || !$firstInactive) return e.preventDefault();
      const params = this.mergeActionParams({event: e});
      $firstInactive.show(params);
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

  /** Handles configuration change */
  @listen({
    event: 'change',
    target: (group: ESLPanelGroup) => [group.modeRules, group.minValueRules, group.maxValueRules]
  })
  @decorate(debounce, 0)
  protected _onConfigChange(): void {
    this.refresh();
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
