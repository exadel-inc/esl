import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {attr, listen, memoize} from '../../esl-utils/decorators';
import {CSSClassUtils} from '../../esl-utils/dom';
import {ExportNs} from '../../esl-utils/environment/export-ns';

/**
 * ESLImgStateClassMixin - mixin to provide image loading state class functionality
 * @author Anna Barmina, Alexey Stsefanovich (ala'n)
 *
 * Use example:
 * ```
 * <picture class="img-container img-container-16-9" esl-img-state-cls>
 *   <img loading="lazy" alt="img" src="img.png"/>
 * </picture>
 * ```
 *
 * This mixin is used to enhance native image developer experience by adding specific classes when the image has completely loaded or not
 */
@ExportNs('ImgContainer')
export class ESLImgStateClassMixin extends ESLMixinElement {
  public static override is = 'esl-img-state-cls';
  /** Class to add to the target element when the image is ready if no class provided */
  public static DEFAULT_READY_CLS = 'img-container-loaded';

  /** Class to add to the target element when the image is loaded (successfully) */
  @attr({name: ESLImgStateClassMixin.is}) public readyClass: string;
  /** Class to add to the target element when the image is not loaded */
  @attr({name: ESLImgStateClassMixin.is + '-error'}) public errorClass: string;
  /** Target element selector (current by default). Supports {@link ESLTraversingQuery} */
  @attr({name: ESLImgStateClassMixin.is + '-target'}) public target: string;

  /** Image element */
  @memoize()
  protected get $image(): HTMLImageElement | null {
    if (this.$host.tagName === 'IMG') return this.$host as HTMLImageElement;
    if (this.target) return ESLTraversingQuery.first(this.target, this.$host) as HTMLImageElement | null;
    return this.$host.querySelector('img');
  }

  /** Target element to add classes */
  @memoize()
  protected get $target(): Element | null {
    if (this.$host.tagName !== 'IMG') return this.$host;
    return ESLTraversingQuery.first(this.target, this.$host);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    if (!this.$image || this.$image.tagName !== 'IMG') {
      console.error('ESLImgStateClassMixin: Image element not found for ', this.$host);
      return;
    }
    if (this.$image.complete) {
      const isError = !this.$image.naturalHeight && !this.$image.naturalWidth;
      this._onReady(new Event(isError ? 'error' : 'load'));
    }
  }

  @listen({
    event: 'load error',
    target: (that: ESLImgStateClassMixin) => that.$image
  })
  protected _onReady(event: Event): void {
    this.$$off();
    if (!this.$target) return;
    CSSClassUtils.add(this.$target, this.readyClass || ESLImgStateClassMixin.DEFAULT_READY_CLS);
    if (event.type === 'error') CSSClassUtils.add(this.$target, this.errorClass);
  }
}
