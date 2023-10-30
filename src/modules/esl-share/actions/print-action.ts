import {ESLShareBaseAction} from '../core/esl-share-action';

/** Print action {@link ESLShareBaseAction} implementation */
@ESLShareBaseAction.register
export class ESLSharePrintAction extends ESLShareBaseAction {
  public static override readonly is: string = 'print';

  /** Does an action to share */
  public override share(): void {
    window.print();
  }
}
