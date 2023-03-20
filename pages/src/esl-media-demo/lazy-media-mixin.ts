import {ESLMixinElement} from '../../../src/modules/esl-mixin-element/core';
import {setAttr} from '../../../src/modules/esl-utils/dom/attr';
import {memoize} from '../../../src/modules/esl-utils/decorators/memoize';

export class ESLDemoLazyMedia extends ESLMixinElement {
  static override is = 'esl-d-media-lazy';

  @memoize()
  static get io$$(): IntersectionObserver {
    return new IntersectionObserver(function (entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.01) {
          setAttr(entry.target, 'disabled', false);
          setAttr(entry.target, ESLDemoLazyMedia.is, false);
        }
      }
    }, {threshold: [0.05]});
  }

  public override connectedCallback(): void {
    ESLDemoLazyMedia.io$$.observe(this.$host);
  }

  public override disconnectedCallback(): void {
    ESLDemoLazyMedia.io$$.unobserve(this.$host);
  }
}
