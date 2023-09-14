import {memoize, listen, attr, prop} from '@exadel/esl/src/modules/esl-utils/decorators';
import {ESLMixinElement} from '@exadel/esl/src/modules/esl-mixin-element/core';
import {ESLTraversingQuery} from '@exadel/esl/src/modules/esl-traversing-query/core/esl-traversing-query';
import {ESLDemoSidebar} from '../navigation/navigation';
import {ESLDemoRouteLink} from './route-link';

import type {ESLPanel} from '@exadel/esl/src/modules/esl-panel/core/esl-panel';

export class ESLDemoRouteInterceptor extends ESLMixinElement {
  static override is = 'esl-d-route-interceptor';

  @attr() mask: string;

  @prop() activeCls = 'active';

  @memoize()
  protected get sidebar(): ESLDemoSidebar {
    return document.body.querySelector(ESLDemoSidebar.is)!;
  }

  @listen({target: window, event: 'esl:pushstate'})
  protected _onPushState({detail}: CustomEvent): void {
    const {oldURL, newURL} = detail;
    if (oldURL.pathname?.includes(this.mask)) this.removeNavActive();
    if (newURL.pathname?.includes(this.mask)) this.setNavActive();
  }

  protected setNavActive(): void {
    ESLTraversingQuery.first('::child(.sidebar-nav-item-heading)', this.$host)?.classList.add(this.activeCls);
    const $panel = (ESLTraversingQuery.first('::child(.sidebar-nav-secondary)', this.$host) as ESLPanel);
    $panel?.show();
    $panel?.setAttribute('data-open', '');

    const $routeLink = ESLTraversingQuery.first(`::find([href="${location.pathname}"])`, this.$host);
    if (!$routeLink) return;
    ESLTraversingQuery.first(ESLDemoRouteLink.get($routeLink as HTMLElement)?.activeSelector || '', $routeLink)?.classList.add(this.activeCls);
  }

  protected removeNavActive(): void {
    ESLTraversingQuery.first('::child(.sidebar-nav-item-heading)', this.$host)?.classList.remove(this.activeCls);
    const $panel = (ESLTraversingQuery.first('::child(.sidebar-nav-secondary)', this.$host) as ESLPanel);
    $panel?.hide();
    $panel?.removeAttribute('data-open');

    ESLTraversingQuery.first(`::find(.sidebar-nav-secondary-item.${this.activeCls})`, this.$host)?.classList.remove(this.activeCls);
  }
}
