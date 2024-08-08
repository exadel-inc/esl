import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {prop} from '../../esl-utils/decorators';
import {ESLEventUtils} from '../../esl-event-listener/core';

/**
 * ESLAnchor - custom mixin element for setting up anchor for {@link ESLAnchornav} attaching
 *
 * Use example:
 * `<div esl-anchor id="my-anchor-id" title="My anchor title"></div>`
 */
@ExportNs('Anchor')
export class ESLAnchor extends ESLMixinElement {
  static override is = 'esl-anchor';

  @prop('esl:anchornav:request') public ANCHORNAV_REQUEST_EVENT: string;

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.sendRequestEvent();
  }

  protected override disconnectedCallback(): void {
    this.sendRequestEvent();
    super.disconnectedCallback();
  }

  /** Sends a broadcast event to Anchornav components to refresh the list of anchors */
  protected sendRequestEvent(): void {
    ESLEventUtils.dispatch(document.body, this.ANCHORNAV_REQUEST_EVENT);
  }
}

declare global {
  export interface ESLLibrary {
    Anchor: typeof ESLAnchor;
  }
}
