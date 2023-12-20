import {ESLShareBaseAction} from '../core/esl-share-action';

import type {ESLShareButton} from '../core/esl-share-button';

/** Print action {@link ESLShareBaseAction} implementation */
@ESLShareBaseAction.register
export class ESLSharePrintAction extends ESLShareBaseAction {
  public static override readonly is: string = 'print';

  /** Does an action to share */
  public override share($button: ESLShareButton): void {
    window.print();
  }
}
