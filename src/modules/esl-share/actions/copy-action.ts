import {ESLShareBaseAction} from '../core/esl-share-action';
import {ESLEventUtils} from '../../esl-utils/dom/events';

import type {AlertActionParams} from '../../esl-alert/core';

export class ESLShareCopyAction extends ESLShareBaseAction {
  public static readonly is: string = 'copy';

  protected get alertIcon(): string {
    const $icon = this.$button.querySelector('.esl-share-icon');
    return $icon ? $icon.innerHTML : '';
  }

  protected get alertText(): string {
    return 'Copied to clipboard';
  }

  protected get alertParams(): AlertActionParams {
    return {
      cls: 'esl-share-alert',
      html: `${this.alertIcon} <span aria-label="${this.alertText}">${this.alertText}</span>`
    };
  }

  public do(): void {
    if (navigator.clipboard !== undefined) {
      navigator.clipboard.writeText(window.location.href,);
      this.showCopyAlert();
    }
  }

  protected showCopyAlert(): void {
    const detail = this.alertParams;
    ESLEventUtils.dispatch(document.body, 'esl:alert:show', {detail});
  }
}
