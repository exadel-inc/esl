import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {listen, memoize} from '../../../esl-utils/decorators';
import {parseTime} from '../../../esl-utils/misc/format';
import {CSSClassUtils} from '../../../esl-utils/dom/class';
import {ESLMediaRuleList} from '../../../esl-media-query/core';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../../esl-event-listener/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';
import {ESLCarouselAutoplayEvent} from './esl-carousel.autoplay.event';

export interface ESLCarouselAutoplayConfig {
  /** Global autoplay duration (ms) or media rule pattern. 0 means "no default cycle"; negative / invalid disables plugin */
  duration: string | number;
  /** Navigation command executed each cycle */
  command: string;
  /** Intersection threshold used to (auto) pause when out of viewport */
  intersection: number;
  /** Enable hover / focus based pausing */
  trackInteraction: boolean;
  /** Scope selector for interaction tracking (defaults to host (carousel)) */
  interactionScope?: string;
  /** Selector for external control(s) toggling autoplay */
  control?: string;
  /** CSS class applied to external autoplay control elements while autoplay is enabled */
  controlCls?: string;
  /** CSS class applied to the carousel container while autoplay is enabled */
  containerCls?: string;
  /** Selector for items that, when active, should disable autoplay */
  blockerSelector?: string;
  /** Events that should block autoplay when fired on interaction scope elements */
  watchEvents: string;
}

/**
 * Autoplay plugin mixin for {@link ESLCarousel}.
 * Schedules slide navigation by timeout while allowed by viewport, interaction and config constraints.
 */
@ExportNs('Carousel.Autoplay')
export class ESLCarouselAutoplayMixin extends ESLCarouselPlugin<ESLCarouselAutoplayConfig> {
  public static override is = 'esl-carousel-autoplay';
  public static override DEFAULT_CONFIG: ESLCarouselAutoplayConfig = {
    duration: 10000,
    command: 'slide:next',
    intersection: 0.25,
    trackInteraction: true,
    blockerSelector: '::find(esl-share[active], esl-note[active])',
    watchEvents: 'esl:change:active'
  };
  public static override DEFAULT_CONFIG_KEY: keyof ESLCarouselAutoplayConfig = 'duration';

  /** Per-slide override attribute name for timeout */
  public static SLIDE_DURATION_ATTRIBUTE = ESLCarouselAutoplayMixin.is + '-timeout';

  /** User suspension flag (inverse of manual enable state) */
  private _suspended: boolean = false;
  /** Last known viewport intersection state */
  private _inViewport: boolean = false;
  /** Active cycle timeout id (null if no cycle scheduled) */
  private _timeout: number | null = null;

  /** True when a navigation timeout is currently scheduled */
  public get active(): boolean {
    return !!this._timeout;
  }

  /**
   * Effective enabled state.
   * True when user did not suspend and global duration is non-negative / valid.
   * (duration = 0 keeps plugin enabled but suppresses default scheduling unless slide overrides).
   */
  public get enabled(): boolean {
    return !this._suspended && this.duration >= 0;
  }
  /** Manually enable / disable (suspend) autoplay */
  public set enabled(value: boolean) {
    this._suspended = !value;
    this.update();
  }

  /** Global base duration in ms (raw config parsed). Negative / NaN considered as disabled */
  public get duration(): number {
    return parseTime(this.config.duration);
  }

  /**
   * Effective current slide duration.
   * Tries active slide attribute; falls back to global duration.
   * Non-positive result pauses cycle for the slide only (unless global invalid disables plugin).
   */
  public get effectiveDuration(): number {
    const {$activeSlide} = this.$host;
    if (!$activeSlide) return this.duration;
    const value = $activeSlide.getAttribute(ESLCarouselAutoplayMixin.SLIDE_DURATION_ATTRIBUTE);
    if (!value) return this.duration;
    const parsed = ESLMediaRuleList.parse(value, this.$host.media, parseTime);
    if (typeof parsed.value === 'undefined' || isNaN(parsed.value)) return this.duration;
    return parsed.value;
  }

  /** Control elements collection (memoized) */
  @memoize()
  public get $controls(): HTMLElement[] {
    const sel = this.config.control;
    return sel ? ESLTraversingQuery.all(sel, this.$host) as HTMLElement[] : [];
  }

  /** Interaction scope elements (memoized) */
  @memoize()
  public get $interactionScope(): HTMLElement[] {
    const sel = this.config.interactionScope;
    return sel ? ESLTraversingQuery.all(sel, this.$host) as HTMLElement[] : [this.$host];
  }

  /** True if any scope element is hovered */
  public get hovered(): boolean {
    return this.$interactionScope.some(($el) => $el.matches('*:hover'));
  }

  /** True if active slide contains any blocking items */
  public get hasActiveBlockingItems(): boolean {
    const {blockerSelector} = this.config;
    return !!blockerSelector && !!ESLTraversingQuery.first(blockerSelector, this.$host);
  }

  /** True if keyboard-visible focus is within scope */
  public get focused(): boolean {
    if (!document.activeElement?.matches('*:focus-visible')) return false;
    return this.$interactionScope.some(($el) => $el.matches('*:focus-within'));
  }

  /** Runtime allowance: enabled + in viewport + no blocking interaction (if tracked) */
  public get allowed(): boolean {
    if (!this.enabled) return false;
    if (!this._inViewport) return false;
    if (this.hasActiveBlockingItems) return false;
    if (this.config.trackInteraction) return !this.hovered && !this.focused;
    return true;
  }

  /** Init lifecycle hook */
  protected override onInit(): void {
    this.update();
  }

  /** React to config changes (rebuild memoized queries, re-evaluate state) */
  @listen({inherit: true})
  protected override onConfigChange(): void {
    super.onConfigChange();
    memoize.clear(this, ['$controls', '$interactionScope']);
    this.$$off(this._onBlockingEvent);
    this.update();
  }

  /** Suspend & cleanup on disconnect */
  protected override disconnectedCallback(): void {
    this._suspended = true;
    this.updateMarkers();
    this.refresh();
    super.disconnectedCallback();
  }

  /** Update classes and listeners, then re-validate cycle */
  protected update(): void {
    this.updateMarkers();
    this.$$on({group: 'state'});
    this.refresh();
  }

  /** Update UI markers (CSS classes) reflecting effective enable state */
  protected updateMarkers(): void {
    const {$container} = this.$host;
    CSSClassUtils.toggle(this.$controls, this.config.controlCls, this.enabled);
    $container && CSSClassUtils.toggle($container, this.config.containerCls, this.enabled);
  }

  /** Re-evaluate cycle scheduling (optionally force restart) */
  protected refresh(restart = false): void {
    if (!this.allowed || restart) {
      this._timeout && window.clearTimeout(this._timeout);
      this._timeout = null;
      ESLCarouselAutoplayEvent.dispatch(this, 0);
    }
    if (this.allowed && !this.active) this._onCycle();
  }

  /** Internal cycle handler (exec step then schedule next) */
  protected async _onCycle(exec?: boolean): Promise<void> {
    this._timeout && window.clearTimeout(this._timeout);
    this._timeout = null;
    if (exec) await this.$host?.goTo(this.config.command, {activator: this}).catch(console.debug);
    if (!this.allowed || this.active) return;
    const {effectiveDuration} = this;
    if (effectiveDuration > 0 && this.$host?.canNavigate(this.config.command)) {
      this._timeout = window.setTimeout(() => this._onCycle(true), effectiveDuration);
    }
    ESLCarouselAutoplayEvent.dispatch(this, effectiveDuration);
  }

  /** Viewport intersection listener controlling runtime allowance */
  @listen({
    group: 'state',
    condition: ($this: ESLCarouselAutoplayMixin) => $this.enabled,
    event: ESLIntersectionEvent.TYPE,
    target: ($this: ESLCarouselAutoplayMixin) =>
      ESLIntersectionTarget.for($this.$host, {threshold: [$this.config.intersection]})
  })
  protected _onIntersection(e: ESLIntersectionEvent): void {
    this._inViewport = e.isIntersecting;
    this.refresh();
  }

  /** Hover/focus interaction listener toggling pause state */
  @listen({
    group: 'state',
    event: 'mouseleave mouseenter focusin focusout',
    target: ($this: ESLCarouselAutoplayMixin) => $this.$interactionScope,
    condition: ($this: ESLCarouselAutoplayMixin) => $this.enabled && $this.config.trackInteraction
  })
  protected _onInteract(): void {
    this.refresh();
  }

  /** Slide change listener (forces cycle restart) */
  @listen(ESLCarouselSlideEvent.AFTER)
  protected _onSlideChange(): void {
    if (this.enabled) this.refresh(true);
  }

  /** Control click handler toggling manual enabled state */
  @listen({
    event: 'click',
    target: ($this: ESLCarouselAutoplayMixin) => $this.$controls,
    condition: ($this: ESLCarouselAutoplayMixin)=> !!$this.$controls.length
  })
  protected _onToggle(e: Event): void {
    this.enabled = !this.enabled;
    e.preventDefault();
  }

  /** Subscribe to events that block autoplay */
  @listen({
    group: 'state',
    event: ($this: ESLCarouselAutoplayMixin) => $this.config.watchEvents,
    target: ($this: ESLCarouselAutoplayMixin) => $this.$interactionScope,
    condition: ($this: ESLCarouselAutoplayMixin) => $this.enabled
  })
  protected _onBlockingEvent(): void {
    this.refresh();
  }
}

declare global {
  export interface ESLCarouselNS {
    Autoplay: typeof ESLCarouselAutoplayMixin;
  }
}
