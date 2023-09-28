import {listen, attr, prop} from '@exadel/esl/src/modules/esl-utils/decorators';
import {ESLMixinElement} from '@exadel/esl/src/modules/esl-mixin-element/core';

import {ESLDemoRouterService} from './router-service';

import type {ESLPanel} from '@exadel/esl/src/modules/esl-panel/core/esl-panel';

export class ESLDemoRouteInterceptor extends ESLMixinElement {
  static override is = 'esl-d-route-interceptor';

  @attr() public mask: string;

  @prop() public submenu: string = '.sidebar-nav-secondary';

  public get $panel(): ESLPanel | null {
    return this.$host.querySelector(this.submenu);
  }

  private updateNavActiveState(url: URL): boolean {
    return url.pathname?.includes(this.mask);
  }

  @listen({event: 'esl:pushstate', target: () => ESLDemoRouterService.instance()})
  protected _onPushState({detail}: CustomEvent): void {
    const {oldURL, newURL} = detail;
    this.updateNavActiveState(oldURL) && this.toggleNav(false);
    this.updateNavActiveState(newURL) && this.toggleNav(true);
  }

  protected toggleNav(state: boolean): void {
    this.$panel?.toggle(state);
  }
}
