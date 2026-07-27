import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {memoize, listen, attr, jsonAttr} from '../../esl-utils/decorators';
import {ESLIntersectionTarget} from '../../esl-utils/dom/events';

import type {ESLIntersectionEvent} from '../../esl-utils/dom/events';

/**
 * ESLStickyBoxConfig - interface for ESLStickyBoxMixin config
 */
export interface ESLStickyBoxConfig {
  /** CSS selector or {@link ESLTraversingQuery} to define the scrollable container
   *  to observe the sticky state relative to
   *  If not set or the target can not be resolved, the browser viewport (`window`) is used
   */
  root?: string;
}

@ExportNs('StickyBox')
export class ESLStickyBoxMixin extends ESLMixinElement {
  public static override is = 'esl-sticky-box';

  /** Indicates whether the sticky box is currently stuck to the top of the viewport */
  @attr() public declare stuck: boolean;

  /** Configuration object */
  @jsonAttr({name: ESLStickyBoxMixin.is}) public config: ESLStickyBoxConfig;

  /** Sentinel element for intersection observer */
  @memoize()
  protected get $sentinel(): HTMLElement {
    const $sentinel = document.createElement('div');
    $sentinel.classList.add(`${ESLStickyBoxMixin.is}-sentinel`);
    this.$host.parentElement?.insertBefore($sentinel, this.$host);
    return $sentinel;
  }

  /** Element used as the {@link IntersectionObserver} root to track the sticky state. `null` falls back to the browser viewport */
  protected get $root(): Element | Document | null {
    return (this.config?.root && this.$$find(this.config.root)) || null;
  }

  /** Resubscribes to the intersection observer when the configuration changes */
  protected override attributeChangedCallback(name: string): void {
    if (name !== ESLStickyBoxMixin.is) return;
    this.$$on(this._onIntersection);
  }

  /** Handles intersection events and updates the stuck state accordingly */
  @listen({
    event: 'intersects',
    target: ($that: ESLStickyBoxMixin) => ESLIntersectionTarget.for($that.$sentinel, {root: $that.$root, threshold: [0.99, 1]})
  })
  protected _onIntersection(e: ESLIntersectionEvent): void {
    this.stuck = !e.isIntersecting && e.boundingClientRect.top < (e.rootBounds?.top ?? 0);
  }
}

declare global {
  export interface ESLLibrary {
    StickyBox: typeof ESLStickyBoxMixin;
  }
}
