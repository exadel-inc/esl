import {memoize} from '@exadel/esl/src/modules/esl-utils/decorators';
import {ESLEventUtils} from '@exadel/esl/src/modules/esl-event-listener/core';
import {SyntheticEventTarget} from '@exadel/esl/src/modules/esl-utils/dom';

export class ESLDemoRouterService extends SyntheticEventTarget {
  public contentSelector: string = '#content-routable';

  public previousUrl: URL;

  @memoize()
  public static instance(): ESLDemoRouterService {
    return new ESLDemoRouterService();
  }

  public constructor() {
    super();
    this.previousUrl = this.copyLocation();
    ESLEventUtils.subscribe(this, {target: window, event: 'popstate'}, () => this.routeContent(location.href, false));
  }

  protected copyLocation(): URL {
    return new URL(location.href);
  }

  public async routeContent(url: string, pushState = true): Promise<void> {
    try {
      const response = await fetch(url);
      const text = await response.text();

      pushState && history.pushState(null, '', url);
      this.replaceContent(document.body.querySelector(this.contentSelector), this.retrieveTextContent(text));
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

    const newURL = this.copyLocation();
    this.dispatchEvent(new CustomEvent('esl:pushstate', {detail: {oldURL: this.previousUrl, newURL}}));
    this.previousUrl = newURL;

    $currentContent.replaceWith($content);
  }
}
