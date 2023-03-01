import {ESLShareBaseAction} from '../core/esl-share-action';
import {ESLEventUtils} from '../../esl-utils/dom/events';

import type {ESLShareButton} from '../core/esl-share-button';
import type {AlertActionParams} from '../../esl-alert/core';

@ESLShareBaseAction.register
export class ESLShareCopyAction extends ESLShareBaseAction {
  public static override readonly is: string = 'copy';

  public override get isAvailable(): boolean {
    return navigator.clipboard !== undefined;
  }

  protected get alertText(): string {
    return 'Copied to clipboard';
  }

  protected get alertParams(): AlertActionParams {
    return {
      cls: 'esl-share-alert',
      html: `<span aria-label="${this.alertText}">${this.alertText}</span>`
    };
  }

  public share(shareData: ShareData, $button: ESLShareButton): void {
    const {url} = shareData;
    if (!this.isAvailable || !url) return;

    navigator.clipboard.writeText(url);
    this.showCopyAlert();
  }

  protected showCopyAlert(): void {
    const detail = this.alertParams;
    ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
  }
}
