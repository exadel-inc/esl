import {resolveOffset, getDocScrollHeight, getDocScrollWidth} from './incremental-scroll-utils';
import type {
  AlignmentStrategy,
  ComputeStepOptions,
  DistanceCalculator,
  ESLIncrementalScrollOptions
} from './incremental-scroll-types';

/**
 * Alignment strategy that keeps current scroll position unchanged.
 * Always returns zero distance, effectively disabling scroll on this axis.
 */
export const keepPosition: AlignmentStrategy = () => () => 0;

/** Creates alignment strategy that positions element at the top of container or viewport */
export function alignToTop(options: ESLIncrementalScrollOptions): DistanceCalculator {
  const offset = resolveOffset(options.offset, 'y');
  return (opts: ComputeStepOptions) => {
    const {elRect, containerRect} = opts;
    if (containerRect) return elRect ? elRect.top - containerRect.top - offset : 0;
    return elRect ? elRect.top - offset : -window.scrollY + offset;
  };
}

/** Creates alignment strategy that centers element vertically in container or viewport */
export function alignToMiddle(options: ESLIncrementalScrollOptions): DistanceCalculator {
  const offset = resolveOffset(options.offset, 'y');
  return (opts: ComputeStepOptions) => {
    const {elRect, containerRect} = opts;
    if (containerRect) return elRect ? elRect.cy - containerRect.cy - offset : 0;
    if (!elRect) {
      const desiredY = Math.max(0, (getDocScrollHeight() - window.innerHeight) / 2);
      return desiredY - window.scrollY + offset;
    }
    const viewportCenter = window.innerHeight / 2;
    return elRect.cy - viewportCenter - offset;
  };
}

/** Creates alignment strategy that positions element at the bottom of container or viewport */
export function alignToBottom(options: ESLIncrementalScrollOptions): DistanceCalculator {
  const offset = resolveOffset(options.offset, 'y');
  return (opts: ComputeStepOptions) => {
    const {elRect, containerRect} = opts;
    if (containerRect) return elRect ? elRect.bottom - containerRect.bottom - offset : 0;
    if (!elRect) return getDocScrollHeight() - window.innerHeight - window.scrollY + offset;
    return elRect.bottom - window.innerHeight - offset;
  };
}

/** Creates alignment strategy that positions element at the left edge of container or viewport */
export function alignToLeft(options: ESLIncrementalScrollOptions): DistanceCalculator {
  const offset = resolveOffset(options.offset, 'x');
  return (opts: ComputeStepOptions) => {
    const {elRect, containerRect} = opts;
    if (containerRect) return elRect ? elRect.left - containerRect.left - offset : 0;
    return elRect ? elRect.left - offset : -window.scrollX + offset;
  };
}

/** Creates alignment strategy that centers element horizontally in container or viewport */
export function alignToCenter(options: ESLIncrementalScrollOptions): DistanceCalculator {
  const offset = resolveOffset(options.offset, 'x');
  return (opts: ComputeStepOptions) => {
    const {elRect, containerRect} = opts;
    if (containerRect) return elRect ? elRect.cx - containerRect.cx - offset : 0;
    if (!elRect) {
      const desiredX = Math.max(0, (getDocScrollWidth() - window.innerWidth) / 2);
      return desiredX - window.scrollX + offset;
    }
    const viewportCenter = window.innerWidth / 2;
    return elRect.cx - viewportCenter - offset;
  };
}

/** Creates alignment strategy that positions element at the right edge of container or viewport */
export function alignToRight(options: ESLIncrementalScrollOptions): DistanceCalculator {
  const offset = resolveOffset(options.offset, 'x');
  return (opts: ComputeStepOptions) => {
    const {elRect, containerRect} = opts;
    if (containerRect) return elRect ? elRect.right - containerRect.right - offset : 0;
    if (!elRect) return getDocScrollWidth() - window.innerWidth - window.scrollX + offset;
    return elRect.right - window.innerWidth - offset;
  };
}
