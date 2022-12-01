import {ESLShareUrlGenericAction} from './url-generic-action';

@ESLShareUrlGenericAction.register
export class ESLShareMediaAction extends ESLShareUrlGenericAction {
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

  protected get windowFeatures(): string {
    return Object.entries((this.constructor as typeof ESLShareMediaAction).FEATURES).map((key, value) => `${key}=${value}`).join(',');
  }

  public do(): void {
    const {link} = this.$button;
    if (!link) return;

    window.open(this.buildURL(link), '_blank', this.windowFeatures);
  }
}
