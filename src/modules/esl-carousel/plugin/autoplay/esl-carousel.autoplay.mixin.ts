import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {bind, listen, ready} from '../../../esl-utils/decorators';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

export interface ESLCarouselAutoplayConfig {
  /** Timeout to send next command to the host carousel */
  timeout: number;
  /** Navigation command to send to the host carousel. Default: 'slide:next' */
  command: string;
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
  public static override DEFAULT_CONFIG_KEY = 'timeout';

  private _timeout: number | null = null;

  public get active(): boolean {
    return !!this._timeout;
  }

  @ready
  protected override connectedCallback(): void {
    if (super.connectedCallback()) {
      this.start();
    }
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stop();
  }

  protected override onConfigChange(): void {
    this.start();
  }

  /** Activates the timer to send commands */
  public start(): void {
    this.stop();
    this._timeout = window.setTimeout(this._onInterval, this.config.timeout);
  }

  /** Deactivates the timer to send commands */
  public stop(): void {
    this._timeout && window.clearTimeout(this._timeout);
    this._timeout = null;
  }

  /** Handles next timer interval */
  @bind
  protected _onInterval(): void {
    this.$host?.goTo(this.config.command);
    this._timeout = window.setTimeout(this._onInterval, this.config.timeout);
  }

  /** Handles auxiliary events to pause/resume timer */
  @listen(`mouseout mouseover focusin focusout ${ESLCarouselSlideEvent.AFTER}`)
  protected _onInteract(e: Event): void {
    // Slide change can only delay the timer, but not start it
    if (e.type === ESLCarouselSlideEvent.AFTER && !this.active) return;
    if (['mouseover', 'focusin'].includes(e.type)) {
      this.stop();
    } else {
      this.start();
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Autoplay: typeof ESLCarouselAutoplayMixin;
  }
}
