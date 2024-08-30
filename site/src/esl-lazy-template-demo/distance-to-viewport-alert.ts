import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';
import {ready} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLEventUtils} from '@exadel/esl/modules/esl-utils/dom/events';
import {Rect} from '@exadel/esl/modules/esl-utils/dom/rect';
import {getWindowRect} from '@exadel/esl/modules/esl-utils/dom/window';
import {getViewportForEl} from '@exadel/esl/modules/esl-utils/dom/scroll';

export class ESLDemoDistanceToViewportAlert extends ESLMixinElement {
  public static override is = 'distance-to-viewport-alert';

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.showAlert();
  }

  protected calculateDistance(): number {
    let topDistance;
    let bottomDistance;
    const elementRect = Rect.from(this.$host.getBoundingClientRect());
    const $root = getViewportForEl(this.$host) as HTMLElement;
    if (!$root) { // window
      const windowRect = getWindowRect();
      topDistance = elementRect.top - windowRect.height;
      bottomDistance = -elementRect.bottom;
    } else {
      const windowRect = Rect.from($root.getBoundingClientRect());
      topDistance = elementRect.top - windowRect.bottom;
      bottomDistance = -elementRect.bottom;
    }
    return Math.max(topDistance, bottomDistance);
  }

  protected showAlert(): void {
    const distance = this.calculateDistance();
    const text =  distance < 0
      ? `The element with id="${this.$host.id}" was connected to DOM when it was in viewport`
      : `The element with id="${this.$host.id}" was connected to DOM at the distance ${distance}px from the viewport`;

    const detail = {
      text,
      cls: 'alert-info',
      hideDelay: 5000
    };
    ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
  }
}
