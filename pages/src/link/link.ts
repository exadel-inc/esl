import {memoize, listen, prop} from '../../../src/modules/esl-utils/decorators';
import {ESLMixinElement} from '../../../src/modules/esl-mixin-element/core';
import {ESLDemoSidebar} from '../navigation/navigation';

export class ESLDemoReplaceLink extends ESLMixinElement {
  static override is = 'esl-d-replace-link';

  @prop() public contentSelector = '#content-replaceable';

  @memoize()
  protected get sidebar(): ESLDemoSidebar {
    return document.body.querySelector(ESLDemoSidebar.is)!;
  }

  @listen('click')
  protected _onClick(e: Event): void {
    e.preventDefault();
    const pathname = this.$host.getAttribute('href');
    if (!pathname) return;
    this.$host.setAttribute(this.sidebar.activeCls, '');
    fetch(pathname, {method: 'GET'})
      .then((response) => response.text())
      .then((text) => {
        const $content = new DOMParser().parseFromString(text, 'text/html').querySelector(this.contentSelector);
        const $currentContent = document.body.querySelector(this.contentSelector);

        if (!$content || !$currentContent) {
          history.pushState(null, '', pathname);
          location.reload();
          return;
        }

        $currentContent.replaceWith($content);
        history.pushState(null, '', pathname);
        this.sidebar.setActive(this.$host);
      })
      .catch(() => console.error(`[ESL] Failed to fetch resource: ${pathname}`));
  }
}
