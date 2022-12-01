import {ESLShareBaseAction} from '../core/esl-share-action';
import {format} from '../../esl-utils/misc/format';

export abstract class ESLShareUrlGenericAction extends ESLShareBaseAction {

  protected get formatSource(): Record<string, string> {
    const {shareData} = this.$button;
    return {
      u: encodeURIComponent(shareData.url),
      t: encodeURIComponent(shareData.title)
    };
  }

  protected buildURL(link: string): string {
    return format(link, this.formatSource);
  }
}
