/**
 * Custom error that ESLCarousel throws when navigation is rejected due to ongoing animation.
 * By default, it does not include a stack trace to avoid cluttering the console.
 */
export class ESLCarouselNavRejection extends Error {
  /** Debug mode to enable stack trace in the error log */
  public static debug = false;

  constructor(index: number | string) {
    super(`Navigation skipped to index ${index} due to ongoing animation`);
    this.name = '[ESL] Carousel Rejection';
    if (!ESLCarouselNavRejection.debug) this.stack = undefined; // disable stack trace
  }
}
