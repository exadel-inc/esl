import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {CSSClassUtils} from '../../../src/modules/esl-utils/dom/class';
import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {requestGss} from './search-script';

export class ESLDemoSearchPageWrapper extends ESLBaseElement {
  static is = 'esl-d-search-page-wrapper';

  @ready
  protected connectedCallback(): void {
    requestGss().then(() => this.afterSearchScriptLoad());
  }

  private afterSearchScriptLoad(): void {
    const loadingAnimationEL = this.querySelector('.animation-loading');
    if (loadingAnimationEL) {
      CSSClassUtils.add(loadingAnimationEL, 'disabled');
    }
  }
}
