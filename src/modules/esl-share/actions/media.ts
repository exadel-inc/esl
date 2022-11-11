import {ESLShareBaseAction} from '../core/esl-share-action';
import {format} from '../../esl-utils/misc/format';

export class ESLShareMediaAction extends ESLShareBaseAction {
  public static readonly is: string = 'media';

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

  protected get formatSource(): Record<string, string> {
    return {
      u: encodeURIComponent(window.location.href),
      t: encodeURIComponent(document.title)
    };
  }

  protected get windowFeatures(): string {
    return Object.entries((this.constructor as typeof ESLShareMediaAction).FEATURES).map((key, value) => `${key}=${value}`).join(',');
  }

  public do(): void {
    const {link} = this.$button;
    if (link) {
      const URL = format(link, this.formatSource);
      window.open(URL, '_blank', this.windowFeatures);
    }
  }
}
