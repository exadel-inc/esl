import {loadScript} from '../../../modules/esl-utils/dom/script';
import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {ready} from '../../../src/modules/esl-utils/decorators/ready';

export class ESLDemoSearchPageWrapper extends ESLBaseElement {
  static is = 'esl-d-search-page';

  @ready
  protected connectedCallback(): void {
    loadScript('gss', 'https://cse.google.com/cse.js?cx=3171f866738b34f02');
  }
}
