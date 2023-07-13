import {ESLToggleable} from '../../../src/modules/esl-toggleable/core/esl-toggleable';
import {attr, prop} from '../../../src/modules/esl-utils/decorators';

import type {ESLToggleableActionParams} from '../../../src/modules/esl-toggleable/core/esl-toggleable';

export class ESLDemoBanner extends ESLToggleable {
  public static override is = 'esl-d-banner';

  @attr({parser: (str) => str && encodeURIComponent(str).trim()})
  public cookieName: string;
  @attr({defaultValue: 7, parser: parseInt})
  public cookieTime: number;

  @prop({initiator: 'initial', showDelay: 5000})
  public override initialParams: ESLToggleableActionParams;

  @prop(true) public override closeOnEsc: boolean;

  /** Check if the coolie {@link cookieName} is active */
  public get hasCookie(): boolean {
    const {cookieName} = this;
    return !!cookieName && document.cookie.indexOf(`${cookieName}=true`) !== -1;
  }

  /** Store cookie {@link cookieName} for {@link cookieTime} period */
  public registerCookie(expireDays: number = this.cookieTime): void {
    const {cookieName} = this;
    if (cookieName) {
      const expires = new Date(Date.now() + expireDays * 864e5).toUTCString();
      document.cookie = `${cookieName}=true; expires=${expires};`;
    }
  }

  protected override setInitialState(): void {
    this.toggle(!this.hasCookie, this.initialParams);
  }

  protected override onShow(params: ESLToggleableActionParams): void {
    super.onShow(params);
    if (params.initiator !== 'initial') this.registerCookie(-1);
  }
  protected override onHide(params: ESLToggleableActionParams): void {
    super.onHide(params);
    if (params.initiator !== 'initial') this.registerCookie();
  }
}
