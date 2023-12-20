import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {CSSClassUtils} from '@exadel/esl/modules/esl-utils/dom/class';
import {ready} from '@exadel/esl/modules/esl-utils/decorators';
import {requestGss} from './search-script';

export class ESLDemoSearchPageWrapper extends ESLBaseElement {
  static override is = 'esl-d-search-page-wrapper';

  @ready
  protected override connectedCallback(): void {
    requestGss().then(() => this.afterSearchScriptLoad());
  }

  private afterSearchScriptLoad(): void {
    const loadingAnimationEL = this.querySelector('.animation-loading');
    if (loadingAnimationEL) {
      CSSClassUtils.add(loadingAnimationEL, 'disabled');
    }
  }
}
