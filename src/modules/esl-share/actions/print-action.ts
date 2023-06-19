import {ESLShareBaseAction} from '../core/esl-share-action';

import type {ESLShareButton} from '../core/esl-share-button';

/** Print action class for share buttons {@link ESLShareButton} */
@ESLShareBaseAction.register
export class ESLSharePrintAction extends ESLShareBaseAction {
  public static override readonly is: string = 'print';

  /** Does an action to share */
  public share($button: ESLShareButton): void {
    window.print();
  }
}
