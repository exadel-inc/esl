import {ESLMixinElement} from '../../../src/modules/esl-mixin-element/ui/esl-mixin-element';
import {listen} from '../../../src/modules/esl-utils/decorators/listen';
import {afterNextRender} from '../../../src/modules/esl-utils/async/raf';
import {memoize} from '../../../src/modules/esl-utils/decorators/memoize';
import {EventUtils} from '../../../src/modules/esl-utils/dom/events/utils';
import {scrollIntoView} from '../../../src/modules/esl-utils/dom/scroll';

/**
 * Demo sample of anchor mixin
 */
export class ESLDemoAnchorLink extends ESLMixinElement {
  static is = 'esl-d-anchor';

  @memoize()
  public get anchorHref(): string | null {
    if (this.$host instanceof HTMLAnchorElement) {
      const url = new URL(this.$host.href);
      return url.hash ? url.hash.substring(1) : null;
    }
    return null;
  }
  @memoize()
  public get anchorTarget(): Element | null {
    return this.anchorHref ? document.getElementById(this.anchorHref) : null;
  }

  public moveToTarget(): void {
    const $target = this.anchorTarget;
    if (!$target) return console.warn('No anchor target found');

    EventUtils.dispatch($target, 'esl:show:request');
    afterNextRender(() => {
      scrollIntoView($target, {behavior: 'smooth'});
    });
  }

  @listen('click')
  protected onClick(e: PointerEvent): void {
    e.preventDefault();
    if (this.anchorHref) {
      history.pushState(null, '', '#' + this.anchorHref);
    }
    this.moveToTarget();
  }
}
