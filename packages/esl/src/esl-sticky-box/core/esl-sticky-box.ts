import {ESLBaseElement} from '../../esl-base-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {memoize, listen, attr} from '../../esl-utils/decorators';
import {ESLIntersectionTarget} from '../../esl-utils/dom/events';

import type {ESLIntersectionEvent} from '../../esl-utils/dom/events';

@ExportNs('StickyBox')
export class ESLStickyBox extends ESLBaseElement {
  public static override is = 'esl-sticky-box';

  /** Indicates whether the sticky box is currently stuck to the top of the viewport */
  @attr() public declare stuck: boolean;

  /**
   * CSS selector or {@link ESLTraversingQuery} to define the scrollable container
   * to observe the sticky state relative to.
   * If not set or the target can not be resolved, the browser viewport (`window`) is used
   */
  @attr() public declare root: string;

  /** Sentinel element for intersection observer */
  @memoize()
  protected get $sentinel(): HTMLElement {
    const $sentinel = document.createElement('div');
    $sentinel.classList.add(`${ESLStickyBox.is}-sentinel`);
    this.parentElement?.insertBefore($sentinel, this);
    return $sentinel;
  }

  /** Element used as the {@link IntersectionObserver} root to track the sticky state. `null` falls back to the browser viewport */
  protected get $root(): Element | Document | null {
    return (this.root && this.$$find(this.root)) || null;
  }

  /** Handles intersection events and updates the stuck state accordingly */
  @listen({
    event: 'intersects',
    target: ($that: ESLStickyBox) => ESLIntersectionTarget.for($that.$sentinel, {root: $that.$root, threshold: [0.99, 1]})
  })
  protected _onIntersection(e: ESLIntersectionEvent): void {
    this.stuck = !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? 0);
  }
}

declare global {
  export interface ESLLibrary {
    StickyBox: typeof ESLStickyBox;
  }
  export interface HTMLElementTagNameMap {
    'esl-sticky-box': ESLStickyBox;
  }
}
