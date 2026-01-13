import {createDeferred} from '../../esl-utils/async';
import {copyDefinedKeys} from '../../esl-utils/misc/object';
import {keepPosition} from './incremental-scroll-align-strategies';
import {ESLIncrementalScroller} from './incremental-scroll-scroller';
import type {ESLIncrementalScrollOptions} from './incremental-scroll-types';

const animationFrames = new WeakMap<HTMLElement | Window, number>();

const defaultOptions: ESLIncrementalScrollOptions = {
  alignment: {
    x: keepPosition,
    y: keepPosition
  },
  offset: 0,
  stabilityThreshold: 500,
  timeout: 4000
};

/**
 * ESLIncrementalScroll class provides static method to perform incremental scroll to a target element.
 * It continuously recalculates the target position on each animation frame to handle dynamic content and animations.
 */
export class ESLIncrementalScroll {
  /**
   * Returns a copy of current default options for incremental scroll.
   * @returns Current default options
   */
  public static get defaults(): ESLIncrementalScrollOptions {
    return {...defaultOptions};
  }

  /**
   * Sets default options for incremental scroll.
   * Only defined values from overrides will be applied.
   * @param overrides - Partial options to override defaults
   */
  public static set defaults(overrides: ESLIncrementalScrollOptions) {
    Object.assign(defaultOptions, copyDefinedKeys(overrides));
  }

  /**
   * Performs incremental scroll to bring an element into view with smooth animation.
   * Continuously recalculates target position on each frame to handle dynamic content and animations.
   * @param $el - Target element to scroll to, or null to scroll based on alignment strategy only
   * @param options - Scroll configuration options
   * @returns Promise that resolves when scroll completes or rejects if aborted
   */
  public static to($el: HTMLElement | null, options: ESLIncrementalScrollOptions = {}): Promise<void> {
    const deferred = createDeferred<void>();
    let requestId: number;

    const opts = {...defaultOptions, ...options};
    const scrollContainer = opts.scrollContainer || window;
    const scroller = new ESLIncrementalScroller($el, opts);

    function signalCallback(e?: Event): void {
      opts.signal?.removeEventListener('abort', signalCallback);
      if (requestId) cancelAnimationFrame(requestId);
      if (e) rejectOnSignal(); // Only reject if called by abort event
    }
    function rejectOnSignal(): void {
      animationFrames.delete(scrollContainer);
      deferred.reject(new DOMException('Aborted', 'AbortError'));
    }
    opts.signal?.addEventListener('abort', signalCallback);

    const existingRequestId = animationFrames.get(scrollContainer);
    if (existingRequestId) cancelAnimationFrame(existingRequestId);

    // schedule step task
    requestId = requestAnimationFrame(function step() {
      if (opts.signal?.aborted) return rejectOnSignal();

      scroller.step();

      if (scroller.shouldContinue) {
        requestId = requestAnimationFrame(step);
        animationFrames.set(scrollContainer, requestId);
      } else {
        opts.signal?.removeEventListener('abort', signalCallback);
        animationFrames.delete(scrollContainer);
        deferred.resolve();
      }
    });
    animationFrames.set(scrollContainer, requestId);
    return deferred.promise;
  }
}
