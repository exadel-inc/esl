import type {ESLBaseElementShape} from '../../../esl-base-element/core/esl-base-element.shape';
import type {ESLCarouselNavDots} from './esl-carousel.nav.dots';

export interface ESLCarouselNavDotsShape extends ESLBaseElementShape<ESLCarouselNavDots> {
  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance (alias for prop `carousel`) */
  'target'?: string;

  /** Label format (supports `index` key) */
  'dot-label-format'?: string;

  /** Does not accept child nodes */
  children?: never[];
}

declare global {
  export interface ESLIntrinsicElements {
    /** {@link ESLCarouselNavDots} custom tag */
    'esl-carousel-dots': ESLCarouselNavDotsShape;
  }
}
