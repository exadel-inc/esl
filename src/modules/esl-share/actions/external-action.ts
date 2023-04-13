import {ESLShareUrlGenericAction} from './url-generic-action';

import type {ESLShareButton} from '../core/esl-share-button';

/** Action class for share buttons {@link ESLShareButton} via an external link */
@ESLShareUrlGenericAction.register
export class ESLShareExternalAction extends ESLShareUrlGenericAction {
  public static override readonly is: string = 'external';

  /** Does an action to share */
  public share($button: ESLShareButton): void {
    const {link} = $button;
    if (!link) return;

    const shareData = this.getShareData($button);
    const a = document.createElement('a');
    a.href = this.buildURL(link, shareData);
    a.click();
  }
}
