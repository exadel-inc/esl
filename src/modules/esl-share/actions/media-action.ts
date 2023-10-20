import {ESLShareUrlGenericAction} from './url-generic-action';

import type {ESLShareButton} from '../core/esl-share-button';

/**
 * Share using nested window with social media url {@link ESLShareBaseAction} implementation.
 * Applicable to the most of social media (e.g. Twitter, Facebook, LinkedIn, etc.)
 */
@ESLShareUrlGenericAction.register
export class ESLShareMediaAction extends ESLShareUrlGenericAction {
  public static override readonly is: string = 'media';

  /**
   * Window features that are applicable to window.open()
   * include options such as the default size and position of the window,
   * whether to open a minimal popup window, and more.
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
  public override share($button: ESLShareButton): void {
    const {shareLink} = $button;
    if (!shareLink) return;

    const shareData = this.getShareData($button);
    window.open(this.buildURL(shareLink, shareData), '_blank', this.windowFeatures);
  }
}
