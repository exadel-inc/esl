import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {listen, ready} from '../../../esl-utils/decorators';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {ESLCarouselSlideEvent} from '../../core/esl-carousel.events';
import {setAttr} from '../../../esl-utils/dom/attr';

/**
 * {@link ESLCarousel} auto-play (auto-advance) plugin mixin
 * Automatically switch slides by timeout
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Anchor')
export class ESLCarouselAnchorMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-anchored';

  protected override connectedCallback(): boolean | void {
    this.navigate((window.location.hash || '').slice(1));
    return super.connectedCallback();
  }

  protected navigate(hash: string): void {
    // Use native approach for now to find slide by hash to process everything before carousel initialization
    if (!hash) return;
    const slideMarker = this.$host.tagName.toLowerCase() + '-slide';
    const $anchoredSlide = this.$host.querySelector(`#${hash}`);
    if (!$anchoredSlide || !$anchoredSlide.hasAttribute(slideMarker)) return;
    const $currentSlides = [...this.$host.querySelectorAll(`[${slideMarker}]`)];
    setAttr($currentSlides, 'active', false);
    setAttr($anchoredSlide, 'active', true);
  }

  /** Handles slide change event to update hash if it is presented on the slide */
  @listen(ESLCarouselSlideEvent.AFTER)
  protected _onSlideChange(e: ESLCarouselSlideEvent): void {
    const $slide = e.target.$activeSlide;
    if (!$slide || !$slide.id || $slide.hasAttribute('ignore-anchor')) return;
    window.location.hash = $slide.id;
  }
}

declare global {
  export interface ESLCarouselNS {
    Anchor: typeof ESLCarouselAnchorMixin;
  }
}
