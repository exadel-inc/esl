import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {listen, memoize} from '../../../esl-utils/decorators';
import {parseTime} from '../../../esl-utils/misc/format';
import {CSSClassUtils} from '../../../esl-utils/dom/class';
import {ESLMediaRuleList} from '../../../esl-media-query/core';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../../esl-event-listener/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';
import {ESLCarouselAutoplayEvent} from './esl-carousel.autoplay.event';

import type {ESLCarouselAutoplayBehaviour, ESLCarouselAutoplayReason} from './esl-carousel.autoplay.types';

const isUserReason = (reason: ESLCarouselAutoplayReason): boolean => reason.startsWith('user:');

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
  /** Behaviour of the control click action */
  controlBehaviour: ESLCarouselAutoplayBehaviour;
  /** Behaviour of runtime blockers */
  blockBehaviour: ESLCarouselAutoplayBehaviour;
  /** Selector for items that, when active, should disable autoplay */
  blockerSelector?: string;
  /** Events that should trigger blocking state re-check when fired anywhere in the document */
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
    blockBehaviour: 'restart',
    blockerSelector: '::find(esl-share[active], esl-note[active])',
    watchEvents: 'esl:change:active',
    controlBehaviour: 'restart'
  };
  public static override DEFAULT_CONFIG_KEY: keyof ESLCarouselAutoplayConfig = 'duration';

  /** Per-slide override attribute name for timeout */
  public static SLIDE_DURATION_ATTRIBUTE = ESLCarouselAutoplayMixin.is + '-timeout';

  /** Manual stop flag */
  private _stoppedByUser: boolean = false;
  /** Manual pause flag */
  private _pausedByUser: boolean = false;
  /** Last known viewport intersection state */
  private _inViewport: boolean = false;
  /** Active cycle timeout id (null if no cycle scheduled) */
  private _timeout: number | null = null;
  /** Remaining time until the current cycle ends */
  private _remaining: number = 0;
  /** Current cycle full duration */
  private _cycleDuration: number = 0;
  /** Current cycle scheduling start timestamp */
  private _cycleStartedAt: number | null = null;
  /** Last dispatch reason */
  private _lastReason: ESLCarouselAutoplayReason = 'system:idle';

  /** True when a navigation timeout is currently scheduled */
  public get active(): boolean {
    return !!this._timeout;
  }

  /** True when autoplay is paused and can potentially be resumed */
  public get paused(): boolean {
    if (!this.enabled || this.active) return false;
    if (this._pausedByUser) return true;
    return this.config.blockBehaviour === 'pause' && this.blocked && this.remaining > 0;
  }

  /** True when autoplay cannot run due to runtime blockers */
  public get blocked(): boolean {
    if (!this._inViewport) return true;
    if (this.config.trackInteraction && (this.hovered || this.focused)) return true;
    return this.hasActiveBlockingItems;
  }

  /**
   * Effective enabled state.
   * True when autoplay is not manually stopped and global duration is non-negative / valid.
   */
  public get enabled(): boolean {
    return !this._stoppedByUser && this.duration >= 0;
  }
  /** Backward-compatible manual enable / disable API */
  public set enabled(value: boolean) {
    value ? this.start() : this.stop();
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

  /** Remaining time of the current/paused cycle */
  public get remaining(): number {
    if (!this.active || this._cycleStartedAt === null) return this._remaining;
    return Math.max(this._remaining - (Date.now() - this._cycleStartedAt), 0);
  }

  /** Control elements collection (memoized) */
  @memoize()
  public get $controls(): HTMLElement[] {
    const sel = this.config.control;
    return sel ? this.$$findAll(sel) as HTMLElement[] : [];
  }

  /** Interaction scope elements (memoized) */
  @memoize()
  public get $interactionScope(): HTMLElement[] {
    const sel = this.config.interactionScope;
    return sel ? this.$$findAll(sel) as HTMLElement[] : [this.$host];
  }

  /** True if active slide contains any blocking items */
  public get hasActiveBlockingItems(): boolean {
    const {blockerSelector} = this.config;
    return !!blockerSelector && !!this.$$find(blockerSelector);
  }

  /** True if any scope element is hovered */
  public get hovered(): boolean {
    return this.$interactionScope.some(($el) => $el.matches('*:hover'));
  }

  /** True if keyboard-visible focus is within scope */
  public get focused(): boolean {
    if (!document.activeElement?.matches('*:focus-visible')) return false;
    return this.$interactionScope.some(($el) => $el.matches('*:focus-within'));
  }

  /** Backward-compatible alias for runtime allowance */
  public get allowed(): boolean {
    return this.canRun;
  }

  /** Runtime predicate: autoplay may have an active timeout right now */
  public get canRun(): boolean {
    if (!this.enabled || this._pausedByUser || this.blocked) return false;
    if (!(this.effectiveDuration > 0)) return false;
    return !!this.$host?.canNavigate(this.config.command);
  }

  /** True if autoplay can be scheduled for the current slide */
  protected get canSchedule(): boolean {
    const {effectiveDuration} = this;
    return effectiveDuration > 0 && !!this.$host?.canNavigate(this.config.command);
  }

  /** True if autoplay may be re-started automatically by runtime conditions */
  protected get canAutoStart(): boolean {
    return !this._pausedByUser && !this._stoppedByUser && !this.active && this.canRun;
  }

  /** Start autoplay or resume paused cycle */
  public start(reason: ESLCarouselAutoplayReason = 'user:start:call'): void {
    if (isUserReason(reason)) {
      this._stoppedByUser = false;
      this._pausedByUser = false;
    }
    if (!this.enabled || this.blocked || this._pausedByUser) return this.syncState(reason);
    if (!this.canSchedule) {
      this._cycleDuration = Math.max(this.effectiveDuration, 0);
      this._remaining = 0;
      return this.syncState(isUserReason(reason) ? reason : 'system:idle');
    }
    const duration = this.effectiveDuration;
    const remaining = this._remaining > 0 ? this._remaining : duration;
    const total = this._cycleDuration > 0 ? this._cycleDuration : duration;
    this.schedule(remaining, total, reason);
  }

  /** Pause autoplay preserving remaining time when possible */
  public pause(reason: ESLCarouselAutoplayReason = 'user:pause:call'): void {
    if (isUserReason(reason)) {
      this._stoppedByUser = false;
      this._pausedByUser = true;
    }
    if (this.active) this._remaining = this.remaining;
    this.clearTimer();
    this.syncState(reason);
  }

  /** Stop autoplay and clear current cycle state */
  public stop(reason: ESLCarouselAutoplayReason = 'user:stop:call'): void {
    if (isUserReason(reason)) {
      this._stoppedByUser = true;
      this._pausedByUser = false;
    }
    this.resetCycle();
    this.syncState(reason);
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
    this.stop('system:stop:config');
    this.update();
    if (!this._pausedByUser && !this._stoppedByUser && this.canRun) this.start('system:start:auto');
  }

  /** Suspend & cleanup on disconnect */
  protected override disconnectedCallback(): void {
    this.clearTimer();
    this._remaining = 0;
    this._cycleDuration = 0;
    this._cycleStartedAt = null;
    this.updateMarkers();
    super.disconnectedCallback();
  }

  /** Update classes and listeners and synchronize state markers */
  protected update(): void {
    this.$$on({group: 'state'});
    this.syncState();
  }

  /** Update UI markers reflecting effective autoplay state */
  protected updateMarkers(): void {
    const {$container} = this.$host;
    CSSClassUtils.toggle(this.$controls, this.config.controlCls, this.enabled);
    $container && CSSClassUtils.toggle($container, this.config.containerCls, this.enabled);
  }

  /** Reset current cycle state completely */
  protected resetCycle(): void {
    this.clearTimer();
    this._remaining = 0;
    this._cycleDuration = 0;
  }

  /** Clear active timer only */
  protected clearTimer(): void {
    if (this._timeout) window.clearTimeout(this._timeout);
    this._timeout = null;
    this._cycleStartedAt = null;
  }

  /** Schedule next autoplay cycle */
  protected schedule(duration: number, total: number = duration, reason: ESLCarouselAutoplayReason = 'system:start:auto'): void {
    this.clearTimer();
    this._remaining = duration;
    this._cycleDuration = total;
    this._cycleStartedAt = Date.now();
    this._timeout = window.setTimeout(() => this._onCycle(true), duration);
    this.syncState(reason);
  }

  /** Sync current state markers and dispatch autoplay event */
  protected syncState(reason: ESLCarouselAutoplayReason = this._lastReason): void {
    this._lastReason = reason;
    this.updateMarkers();
    ESLCarouselAutoplayEvent.dispatch(this, reason);
  }

  /** Apply blocking logic according to configured block behaviour */
  protected syncBlockingState(): void {
    if (this.blocked) {
      return this.config.blockBehaviour === 'pause' ? this.pause('system:pause:block') : this.stop('system:stop:block');
    }
    if (this.canAutoStart) return this.start('system:start:auto');
    this.syncState(this._pausedByUser ? this._lastReason : 'system:idle');
  }

  /** Internal cycle handler (execute navigation then schedule next cycle if needed) */
  protected async _onCycle(exec?: boolean): Promise<void> {
    this.clearTimer();
    this._remaining = 0;
    if (exec) await this.$host?.goTo(this.config.command, {activator: this}).catch(console.debug);
    if (this.active || !this.enabled || this._pausedByUser || this.blocked) return this.syncState();
    if (this.canSchedule) {
      const {effectiveDuration} = this;
      return this.schedule(effectiveDuration, effectiveDuration, 'system:start:auto');
    }
    this.syncState('system:idle');
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
    this.syncBlockingState();
  }

  /** Hover/focus interaction listener toggling pause state */
  @listen({
    group: 'state',
    event: 'mouseleave mouseenter focusin focusout',
    target: ($this: ESLCarouselAutoplayMixin) => $this.$interactionScope,
    condition: ($this: ESLCarouselAutoplayMixin) => $this.enabled && $this.config.trackInteraction
  })
  protected _onInteract(): void {
    this.syncBlockingState();
  }

  /** Slide change listener (forces cycle restart) */
  @listen(ESLCarouselSlideEvent.AFTER)
  protected _onSlideChange(): void {
    this.stop('system:stop:slide-change');
    if (this.canAutoStart) this.start('system:start:auto');
  }

  /** Control click handler toggling manual enabled state */
  @listen({
    event: 'click',
    target: ($this: ESLCarouselAutoplayMixin) => $this.$controls,
    condition: ($this: ESLCarouselAutoplayMixin)=> !!$this.$controls.length
  })
  protected _onToggle(e: Event): void {
    if (this.config.controlBehaviour === 'pause') {
      this._pausedByUser ? this.start('user:start:control') : this.pause('user:pause:control');
    } else {
      (this._stoppedByUser || !this.enabled) ? this.start('user:start:control') : this.stop('user:stop:control');
    }
    e.preventDefault();
  }

  /** Subscribe to events that block autoplay */
  @listen({
    group: 'state',
    event: ($this: ESLCarouselAutoplayMixin) => $this.config.watchEvents,
    target: document,
    condition: ($this: ESLCarouselAutoplayMixin) => $this.enabled
  })
  protected _onBlockingEvent(): void {
    this.syncBlockingState();
  }
}

declare global {
  export interface ESLCarouselNS {
    Autoplay: typeof ESLCarouselAutoplayMixin;
  }
}
