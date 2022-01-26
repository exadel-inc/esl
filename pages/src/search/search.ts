import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {CSSClassUtils} from '../../../src/modules/esl-utils/dom/class';
import {ready} from '../../../src/modules/esl-utils/decorators/ready';
import {loadSearchScript} from './search-script';

export class ESLDemoSearchPageWrapper extends ESLBaseElement {
  static is = 'esl-d-search-page-wrapper';

  @ready
  protected connectedCallback(): void {
    loadSearchScript();
    this.initSearchScript();
  }

  private initSearchScript(): void {
    (window as any).__gcse = {
      parsetags: 'onload',
      initializationCallback: (): void => this.afterSearchScriptLoad()
    };
  }

  private afterSearchScriptLoad(): void {
    const loadingAnimationEL = this.querySelector('.animation-loading')!;
    CSSClassUtils.add(loadingAnimationEL, 'disabled');
  }
}
