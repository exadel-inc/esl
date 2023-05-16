import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, listen} from '../../esl-utils/decorators';
import {ESLCarousel} from '../core/esl-carousel';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

import {ESLCarouselPluginElement} from '../core/plugin/esl-carousel.plugin.element';

/**
 * Slide Carousel Link plugin. Allows to bind carousel positions.
 */
@ExportNs('CarouselPlugins.Link')
export class ESLCarouselLinkPlugin extends ESLCarouselPluginElement {
  public static override is = 'esl-carousel-link-plugin';
  public static override observedAttributes = ['target', 'to', 'direction'];

  @attr() public to: string;
  @attr({defaultValue: 'both'}) public direction: string;

  private _$target: ESLCarousel | null;

  public bind(): void {
    if (!this.$target) {
      this.$target = ESLTraversingQuery.first(this.to) as ESLCarousel | null;
    }
    if (!(this.$target instanceof ESLCarousel)) return;
  }

  public unbind(): void {
  }

  public get $observedTargets(): ESLCarousel[] {
    if (!this.$target) return [];
    if (this.direction === 'both') return [this.$target, this.carousel];
    if (this.direction === 'reverse') return [this.$target];
    if (this.direction === 'target') return [this.carousel];
    return [];
  }

  /** Handles event that fires when the carousel slides state is changed. */
  @listen({
    event: 'esl:slide:changed',
    target: (that: ESLCarouselLinkPlugin) => that.$observedTargets
  })
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
  export interface ESLCarouselNS {
    Link: typeof ESLCarouselLinkPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel-link-plugin': ESLCarouselLinkPlugin;
  }
}
