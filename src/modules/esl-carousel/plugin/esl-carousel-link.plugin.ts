import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind, attr} from '../../esl-utils/decorators';
import {ESLCarousel} from '../core/esl-carousel';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

import {ESLCarouselPlugin} from '../core/esl-carousel-plugin';

/**
 * Slide Carousel Link plugin. Allows to bind carousel positions.
 */
@ExportNs('CarouselPlugins.Link')
export class ESLCarouselLinkPlugin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-link-plugin';
  public static override observedAttributes = ['to', 'direction'];

  @attr() public to: string;
  @attr({defaultValue: 'both'}) public direction: string;

  private _$target: ESLCarousel | null;

  public bind(): void {
    if (!this.$target) {
      this.$target = ESLTraversingQuery.first(this.to) as ESLCarousel | null;
    }
    if (!(this.$target instanceof ESLCarousel)) return;

    if (this.direction === 'both' || this.direction === 'reverse') {
      this.$target.addEventListener('esl:slide:changed', this._onSlideChange);
    }
    if (this.direction === 'both' || this.direction === 'target') {
      this.carousel.addEventListener('esl:slide:changed', this._onSlideChange);
    }
  }

  public unbind(): void {
    this.$target && this.$target.removeEventListener('esl:slide:changed', this._onSlideChange);
    this.carousel && this.carousel.removeEventListener('esl:slide:changed', this._onSlideChange);
  }

  /** Handles event that fires when the carousel slides state is changed. */
  @bind
  protected _onSlideChange(e: CustomEvent): void {
    if (!this.$target || !this.carousel) return;
    const $target = e.target === this.carousel ? this.$target : this.carousel;
    const $source = e.target === this.carousel ? this.carousel : this.$target;
    $target.goTo($source.firstIndex, e.detail.direction);
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (this.carousel && oldVal !== newVal) {
      this.unbind();
      if (attrName === 'to') {
        this._$target = null;
      }
      this.bind();
    }
  }

  get $target(): ESLCarousel | null {
    return this._$target;
  }
  set $target(target: ESLCarousel | null) {
    this._$target = target;
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
