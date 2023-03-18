import {ESLShareBaseAction} from '../core/esl-share-action';

import type {ESLShareButton} from '../core/esl-share-button';

@ESLShareBaseAction.register
export class ESLShareNativeAction extends ESLShareBaseAction {
  public static override readonly is: string = 'native';

  public override get isAvailable(): boolean {
    return navigator.share !== undefined;
  }

  public share($button: ESLShareButton): void {
    if (!this.isAvailable) return;

    const shareData = this.getShareData($button);
    navigator.share(shareData);
  }
}
