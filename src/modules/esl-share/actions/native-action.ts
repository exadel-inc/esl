import {memoize} from '../../esl-utils/decorators';
import {ESLShareBaseAction} from '../core/esl-share-action';

@ESLShareBaseAction.register
export class ESLShareNativeAction extends ESLShareBaseAction {
  public static readonly is: string = 'native';

  @memoize()
  public static get isAvailable(): boolean {
    return navigator.share !== undefined;
  }

  public do(): void {
    if (!(this.constructor as typeof ESLShareBaseAction).isAvailable) return;

    const {shareData} = this.$button;
    navigator.share(shareData);
  }
}
