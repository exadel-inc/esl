import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLCarousel} from './esl-carousel';

/**
 * Tag declaration interface of {@link ESLCarousel} element
 * Used for TSX declaration
 */
export interface ESLCarouselShape extends ESLBaseElementShape<ESLCarousel> {
  /** Media query pattern used for {@link ESLMediaRuleList} of `type`, `loop` and `count` (default: `all`) */
  media?: string;
  /** Renderer type name (`multi` by default). Supports {@link ESLMediaRuleList} syntax */
  type?: string;
  /** Marker to enable loop mode for a carousel (`true` by default). Supports {@link ESLMediaRuleList} syntax */
  loop?: string | boolean;
  /** Count of slides to show on the screen (`1` by default). Supports {@link ESLMediaRuleList} syntax */
  count?: string | number;
  /** Orientation of the carousel (`horizontal` by default). Supports {@link ESLMediaRuleList} syntax */
  vertical?: string | boolean;

  /** Duration of the single slide transition */
  'step-duration'?: string;

  /** Container selector (supports traversing query). Carousel itself by default */
  container?: string;
  /** CSS class to add on the container when carousel is empty */
  'container-empty-class'?: string;
  /** CSS class to add on the container when carousel is incomplete */
  'container-incomplete-class'?: string;

  /** Plugins attributes */
  [key: `esl-carousel-${string}`]: string;
}
