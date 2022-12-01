import {ESLShareBaseAction} from '../core/esl-share-action';
import {ESLEventUtils} from '../../esl-utils/dom/events';

import type {AlertActionParams} from '../../esl-alert/core';

@ESLShareBaseAction.register
export class ESLShareCopyAction extends ESLShareBaseAction {
  public static readonly is: string = 'copy';

  protected get alertText(): string {
    return 'Copied to clipboard';
  }

  protected get alertParams(): AlertActionParams {
    return {
      cls: 'esl-share-alert',
      html: `<span aria-label="${this.alertText}">${this.alertText}</span>`
    };
  }

  public do(): void {
    if (navigator.clipboard !== undefined) {
      const {shareData} = this.$button;
      navigator.clipboard.writeText(shareData.url);
      this.showCopyAlert();
    }
  }

  protected showCopyAlert(): void {
    const detail = this.alertParams;
    ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
  }
}
