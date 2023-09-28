import {listen, prop, attr, boolAttr, memoize} from '@exadel/esl/src/modules/esl-utils/decorators';
import {toAbsoluteUrl} from '@exadel/esl/src/modules/esl-utils/misc/url';
import {ESLMixinElement} from '@exadel/esl/src/modules/esl-mixin-element/core';
import {ESLTraversingQuery} from '@exadel/esl/src/modules/esl-traversing-query/core/esl-traversing-query';

import {ESLDemoRouterService} from './router-service';

export class ESLDemoRouteLink extends ESLMixinElement {
  static override is = 'esl-d-route-link';

  @attr() public href: string;

  @boolAttr() public relatedLink: boolean;

  @prop() public activeSelector: string = '::parent';
  @prop() public activeCls: string = 'active';

  @memoize()
  public get $activeEl(): Element | null {
    return ESLTraversingQuery.first(this.activeSelector, this.$host);
  }

  @listen({event: 'esl:pushstate', target: () => ESLDemoRouterService.instance()})
  protected _onPushState(): void {
    const linkURL = new URL(toAbsoluteUrl(this.href || ''));

    const match = this.relatedLink ?
      location.pathname === linkURL.pathname :
      location.pathname.includes(linkURL.pathname);

    this.toggle(match);
  }

  @listen('click')
  protected async _onClick(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.href || toAbsoluteUrl(this.href) === location.href) return;
    ESLDemoRouterService.instance().routeContent(this.href);
  }

  public toggle(state?: boolean): void {
    this.$activeEl?.classList.toggle(this.activeCls, state);
  }
}
