import {ESLShareBaseAction} from '../core/esl-share-action';
import {ESLEventUtils} from '../../esl-utils/dom/events';

import type {ESLShareButton} from '../core/esl-share-button';

@ESLShareBaseAction.register
export class ESLShareCopyAction extends ESLShareBaseAction {
  public static override readonly is: string = 'copy';

  public override get isAvailable(): boolean {
    return navigator.clipboard !== undefined;
  }

  public share($button: ESLShareButton): void {
    const shareData = this.getShareData($button);
    const {url} = shareData;
    if (!this.isAvailable || !url) return;

    navigator.clipboard.writeText(url);
    this.showCopyAlert($button.additional?.alertText);
  }

  protected showCopyAlert(alertText: string): void {
    if (!alertText) return;
    const detail = {
      cls: 'esl-share-alert',
      html: `<span>${alertText}</span>`
    };
    ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
  }
}
