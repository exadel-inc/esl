import {ESLMixinElement} from '@exadel/esl/modules/esl-mixin-element/ui/esl-mixin-element';
import {afterNextRender} from '@exadel/esl/modules/esl-utils/async/raf';
import {listen, memoize} from '@exadel/esl/modules/esl-utils/decorators';
import {ESLEventUtils} from '@exadel/esl/modules/esl-utils/dom/events';

/**
 * Demo sample of anchor mixin
 */
export class ESLDemoAnchorLink extends ESLMixinElement {
  static override is = 'esl-d-anchor';

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

    ESLEventUtils.dispatch($target, 'esl:show:request');
    afterNextRender(() => {
      // TODO: replace with scroll ext version
      // scrollIntoView($target, {behavior: 'smooth'})
      //   .then(() => console.log('Scroll to successful: ', $target));
      $target.scrollIntoView({behavior: 'smooth'});
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
