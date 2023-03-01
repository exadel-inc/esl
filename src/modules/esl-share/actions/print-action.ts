import {ESLShareBaseAction} from '../core/esl-share-action';

import type {ESLShareButton} from '../core/esl-share-button';

@ESLShareBaseAction.register
export class ESLSharePrintAction extends ESLShareBaseAction {
  public static override readonly is: string = 'print';

  public share(shareData: ShareData, $button: ESLShareButton): void {
    window.print();
  }
}
