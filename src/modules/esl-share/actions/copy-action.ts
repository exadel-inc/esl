import {ESLShareBaseAction} from '../core/esl-share-action';
import {ESLEventUtils} from '../../esl-utils/dom/events';

import type {ESLShareButton} from '../core/esl-share-button';

/** Copy to clipboard {@link ESLShareBaseAction} implementation */
@ESLShareBaseAction.register
export class ESLShareCopyAction extends ESLShareBaseAction {
  public static override readonly is: string = 'copy';

  /** Checks if this action is available on the user's device */
  public override get isAvailable(): boolean {
    return navigator.clipboard !== undefined;
  }

  /** Does an action to share */
  public override async share($button: ESLShareButton): Promise<void> {
    const shareData = this.getShareData($button);
    const {url} = shareData;
    if (!this.isAvailable || !url) return;

    await navigator.clipboard.writeText(url);
    this.showCopyAlert($button.shareAdditional?.copyAlertMsg);
  }

  /** Shows alert about the successful action completion */
  protected showCopyAlert(msg: string): void {
    if (!msg) return;
    const detail = {
      cls: 'esl-share-alert',
      html: `<span>${msg}</span>`
    };
    ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
  }
}
