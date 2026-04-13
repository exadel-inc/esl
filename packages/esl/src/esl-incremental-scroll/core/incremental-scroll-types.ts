import type {Rect} from '../../esl-utils/dom/rect';

/**
 * Options for computing a single step in incremental scroll
 */
export interface ComputeStepOptions {
  /* Target element to scroll to */
  elRect?: Rect;
  /* Scroll container element */
  containerRect?: Rect;
}

/** Alignment strategy function type */
export type AlignmentStrategy = (opts: ESLIncrementalScrollOptions) => DistanceCalculator;
/** Distance calculator function type */
export type DistanceCalculator = (opts: ComputeStepOptions) => number;

/**
 * Options for ESLIncrementalScroll operation
 */
export interface ESLIncrementalScrollOptions {
  /* Alignment strategy for scrolling */
  alignment?: {
    /* Horizontal alignment strategy */
    x?: AlignmentStrategy;
    /* Vertical alignment strategy */
    y?: AlignmentStrategy;
  };
  /* Offset to apply after alignment calculation */
  offset?: number | {x?: number, y?: number};
  /* Scroll container element; defaults to window if not provided */
  scrollContainer?: HTMLElement;
  /* AbortSignal to cancel the scroll operation */
  signal?: AbortSignal;
  /* Time in milliseconds to ensure content stops shifting before completing scroll */
  stabilityThreshold?: number;
  /* Maximum scroll duration in milliseconds */
  timeout?: number;
}
