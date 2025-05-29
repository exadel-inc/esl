import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {listen, memoize, ready} from '../../../esl-utils/decorators';
import {parseTime} from '../../../esl-utils/misc/format';
import {CSSClassUtils} from '../../../esl-utils/dom/class';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';
import {ESLCarouselAutoplayEvent} from './esl-carousel.autoplay.event';

export interface ESLCarouselAutoplayConfig {
  /** Timeout to send next command to the host carousel */
  duration: string | number;
  /** Navigation command to send to the host carousel. Default: 'slide:next' */
  command: string;
  /** Selector for control to toggle plugin state */
  control?: string;
  /** Class to toggle on control element, when autoplay is active */
  controlCls?: string;
  /** Class to toggle on container element, when autoplay is active */
  containerCls?: string;
}

/**
 * {@link ESLCarousel} autoplay (auto-advance) plugin mixin
 * Automatically switch slides by timeout
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Autoplay')
export class ESLCarouselAutoplayMixin extends ESLCarouselPlugin<ESLCarouselAutoplayConfig> {
  public static override is = 'esl-carousel-autoplay';
  public static override DEFAULT_CONFIG: ESLCarouselAutoplayConfig = {
    duration: 5000,
    command: 'slide:next'
  };
  public static override DEFAULT_CONFIG_KEY: keyof ESLCarouselAutoplayConfig = 'duration';

  private _enabled: boolean = true;
  private _duration: number | null = null;

  /** True if the autoplay timer is currently active */
  public get active(): boolean {
    return !!this._duration;
  }

  /** True if the autoplay plugin is enabled */
  public get enabled(): boolean {
    return this._enabled;
  }
  protected set enabled(value: boolean) {
    this._enabled = value;
    CSSClassUtils.toggle(this.$controls, this.config.controlCls, this._enabled);
    const {$container} = this.$host;
    $container && CSSClassUtils.toggle($container, this.config.containerCls, this._enabled);
  }

  /** The duration of the autoplay timer in milliseconds */
  public get duration(): number {
    return parseTime(this.config.duration);
  }

  /** A list of control elements to toggle plugin state */
  @memoize()
  public get $controls(): HTMLElement[] {
    const sel = this.config.control;
    return sel ? ESLTraversingQuery.all(sel, this.$host) as HTMLElement[] : [];
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.start();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stop();
  }

  @listen({inherit: true})
  protected override onConfigChange(): void {
    super.onConfigChange();
    memoize.clear(this, ['$controls', 'duration']);
    // Full restart during config change
    this.stop();
    this.start();
  }

  /** Activates and restarts the autoplay carousel timer */
  public start(): void {
    const {duration} = this;
    this.enabled = +duration > 0;
    if (this.enabled) this._onCycle();
  }

  /**
   * Deactivates the autoplay carousel timer.
   * @param system - If true, the plugin will be suspended but not disabled.
   */
  public stop(system = false): void {
    if (!this.active && !this.enabled) return;
    if (!system) this.enabled = false;
    this._duration && window.clearTimeout(this._duration);
    this._duration = null;
    ESLCarouselAutoplayEvent.dispatch(this);
  }

  /**
   * Starts a new autoplay cycle.
   * Produces cycle self call after a timeout with enabled command execution.
   */
  protected async _onCycle(exec?: boolean): Promise<void> {
    this._duration && window.clearTimeout(this._duration);
    this._duration = null;
    if (exec) await this.$host?.goTo(this.config.command);
    if (!this.enabled || this.active) return;
    const {duration} = this;
    this._duration = window.setTimeout(() => this._onCycle(true), duration);
    ESLCarouselAutoplayEvent.dispatch(this);
  }

  /** Handles click on control element to toggle plugin state */
  @listen({
    event: 'click',
    target: ($this: ESLCarouselAutoplayMixin)=> $this.$controls,
    condition: ($this: ESLCarouselAutoplayMixin)=> !!$this.$controls.length
  })
  protected _onToggle(e: Event): void {
    this.enabled ? this.stop() : this.start();
    e.preventDefault();
  }

  /** Handles auxiliary events that represent user interaction to pause/resume timer */
  @listen('mouseleave mouseenter focusin focusout')
  protected _onInteract(e: Event): void {
    if (!this.enabled) return;
    if (['mouseenter', 'focusin'].includes(e.type)) {
      this.stop(true);
    } else {
      this.start();
    }
  }

  /** Handles carousel slide change event to restart the timer */
  @listen(ESLCarouselSlideEvent.AFTER)
  protected _onSlideChange(): void {
    if (this.active) this.start();
  }
}

declare global {
  export interface ESLCarouselNS {
    Autoplay: typeof ESLCarouselAutoplayMixin;
  }
}
