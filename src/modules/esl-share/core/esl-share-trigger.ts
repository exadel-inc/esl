import {ESLTrigger} from '../../esl-trigger/core';
import {attr} from '../../esl-utils/decorators';

export class ESLShareTrigger extends ESLTrigger {
  public static is = 'esl-share-trigger';

  @attr({defaultValue: 'toggle'}) public mode: string;
  @attr({defaultValue: 'all'}) public trackClick: string;
  @attr({defaultValue: 'all'}) public trackHover: string;

}
