import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {listen, memoize} from '../../../esl-utils/decorators';
import {parseTime} from '../../../esl-utils/misc/format';
import {CSSClassUtils} from '../../../esl-utils/dom/class';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core';
import {ESLIntersectionTarget, ESLIntersectionEvent} from '../../../esl-event-listener/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';
import {ESLCarouselAutoplayEvent} from './esl-carousel.autoplay.event';

export interface ESLCarouselAutoplayConfig {
  /** Duration of the autoplay timer in milliseconds. Default: 5000 */
  duration: string | number;
  /** Navigation command to send to the host carousel. Default: 'slide:next' */
  command: string;
  /** Intersection observer threshold to start/stop autoplay based on visibility. Default: 0.25 */
  intersection: number;
  /** Whether to track user interaction (focus/hover) with the carousel to pause/resume autoplay */
  trackInteraction: boolean;
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
    duration: 10000,
    command: 'slide:next',
    intersection: 0.25,
    trackInteraction: true
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

  protected override onInit(): void {
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
    this.$$on({auto: true});
    // Full restart during config change
    this.stop();
    this.start();
  }

  /**
   * Activates and restarts the autoplay carousel timer.
   * @param system - If true, the plugin will be force started, without intersection observer check.
   */
  public start(system = false): void {
    const {duration} = this;
    this.enabled = +duration > 0;
    if (!this.enabled) return;
    system ? this._onCycle() : this.$$on(this._onIntersection);
  }

  /**
   * Deactivates the autoplay carousel timer.
   * @param system - If true, the plugin will be suspended but not disabled.
   */
  public stop(system = false): void {
    if (!this.active && !this.enabled) return;
    if (!system) {
      this.enabled = false;
      this.$$off(this._onIntersection);
    }
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
    if (exec) await this.$host?.goTo(this.config.command, {activator: this}).catch(console.debug);
    if (!this.enabled || this.active) return;
    const {duration} = this;
    this._duration = window.setTimeout(() => this._onCycle(true), duration);
    ESLCarouselAutoplayEvent.dispatch(this);
  }

  /** Handles click on control element to toggle plugin state */
  @listen({
    event: 'click',
    target: ($this: ESLCarouselAutoplayMixin) => $this.$controls,
    condition: ($this: ESLCarouselAutoplayMixin)=> !!$this.$controls.length
  })
  protected _onToggle(e: Event): void {
    this.enabled ? this.stop() : this.start();
    e.preventDefault();
  }

  /** Handles auxiliary events that represent user interaction to pause/resume timer */
  @listen({
    event: 'mouseleave mouseenter focusin focusout',
    condition: ($this: ESLCarouselAutoplayMixin) => $this.config.trackInteraction
  })
  protected _onInteract(e: Event): void {
    if (!this.enabled) return;
    if (['mouseenter', 'focusin'].includes(e.type)) {
      this.stop(true);
    } else {
      this.start();
    }
  }

  /** Handles intersection changes to start/stop autoplay based on visibility */
  @listen({
    auto: false,
    event: ESLIntersectionEvent.TYPE,
    target: ($this: ESLCarouselAutoplayMixin) =>
      ESLIntersectionTarget.for($this.$host, {threshold: [$this.config.intersection]})
  })
  protected _onIntersection(e: ESLIntersectionEvent): void {
    e.isIntersecting ? this.start(true) : this.stop(true);
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
