import {listen, prop, attr} from '@exadel/esl/src/modules/esl-utils/decorators';
import {toAbsoluteUrl} from '@exadel/esl/src/modules/esl-utils/misc/url';
import {ESLMixinElement} from '@exadel/esl/src/modules/esl-mixin-element/core';
import {ESLTraversingQuery} from '@exadel/esl/src/modules/esl-traversing-query/core/esl-traversing-query';

import {ESLDemoRouterService} from './router-service';

export class ESLDemoRouteLink extends ESLMixinElement {
  static override is = 'esl-d-route-link';

  @attr() public href: string;

  @prop() public activeSelector: string = '::parent';
  @prop() public activeCls: string = 'active';

  public static override register(): void {
    ESLDemoRouterService.init();
    super.register();
  }

  @listen('click')
  protected async _onClick(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.href || toAbsoluteUrl(this.href) === location.href) return;
    ESLDemoRouterService.routeContent(this.href);
  }

  public activate(): void {
    ESLTraversingQuery.first(this.activeSelector, this.$host)?.classList.add(this.activeCls);
  }

  public deactivate(): void {
    ESLTraversingQuery.first(this.activeSelector, this.$host)?.classList.remove(this.activeCls);
  }
}
