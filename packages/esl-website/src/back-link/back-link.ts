import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/core';

export class ESLDemoBackLink extends ESLMixinElement {
  static override is = 'esl-d-back-link';

  public override connectedCallback(): void {
    super.connectedCallback();
    if (!document.referrer) return;
    const refUrl = new URL(document.referrer);
    if (refUrl.host !== window.location.host) return;
    this.$$attr('href', document.referrer);
    this.$$attr(ESLDemoBackLink.is, false);
  }
}
