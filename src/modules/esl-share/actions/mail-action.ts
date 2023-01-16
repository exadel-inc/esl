import {ESLShareUrlGenericAction} from './url-generic-action';

import type {ESLShareButton} from '../core/esl-share-button';

@ESLShareUrlGenericAction.register
export class ESLShareMailAction extends ESLShareUrlGenericAction {
  public static readonly is: string = 'mail';

  public share(shareData: ShareData, $button: ESLShareButton): void {
    const {link} = $button;
    if (!link) return;

    const a = document.createElement('a');
    a.href = this.buildURL(link, shareData);
    a.click();
  }
}
