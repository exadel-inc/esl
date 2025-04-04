import {ESLMixinElement} from '../../esl-mixin-element/core';
import {listen} from '../../esl-utils/decorators';
import {ESLIntersectionTarget, ESLResizeObserverTarget} from '../../esl-event-listener/core';
import {getViewportForEl} from '../../esl-utils/dom/scroll';
import {ESLAnchornav} from './esl-anchornav';

import type {ESLIntersectionEvent, ESLElementResizeEvent} from '../../esl-event-listener/core';

/**
 * ESLAnchornavSticked - custom mixin element for sticky positioned of {@link ESLAnchornav} element
 *
 * Use example:
 * `<div esl-anchornav-sticked><esl-anchornav></esl-anchornav></div>`
 */
export class ESLAnchornavSticked extends ESLMixinElement {
  static override is = 'esl-anchornav-sticked';

  protected _sticked: boolean = false;

  /** The height of this anchornav container */
  public get anchornavHeight(): number {
    return this.$host.getBoundingClientRect().height;
  }

  /** Sticked state */
  public get sticked(): boolean {
    return this._sticked;
  }
  public set sticked(value: boolean) {
    if (this._sticked === value) return;
    this._sticked = value;
    this.$$cls(`${ESLAnchornavSticked.is}-active`, value);
    this._onStateChange();
  }

  /** Childs anchornav element */
  protected get $anchornav(): ESLAnchornav | null {
    return this.$host.querySelector<ESLAnchornav>(ESLAnchornav.is);
  }

  /** Handles changing sticky state */
  protected _onStateChange(): void {
    if (!this.$anchornav) return;
    this.$anchornav.offset = this.sticked ? this.anchornavHeight : 0;
  }

  @listen({
    event: 'intersects',
    target: (that: ESLAnchornavSticked) => ESLIntersectionTarget.for(that.$host, {
      root: getViewportForEl(that.$host),
      rootMargin: '-1px 0px 0px 0px',
      threshold: [0.99, 1]
    })
  })
  protected _onIntersection(e: ESLIntersectionEvent): void {
    this.sticked = e.intersectionRect.y > e.boundingClientRect.y;
  }

  @listen({event: 'resize', target: (that: ESLAnchornavSticked) => ESLResizeObserverTarget.for(that.$host)})
  protected _onResize(e: ESLElementResizeEvent): void {
    this._onStateChange();
  }
}
