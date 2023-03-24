import {ESLShareUrlGenericAction} from './url-generic-action';

import type {ESLShareButton} from '../core/esl-share-button';

/** Action class for share buttons {@link ESLShareButton} via a link to share on a social media */
@ESLShareUrlGenericAction.register
export class ESLShareMediaAction extends ESLShareUrlGenericAction {
  public static override readonly is: string = 'media';

  /** window features */
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
    const {link} = $button;
    if (!link) return;

    const shareData = this.getShareData($button);
    window.open(this.buildURL(link, shareData), '_blank', this.windowFeatures);
  }
}
