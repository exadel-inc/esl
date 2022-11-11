import {ESLShareBaseAction} from '../core/esl-share-action';

export class ESLSharePrintAction extends ESLShareBaseAction {
  static readonly is: string = 'print';

  public do(): void {
    window.print();
  }
}
