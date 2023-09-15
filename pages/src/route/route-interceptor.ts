import {listen, attr, prop} from '@exadel/esl/src/modules/esl-utils/decorators';
import {ESLMixinElement} from '@exadel/esl/src/modules/esl-mixin-element/core';
import {toAbsoluteUrl} from '@exadel/esl/src/modules/all';
import {ESLDemoRouteLink} from './route-link';

import type {ESLPanel} from '@exadel/esl/src/modules/esl-panel/core/esl-panel';

export class ESLDemoRouteInterceptor extends ESLMixinElement {
  static override is = 'esl-d-route-interceptor';

  @attr() public mask: string;

  @prop() public activeCls: string = 'active';
  @prop() public routeLinkSelector: string = '[esl-d-route-link]';
  @prop() public submenu: string = '.sidebar-nav-secondary';

  public get $routeLinks(): Element[] {
    return Array.from(this.$host.querySelectorAll(this.routeLinkSelector));
  }

  public get $panel(): ESLPanel | null {
    return this.$host.querySelector(this.submenu);
  }

  @listen({target: window, event: 'esl:pushstate'})
  protected _onPushState({detail}: CustomEvent): void {
    const {oldURL, newURL} = detail;
    if (oldURL.pathname?.includes(this.mask)) this.removeNavActive();
    if (newURL.pathname?.includes(this.mask)) this.setNavActive();
  }

  protected setNavActive(): void {
    const {$panel} = this;
    $panel?.show();
    $panel?.setAttribute('data-open', '');

    this.$routeLinks
      .filter((el) => location.pathname.includes(new URL(toAbsoluteUrl(el.getAttribute('href')!)).pathname))
      .forEach((el) => ESLDemoRouteLink.get(el as HTMLElement)?.activate());
  }

  protected removeNavActive(): void {
    const {$panel} = this;
    $panel?.hide();
    $panel?.removeAttribute('data-open');

    this.$routeLinks
      .forEach((el) => ESLDemoRouteLink.get(el as HTMLElement)?.deactivate());
  }
}
