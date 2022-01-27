import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {memoizeFn} from '../../../src/modules/esl-utils/misc/memoize';
import {CSSClassUtils} from '../../../src/modules/esl-utils/dom/class';
import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {loadSearchScript} from './search-script';

export class ESLDemoSearchPageWrapper extends ESLBaseElement {
  static is = 'esl-d-search-page-wrapper';

  memoizeSearchScript = memoizeFn(() => loadSearchScript());

  @ready
  protected connectedCallback(): void {
    this.memoizeSearchScript().then(() => this.afterSearchScriptLoad());
  }

  private afterSearchScriptLoad(): void {
    const loadingAnimationEL = this.querySelector('.animation-loading');
    if (loadingAnimationEL) {
      CSSClassUtils.add(loadingAnimationEL, 'disabled');
    }
  }
}
