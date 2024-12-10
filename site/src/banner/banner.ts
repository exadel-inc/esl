import {attr, prop, listen} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLIntersectionTarget} from '@exadel/esl/modules/esl-event-listener/core';
import {ESLToggleable} from '@exadel/esl/modules/esl-toggleable/core';
import type {ESLIntersectionEvent} from '@exadel/esl/modules/esl-event-listener/core';
import type {ESLToggleableActionParams} from '@exadel/esl/modules/esl-toggleable/core';

export class ESLDemoBanner extends ESLToggleable {
  public static override is = 'esl-d-banner';

  @attr({parser: (str) => str && encodeURIComponent(str).trim()})
  public cookieName: string;
  @attr({defaultValue: 14, parser: parseInt})
  public cookieTime: number;


  @prop(true) public override closeOnEsc: boolean;
  @prop('.close-button') public override closeTrigger: string;

  public get $alert(): HTMLElement | null {
    return this.querySelector('.alert')!;
  }

  /** Check if the coolie is active */
  public get hasCookie(): boolean {
    const {cookieName} = this;
    return !!cookieName && document.cookie.indexOf(`${cookieName}=true`) !== -1;
  }

  /** Store cookie {@link cookieName} for {@link cookieTime} period */
  public registerCookie(expireDays: number = this.cookieTime): void {
    const {cookieName} = this;
    if (!cookieName) return;
    const expires = new Date(Date.now() + expireDays * 864e5).toUTCString();
    document.cookie = `${cookieName}=true; path=/; expires=${expires};`;
  }

  protected override onShow(params: ESLToggleableActionParams): void {
    super.onShow(params);
    this.$alert?.classList.add('in');
    this.$$off(this._onIntersect);
  }

  protected override onHide(param: ESLToggleableActionParams): void {
    super.onHide(param);
    if (param.initiator === 'close') this.registerCookie();
  }

  @listen({
    event: 'intersects',
    target: ($this: ESLDemoBanner) => ESLIntersectionTarget.for($this, {threshold: 0.99}),
    condition: ($this: ESLDemoBanner) => !$this.hasCookie
  })
  protected _onIntersect(e: ESLIntersectionEvent): void {
    this.toggle(e.isIntersecting, {showDelay: 750});
  }
}
