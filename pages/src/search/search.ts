import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {CSSClassUtils} from '../../../src/modules/esl-utils/dom/class';
import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {loadSearchScript} from './search-script';

export class ESLDemoSearchPageWrapper extends ESLBaseElement {
  static is = 'esl-d-search-page-wrapper';

  @ready
  protected connectedCallback(): void {
    loadSearchScript().then(() => {
      const loadingAnimationEL = this.querySelector('.animation-loading')!;
      CSSClassUtils.add(loadingAnimationEL, 'disabled');
    });
  }
}
