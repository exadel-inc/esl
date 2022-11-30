import {ESLShareBaseAction} from '../core/esl-share-action';

@ESLShareBaseAction.register
export class ESLSharePrintAction extends ESLShareBaseAction {
  public static readonly is: string = 'print';

  public do(): void {
    window.print();
  }
}
