import {ESLShareBaseAction} from '../core/esl-share-action';
import {ESLEventUtils} from '../../esl-utils/dom/events';

import type {ESLShareButton} from '../core/esl-share-button';

/** Copy to clipboard action class for share buttons {@link ESLShareButton} */
@ESLShareBaseAction.register
export class ESLShareCopyAction extends ESLShareBaseAction {
  public static override readonly is: string = 'copy';

  /** Checks if this action is available on the user's device */
  public override get isAvailable(): boolean {
    return navigator.clipboard !== undefined;
  }

  /** Does an action to share */
  public share($button: ESLShareButton): void {
    const shareData = this.getShareData($button);
    const {url} = shareData;
    if (!this.isAvailable || !url) return;

    navigator.clipboard.writeText(url);
    this.showCopyAlert($button.additional?.alertText);
  }

  /** Shows alert about the successful action completion */
  protected showCopyAlert(alertText: string): void {
    if (!alertText) return;
    const detail = {
      cls: 'esl-share-alert',
      html: `<span>${alertText}</span>`
    };
    ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
  }
}
