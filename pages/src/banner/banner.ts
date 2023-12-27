import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';
import {attr, memoize, prop} from '@exadel/esl/modules/esl-utils/decorators';

import type {ESLToggleableActionParams} from '@exadel/esl/modules/esl-toggleable/core/esl-toggleable';

export class ESLDemoBanner extends ESLToggleable {
  public static override is = 'esl-d-banner';

  @attr({parser: (str) => str && encodeURIComponent(str).trim()})
  public cookieName: string;
  @attr({defaultValue: 14, parser: parseInt})
  public cookieTime: number;

  @prop({initiator: 'initial', showDelay: 8000})
  public override initialParams: ESLToggleableActionParams;

  @prop(true) public override closeOnEsc: boolean;

  protected _$focusBefore: HTMLElement | null = null;

  /** Check if the coolie {@link cookieName} is active */
  public get hasCookie(): boolean {
    const {cookieName} = this;
    return !!cookieName && document.cookie.indexOf(`${cookieName}=true`) !== -1;
  }

  @memoize()
  public get $focusable(): HTMLElement | undefined {
    return this.querySelector('.banner') as HTMLElement | undefined;
  }

  /** Store cookie {@link cookieName} for {@link cookieTime} period */
  public registerCookie(expireDays: number = this.cookieTime): void {
    const {cookieName} = this;
    if (cookieName) {
      const expires = new Date(Date.now() + expireDays * 864e5).toUTCString();
      document.cookie = `${cookieName}=true; path=/; expires=${expires};`;
    }
  }

  protected override setInitialState(): void {
    this.toggle(!this.hasCookie, this.initialParams);
  }

  protected override onShow(params: ESLToggleableActionParams): void {
    super.onShow(params);
    this._$focusBefore = document.activeElement as HTMLElement;
    this.$focusable && this.$focusable.focus();
    if (params.initiator !== 'initial') this.registerCookie(-1);
  }
  protected override onHide(params: ESLToggleableActionParams): void {
    super.onHide(params);
    this._$focusBefore && this._$focusBefore.focus();
    if (params.initiator !== 'initial') this.registerCookie();
  }
}
