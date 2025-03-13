import {ESLShareUrlGenericAction} from './url-generic-action';

import type {ESLShareButton} from '../core/esl-share-button';

/** Sharing using default browser link behavior {@link ESLShareBaseAction} implementation */
@ESLShareUrlGenericAction.register
export class ESLShareExternalAction extends ESLShareUrlGenericAction {
  public static override readonly is: string = 'external';

  /** Does an action to share */
  public override share($button: ESLShareButton): void {
    const {shareLink} = $button;
    if (!shareLink) return;

    const shareData = this.getShareData($button);
    const a = document.createElement('a');
    a.href = this.buildURL(shareLink, shareData);
    a.click();
  }
}
