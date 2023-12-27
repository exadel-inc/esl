import {ESLShareBaseAction} from '../core/esl-share-action';
import {format} from '../../esl-utils/misc/format';

/**
 * Base {@link ESLShareBaseAction} implementation for actions, that use URL-based sharing mechanism
 */
export abstract class ESLShareUrlGenericAction extends ESLShareBaseAction {

  protected getFormatSource(shareData: ShareData): Record<string, string> {
    const title = encodeURIComponent(shareData.title || '');
    const url = encodeURIComponent(shareData.url || '');
    return {
      u: url,
      t: title,
      url,
      title
    };
  }

  /** Builds URL to share on a social network */
  protected buildURL(link: string, shareData: ShareData): string {
    return format(link, this.getFormatSource(shareData));
  }
}
