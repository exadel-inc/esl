import {memoize} from '../../esl-utils/decorators';
import {ESLShareBaseAction} from '../core/esl-share-action';

import type {ESLShareButton} from '../core/esl-share-button';

@ESLShareBaseAction.register
export class ESLShareNativeAction extends ESLShareBaseAction {
  public static readonly is: string = 'native';

  @memoize()
  public get isAvailable(): boolean {
    return navigator.share !== undefined;
  }

  public share(shareData: ShareData, $button: ESLShareButton): void {
    if (!this.isAvailable) return;

    navigator.share(shareData);
  }
}
