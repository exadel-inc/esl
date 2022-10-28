import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';

import {ESLShareIcon} from './esl-share-icon';
import {ESLShareTrigger} from './esl-share-trigger';

export class ESLShare extends ESLBaseElement {
  public static is = 'esl-share';

  public static register(): void {
    ESLShareIcon.register();
    ESLShareTrigger.register();
    super.register();
  }

  @attr({defaultValue: 'popup', readonly: true}) public layout: string;
  // @attr({dataAttr: true, defaultValue: 'general'}) public realm: string;
  @attr({readonly: true}) public limit: string;
  @attr({readonly: true}) public preferable: string;
  @attr({dataAttr: true}) public url: string;
  @attr({dataAttr: true}) public title: string;
  @attr({dataAttr: true}) public screenReaderTitle: string;
  @attr({defaultValue: ''}) public activeClass: string;
  @attr({defaultValue: ''}) public activeClassTarget: string;

  @boolAttr({readonly: true}) public ready: boolean;

  protected _ready: Promise<void>;
}
