import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr} from '../../../esl-base-element/core';
import ESLCarouselPlugin from './esl-carousel-plugin';

/**
 * Slide Carousel Autoplay (Auto-Advance) plugin
 * Automatically switch slides by timeout
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('CarouselPlugins.Autoplay')
export class ESLCarouselAutoplayPlugin extends ESLCarouselPlugin {
  public static is = 'esl-carousel-autoplay-plugin';

  @attr({defaultValue: 'next'}) public direction: string;
  @attr({defaultValue: '5000'}) public timeout: number;

  private _active: boolean;
  private _timeout: number | null = null;

  constructor() {
    super();
    this._onInterval = this._onInterval.bind(this);
    this._onInteract = this._onInteract.bind(this);
  }

  public get active() {
    return this._active;
  }

  public bind(): void {
    this.carousel.addEventListener('mouseover', this._onInteract);
    this.carousel.addEventListener('mouseout', this._onInteract);
    this.carousel.addEventListener('focusin', this._onInteract);
    this.carousel.addEventListener('focusout', this._onInteract);
    this.carousel.addEventListener('esl:carousel:slide:changed', this._onInteract);
    this.start();
    // console.log('Auto-advance plugin attached successfully to ', this.carousel);
  }
  public unbind(): void {
    this.carousel.removeEventListener('mouseover', this._onInteract);
    this.carousel.removeEventListener('mouseout', this._onInteract);
    this.carousel.removeEventListener('focusin', this._onInteract);
    this.carousel.removeEventListener('focusout', this._onInteract);
    this.carousel.removeEventListener('esl:carousel:slide:changed', this._onInteract);
    this.stop();
    // console.log('Auto-advance plugin detached successfully from ', this.carousel);
  }

  public start() {
    this._active = true;
    this.reset();
  }
  public stop() {
    this._active = false;
    this.reset();
  }

  public reset() {
    if (typeof this._timeout === 'number') clearTimeout(this._timeout);
    this._timeout = this._active ? window.setTimeout(this._onInterval, this.timeout) : null;
  }

  protected _onInterval() {
    if (!this._active) return;
    switch (this.direction) {
      case 'next':
        this.carousel.next();
        return;
      case 'prev':
        this.carousel.prev();
        return;
    }
    this.reset();
  }

  protected _onInteract(e: Event) {
    switch (e.type) {
      case 'mouseover':
      case 'focusin':
        this.stop();
        return;
      case 'mouseout':
      case 'focusout':
        this.start();
        return;
      case 'eslc:slide:changed':
        this.reset();
        return;
    }
  }
}

export default ESLCarouselAutoplayPlugin;
