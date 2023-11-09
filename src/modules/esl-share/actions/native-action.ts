import {ESLShareBaseAction} from '../core/esl-share-action';

import type {ESLShareButton} from '../core/esl-share-button';

/**
 * {@link ESLShareBaseAction} implementation, that invokes the native sharing mechanism of Web Share API
 */
@ESLShareBaseAction.register
export class ESLShareNativeAction extends ESLShareBaseAction {
  public static override readonly is: string = 'native';

  /** Checks if this action is available on the user's device */
  public override get isAvailable(): boolean {
    return navigator.share !== undefined;
  }

  /** Does an action to share */
  public override share($button: ESLShareButton): void {
    if (!this.isAvailable) return;

    const shareData = this.getShareData($button);
    navigator.share(shareData);
  }
}
