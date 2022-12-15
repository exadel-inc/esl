import {ESLShareBaseAction} from '../core/esl-share-action';
import {format} from '../../esl-utils/misc/format';

export abstract class ESLShareUrlGenericAction extends ESLShareBaseAction {

  protected get formatSource(): Record<string, string> {
    const {shareData} = this.$button;
    const title = encodeURIComponent(shareData.title || '');
    const url = encodeURIComponent(shareData.url || '');
    return {
      u: url,
      t: title,
      url,
      title
    };
  }

  protected buildURL(link: string): string {
    return format(link, this.formatSource);
  }
}
