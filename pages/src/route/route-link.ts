import {listen, prop, attr} from '@exadel/esl/src/modules/esl-utils/decorators';
import {ESLMixinElement} from '@exadel/esl/src/modules/esl-mixin-element/core';
import {ESLDemoRouterService} from './router-service';

export class ESLDemoRouteLink extends ESLMixinElement {
  static override is = 'esl-d-route-link';

  @prop() public activeSelector = '::parent';

  @attr() href: string;

  public static override register(): void {
    ESLDemoRouterService.init();
    super.register();
  }

  @listen('click')
  protected async _onClick(e: Event): Promise<void> {
    e.preventDefault();
    if (!this.href || this.href === location.pathname) return;
    ESLDemoRouterService.routeContent(this.href);
  }
}
