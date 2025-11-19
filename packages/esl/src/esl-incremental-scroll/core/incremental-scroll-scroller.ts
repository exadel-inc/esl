import {Rect} from '../../esl-utils/dom/rect';
import {keepPosition} from './incremental-scroll-align-strategies';
import {ESLIncrementalScrollAxisStepper} from './incremental-scroll-axis-stepper';

import type {ComputeStepOptions, IncrementalScrollOptions} from './incremental-scroll-types';

/** Coordinates incremental scrolling for both axes using provided alignment strategies */
export class ESLIncrementalScrollScroller {
  protected steppers: ESLIncrementalScrollAxisStepper[] = [];

  public constructor(private $el: HTMLElement | null, private options: IncrementalScrollOptions) {
    const {alignment = {}} = options;
    this.steppers = [
      alignment.x ?? keepPosition,
      alignment.y ?? keepPosition
    ].map((strategy) => new ESLIncrementalScrollAxisStepper(strategy(options), options));
  }

  /** Indicates whether scrolling should continue based on axis steppers' states */
  public get shouldContinue(): boolean {
    return this.steppers.some((s) => s.shouldContinueStepping());
  }

  /** Current geometry snapshot used by axis steppers to compute deltas */
  public get stepOptions(): ComputeStepOptions {
    return {
      elRect: this.$el ? Rect.from(this.$el) : undefined,
      containerRect: this.options.scrollContainer ? Rect.from(this.options.scrollContainer) : undefined
    };
  }

  /** Executes a single scroll step for both axes based on computed deltas */
  public step(): void {
    const {stepOptions} = this;
    const [dX, dY] = this.steppers.map((stepper) => (stepper).computeStep(stepOptions));
    const {scrollContainer} = this.options;
    if (scrollContainer) {
      scrollContainer.scrollLeft += dX;
      scrollContainer.scrollTop += dY;
    } else {
      window.scrollTo(window.scrollX + dX, window.scrollY + dY);
    }
  }
}
