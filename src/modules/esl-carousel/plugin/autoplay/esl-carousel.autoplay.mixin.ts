import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, bind, listen, ready} from '../../../esl-utils/decorators';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';

/**
 * {@link ESLCarousel} autoplay (auto-advance) plugin mixin
 * Automatically switch slides by timeout
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Autoplay')
export class ESLCarouselAutoplayMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-autoplay';

  /** Timeout to send next command to the host carousel */
  @attr({defaultValue: '5000', name: ESLCarouselAutoplayMixin.is})
  public timeout: number;

  /** Navigation command to send to the host carousel. Default: 'slide:next' */
  @attr({defaultValue: 'slide:next', name: ESLCarouselAutoplayMixin.is + '-command'})
  public command: string;

  private _timeout: number | null = null;

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

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.start();
  }

  /** Activates the timer to send commands */
  public start(): void {
    this.stop();
    this._timeout = window.setTimeout(this._onInterval, this.timeout);
  }

  /** Deactivates the timer to send commands */
  public stop(): void {
    if (typeof this._timeout === 'number') {
      window.clearTimeout(this._timeout);
    }
  }

  /** Handles next timer interval */
  @bind
  protected _onInterval(): void {
    this.$host?.goTo(this.command);
    this._timeout = window.setTimeout(this._onInterval, this.timeout);
  }

  /** Handles auxiliary events to pause/resume timer */
  @listen(`mouseout mouseover focusin focusout ${ESLCarouselSlideEvent.AFTER}`)
  protected _onInteract(e: Event): void {
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
