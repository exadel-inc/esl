import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, bind, boolAttr} from '../../esl-utils/decorators';

import {ESLCarouselPluginElement} from '../core/plugin/esl-carousel.plugin.element';

/**
 * Slide Carousel Autoplay (Auto-Advance) plugin
 * Automatically switch slides by timeout
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('CarouselPlugins.Autoplay')
export class ESLCarouselAutoplayPlugin extends ESLCarouselPluginElement {
  public static override is = 'esl-carousel-autoplay-plugin';

  @attr({defaultValue: 'next'}) public direction: string;
  @attr({defaultValue: '5000'}) public timeout: number;

  @boolAttr() public active: boolean;

  private _timeout: number | null = null;

  public bind(): void {
    this.carousel.addEventListener('mouseover', this._onInteract);
    this.carousel.addEventListener('mouseout', this._onInteract);
    this.carousel.addEventListener('focusin', this._onInteract);
    this.carousel.addEventListener('focusout', this._onInteract);
    this.carousel.addEventListener('esl:slide:changed', this._onInteract);
    this.start();
  }
  public unbind(): void {
    this.carousel.removeEventListener('mouseover', this._onInteract);
    this.carousel.removeEventListener('mouseout', this._onInteract);
    this.carousel.removeEventListener('focusin', this._onInteract);
    this.carousel.removeEventListener('focusout', this._onInteract);
    this.carousel.removeEventListener('esl:slide:changed', this._onInteract);
    this.stop();
  }

  public start(): void {
    this.active = true;
    this.reset();
  }
  public stop(): void {
    this.active = false;
    this.reset();
  }

  public reset(): void {
    if (typeof this._timeout === 'number') clearTimeout(this._timeout);
    this._timeout = this.active ? window.setTimeout(this._onInterval, this.timeout) : null;
  }

  @bind
  protected _onInterval(): void {
    if (!this.active) return;
    this.carousel.goTo(this.direction);
    this.reset();
  }

  @bind
  protected _onInteract(e: Event): void {
    switch (e.type) {
      case 'mouseover':
      case 'focusin':
        this.stop();
        return;
      case 'mouseout':
      case 'focusout':
        this.start();
        return;
      case 'esl:slide:changed':
        this.reset();
        return;
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Autoplay: typeof ESLCarouselAutoplayPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-autoplay-plugin': ESLCarouselAutoplayPlugin;
  }
}
