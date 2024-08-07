import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {attr, listen} from '../../esl-utils/decorators';
import {CSSClassUtils} from '../../esl-utils/dom';
import {ExportNs} from '../../esl-utils/environment/export-ns';

/**
 * ESLImgContainerMixin - mixin to provide image container functionality
 * @author Anna Barmina, Alexey Stsefanovich (ala'n)
 *
 * Use example:
 * ```
 * <picture class="img-container img-container-16-9">
 *   <img esl-img-container loading="lazy" alt="img" src="img.png"/>
 * </picture>
 * ```
 *
 * This mixin is used to enhance an image element by adding specific classes to a target when the image has completely loaded or not
 */

@ExportNs('ImgContainer')
export class ESLImgContainerMixin extends ESLMixinElement {
  static override is = 'esl-img-container';

  /** Target element selector ('::parent' by default) */
  @attr({name: ESLImgContainerMixin.is}) public target: string;
  /** Class to add to the target element when the image is loaded */
  @attr({name: ESLImgContainerMixin.is + '-cls', defaultValue: 'img-container-loaded'}) public targetCls: string;
  /** Class to add to the target element when the image is not loaded */
  @attr({name: ESLImgContainerMixin.is + '-error-cls'}) public targetErrorCls: string;

  public override $host!: HTMLImageElement;

  get $target(): Element | null {
    return ESLTraversingQuery.first(this.target || '::parent', this.$host);
  }

  protected override connectedCallback(): void {
    if (this.$host.tagName !== 'IMG') return;
    super.connectedCallback();
    if (this.$host.complete) {
      const eventType = this.$host.naturalHeight && this.$host.naturalWidth ? 'load' : 'error';
      this._onReady(new Event(eventType));
    }
    else this.$$on(this._onReady);
  }

  @listen({
    event: 'load error',
    auto: false,
    once: true
  })
  protected _onReady(event: Event): void {
    const {$target} = this;
    if (!$target) return;
    CSSClassUtils.add($target, this.targetCls);
    if (event.type === 'error') CSSClassUtils.add($target, this.targetErrorCls);
  }
}
