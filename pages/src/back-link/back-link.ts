import {ESLMixinElement} from '../../../src/modules/esl-mixin-element/core';


export class ESLBackLink extends ESLMixinElement {
  static is = 'esl-back-link';

  public connectedCallback(): void {
    super.connectedCallback();
    if (!document.referrer) return;
    const refUrl = new URL(document.referrer);
    if (refUrl.host !== window.location.host) return;
    this.$$attr('href', document.referrer);
    this.$$attr(ESLBackLink.is, false);
  }

}
