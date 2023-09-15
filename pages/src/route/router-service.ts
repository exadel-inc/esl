import {memoize} from '@exadel/esl/src/modules/esl-utils/decorators';
import {ESLEventUtils} from '@exadel/esl/src/modules/esl-event-listener/core';

export class ESLDemoRouterService {
  public contentSelector: string = '#content-routable';

  public previousUrl: URL;

  @memoize()
  public static init(): ESLDemoRouterService {
    const router = new ESLDemoRouterService();
    router.previousUrl = new URL(location.href);
    ESLEventUtils.subscribe(router, {target: window, event: 'popstate'}, () => ESLDemoRouterService.routeContent(location.href, false));
    return router;
  }

  public static get instance(): ESLDemoRouterService {
    return this.init();
  }

  public static async routeContent(url: string, pushState = true): Promise<void> {
    const router = ESLDemoRouterService.instance;
    try {
      const response = await fetch(url);
      const text = await response.text();

      pushState && history.pushState(null, '', url);
      router.replaceContent(document.body.querySelector(router.contentSelector), router.retrieveTextContent(text));
    } catch (error) {
      throw new Error(`[ESL] Failed to fetch resource: ${url}`);
    }
  }

  protected retrieveTextContent(text: string): Element | null {
    return new DOMParser().parseFromString(text, 'text/html').querySelector(this.contentSelector);
  }

  protected replaceContent($currentContent: Element | null, $content: Element | null): void {
    if (!$content || !$currentContent) {
      location.reload();
      return;
    }

    window.dispatchEvent(new CustomEvent('esl:pushstate', {detail: {oldURL: this.previousUrl, newURL: new URL(location.href)}}));
    this.previousUrl = new URL(location.href);
    $currentContent.replaceWith($content);
  }
}
