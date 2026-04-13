import type {ComputeStepOptions, DistanceCalculator, ESLIncrementalScrollOptions} from './incremental-scroll-types';

/**
 * ESLIncrementalScrollAxisStepper encapsulates per-axis easing/acceleration logic.
 * It receives raw distance to target (signed) and returns incremental delta to apply this frame.
 */
export class ESLIncrementalScrollAxisStepper {
  protected initialTime: number;
  protected startTime: number;
  protected lastUnstableTime: number = 0;
  protected maxStepIncrement: number = 1;

  public constructor(private calcDistance: DistanceCalculator, private options: ESLIncrementalScrollOptions) {
    this.initialTime = Date.now();
    this.startTime = this.initialTime;
  }

  /**
   * Computes the scroll delta for current animation frame.
   * Returns 0 when target is reached (distance less than 1px).
   * Gradually increases step size for smooth acceleration.
   */
  public computeStep(options: ComputeStepOptions): number {
    const distance = this.calcDistance(options);
    const distanceAbs = Math.abs(distance);

    if (distanceAbs <= 1) {
      // stable, updating time, not escalating maxStepIncrement
      this.startTime = Date.now();
      return 0;
    }

    const now = Date.now();
    // The speed of incremental scroll (px/ms) depends on the distance to the target position
    const speed = Math.floor(distanceAbs / 100) + 1;
    // The step increment limits by maxStepIncrement and provides a smooth start to scrolling
    const stepIncrement = Math.min(this.maxStepIncrement, speed * (now - this.startTime));
    this.startTime = now;

    const increment = Math.floor(Math.min(distanceAbs, stepIncrement));
    const direction = distance > 0 ? increment : -increment;

    this.lastUnstableTime = this.startTime;
    if (this.maxStepIncrement < 1000) this.maxStepIncrement *= 2;

    return direction;
  }

  /** Determines if scrolling should continue. Stops when stability threshold is exceeded or timeout is reached */
  public shouldContinueStepping(): boolean {
    return this.startTime - this.lastUnstableTime < this.options.stabilityThreshold! &&
      this.startTime - this.initialTime < this.options.timeout!;
  }
}
