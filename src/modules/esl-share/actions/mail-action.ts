import {ESLShareUrlGenericAction} from './url-generic-action';

@ESLShareUrlGenericAction.register
export class ESLShareMailAction extends ESLShareUrlGenericAction {
  public static readonly is: string = 'mail';

  public do(): void {
    const {link} = this.$button;
    if (!link) return;

    const a = document.createElement('a');
    a.href = this.buildURL(link);
    a.click();
  }
}
