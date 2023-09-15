import {ESLShareUrlGenericAction} from './url-generic-action';

import type {ESLShareButton} from '../core/esl-share-button';

/** Action class for share buttons {@link ESLShareButton} via a link to share on a social media */
@ESLShareUrlGenericAction.register
export class ESLShareMediaAction extends ESLShareUrlGenericAction {
  public static override readonly is: string = 'media';

  /**
   * Window features that apply to `window.open()`.
   * These features include options such as the window's default size and position,
   * whether or not to open a minimal popup window, and so forth.
   * */
  public static FEATURES: Record<string, number> = {
    scrollbars: 0,
    resizable: 1,
    menubar: 0,
    left: 100,
    top: 100,
    width: 750,
    height: 500,
    toolbar: 0,
    status: 0
  };

  protected get windowFeatures(): string {
    const features = (this.constructor as typeof ESLShareMediaAction).FEATURES;
    return Object.entries(features).map(([key, value]) => `${key}=${value}`).join(',');
  }

  /** Does an action to share */
  public share($button: ESLShareButton): void {
    const {shareLink} = $button;
    if (!shareLink) return;

    const shareData = this.getShareData($button);
    window.open(this.buildURL(shareLink, shareData), '_blank', this.windowFeatures);
  }
}
