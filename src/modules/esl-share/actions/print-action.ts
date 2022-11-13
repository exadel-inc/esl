import {ESLShareBaseAction} from '../core/esl-share-action';

export class ESLSharePrintAction extends ESLShareBaseAction {
  public static readonly is: string = 'print';

  public do(): void {
    window.print();
  }
}
