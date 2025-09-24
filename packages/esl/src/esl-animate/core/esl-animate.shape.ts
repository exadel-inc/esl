import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLAnimate} from './esl-animate';

/**
 * Tag declaration interface of {@link ESLAnimate} element
 * Used for TSX declaration
 */
export interface ESLAnimateTagShape extends ESLBaseElementShape<ESLAnimate> {
  /**
   * Class(es) to add on viewport intersection
   * @see ESLAnimateConfig.cls
   */
  cls?: string;
  /**
   * Enable group animation for targets
   * @see ESLAnimateConfig.group
   */
  group?: boolean;
  /**
   * Delay to start animation from previous item in group
   * @see ESLAnimateConfig.groupDelay
   */
  groupDelay?: string;
  /**
   * Re-animate item after its getting hidden
   * @see ESLAnimateConfig.repeat
   */
  repeat?: boolean;
  /**
   * Intersection ratio to consider element as visible.
   * Only 0.2 (20%), 0.4 (40%), 0.6 (60%), 0.8 (80%) values are allowed due to share of IntersectionObserver instance
   * with a fixed set of thresholds defined.
   */
  ratio?: string;
  /**
   * Define target(s) to observe and animate
   * Uses {@link ESLTraversingQuery} with multiple targets support
   * Default: ` ` - current element, `<esl-animate>` behave as a wrapper
   */
  target?: string;
}

/** @deprecated alias for {@link ESLAnimateTagShape} */
export type ESLAnimateShape = ESLAnimateTagShape;
