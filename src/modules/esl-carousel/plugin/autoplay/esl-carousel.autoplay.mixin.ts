import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, bind, listen} from '../../../esl-utils/decorators';
import {ESLMixinElement} from '../../../esl-mixin-element/core';

import {ESLCarousel} from '../../core/esl-carousel';

/**
 * Slide Carousel auto-play (auto-advance) plugin mixin
 * Automatically switch slides by timeout
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Autoplay')
export class ESLCarouselAutoplayMixin extends ESLMixinElement {
  public static override is = 'esl-carousel-autoplay';

  public override $host: ESLCarousel;

  @attr({defaultValue: '5000', name: ESLCarouselAutoplayMixin.is})
  public timeout: number;

  @attr({defaultValue: 'slide:next', name: ESLCarouselAutoplayMixin.is + '-command'})
  public command: string;

  private _timeout: number | null = null;

  protected override async connectedCallback(): Promise<void> {
    const {$host} = this;
    await ESLCarousel.registered;
    if (($host as unknown) instanceof ESLCarousel) {
      super.connectedCallback();
      this.start();
    } else {
      console.error('[ESL]: %o is not correct target for %o', $host, ESLCarouselAutoplayMixin.is);
    }
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stop();
  }

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    this.start();
  }

  public start(): void {
    this.stop();
    this._timeout = window.setTimeout(this._onInterval, this.timeout);
  }

  public stop(): void {
    if (typeof this._timeout === 'number') {
      window.clearTimeout(this._timeout);
    }
  }

  @bind
  protected _onInterval(): void {
    this.$host?.goTo(this.command);
    this._timeout = window.setTimeout(this._onInterval, this.timeout);
  }

  @listen('mouseout mouseover focusin focusout esl:slide:changed')
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
