import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr} from '../../../esl-utils/decorators';
import {ESLCarousel} from '../core/esl-carousel';
import {ESLCarouselPlugin} from './esl-carousel-plugin';

/**
 * Slide Carousel Link plugin. Allows to bind carousel positions.
 */
@ExportNs('CarouselPlugins.Link')
export class ESLCarouselLinkPlugin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-link-plugin';

  public static get observedAttributes() {
    return ['to', 'direction'];
  }

  @attr() public to: string;
  @attr({defaultValue: 'both'}) public direction: string;

  private _target: ESLCarousel | null;

  constructor() {
    super();
    this._onSlideChange = this._onSlideChange.bind(this);
  }

  public override bind() {
    if (!this.target) {
      this.target = document.querySelector(this.to);
    }
    if (!(this.target instanceof ESLCarousel)) return;

    if (this.direction === 'both' || this.direction === 'reverse') {
      this.target.addEventListener('esl:slide:changed', this._onSlideChange);
    }
    if (this.direction === 'both' || this.direction === 'target') {
      this.carousel.addEventListener('esl:slide:changed', this._onSlideChange);
    }
  }

  public override unbind() {
    this.target && this.target.removeEventListener('esl:slide:changed', this._onSlideChange);
    this.carousel && this.carousel.removeEventListener('esl:slide:changed', this._onSlideChange);
  }

  protected _onSlideChange(e: CustomEvent) {
    if (!this.target || !this.carousel) return;
    const $target = e.target === this.carousel ? this.target : this.carousel;
    const $source = e.target === this.carousel ? this.carousel : this.target;
    $target.goTo($source.firstIndex, e.detail.direction);
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (this.carousel && oldVal !== newVal) {
      this.unbind();
      if (attrName === 'to') {
        this._target = null;
      }
      this.bind();
    }
  }

  get target() {
    return this._target;
  }
  set target(target) {
    this._target = target;
  }
}

declare global {
  export interface ESLCarouselPlugins {
    Link: typeof ESLCarouselLinkPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-link-plugin': ESLCarouselLinkPlugin;
  }
}
