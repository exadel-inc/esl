import {memoize} from '../../esl-utils/decorators/memoize';
import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';

import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselConfig} from './esl-carousel.types';
import type {ESLCarouselRenderer} from './esl-carousel.renderer';

export type ESLCarouselRendererConstructable = (new(carousel: ESLCarousel, config: ESLCarouselConfig) => ESLCarouselRenderer) & typeof ESLCarouselRenderer;

export class ESLCarouselRendererRegistry extends SyntheticEventTarget {
  private store = new Map<string, ESLCarouselRendererConstructable>();

  @memoize()
  public static get instance(): ESLCarouselRendererRegistry {
    return new ESLCarouselRendererRegistry();
  }

  public create(carousel: ESLCarousel, config: ESLCarouselConfig): ESLCarouselRenderer {
    let Renderer = this.store.get(config.type);
    if (!Renderer) [Renderer] = this.store.values(); // take first Renderer in store
    return new Renderer(carousel, config);
  }

  public register(view: typeof ESLCarouselRenderer): void {
    if (!view || !view.is) throw Error('[ESL] ESLCarouselRenderer: incorrect registration request');
    if (this.store.has(view.is)) throw Error(`[ESL] ESLCarouselRenderer: instance with name ${view.is} already defined`);
    this.store.set(view.is, view as ESLCarouselRendererConstructable);
    const detail = {name: view.is, view};
    const event = new CustomEvent('change', {detail});
    this.dispatchEvent(event);
  }
}
