import type {Rect} from '../../esl-utils/dom/rect';

export interface ComputeStepOptions {
  elRect?: Rect;
  containerRect?: Rect;
}

export type AlignmentStrategy = (opts: IncrementalScrollOptions) => DistanceCalculator;
export type DistanceCalculator = (opts: ComputeStepOptions) => number;

export interface IncrementalScrollOptions {
  alignment?: {
    x?: AlignmentStrategy;
    y?: AlignmentStrategy;
  };
  offset?: number | {x?: number, y?: number};
  scrollContainer?: HTMLElement;
  signal?: AbortSignal;
  stabilityThreshold?: number;
  timeout?: number;
}
