import type {ESLBaseElementShape} from '../../../esl-base-element/core/esl-base-element.shape';
import type {ESLCarouselInfo} from './esl-carousel.info';

export interface ESLCarouselInfoTagShape extends ESLBaseElementShape<ESLCarouselInfo> {
  /** {@link ESLTraversingQuery} string to find {@link ESLCarousel} instance (alias for prop `carousel`) */
  'target'?: string;

  /** Format string used to render info text. Supports `{name}`, `{{name}}` and `{%name%}` */
  'format'?: string;

  /** Accept text content */
  children?: string;
}
