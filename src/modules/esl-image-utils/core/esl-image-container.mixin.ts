import {ESLMixinElement} from '../../esl-mixin-element/core';
import {jsonAttr, listen, memoize} from '../../esl-utils/decorators';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {findAll} from '../../esl-utils/dom/traversing';

/**
 * ESLImageContainerConfig - interface for ESLImageContainerMixin config
 */
export interface ESLImageContainerConfig {
  /** Class to add to the target element when the image is loaded (successfully) */
  readyCls: string;
  /** Class to add to the target element when the image is not loaded (error) */
  errorCls: string;
  /** Image element selector */
  selector: string;
}

/**
 * ESLImageContainerMixin - mixin to provide image loading state class functionality
 * @author Anna Barmina, Alexey Stsefanovich (ala'n)
 *
 * Use example:
 * ```
 * <picture class="img-container img-container-16-9" esl-image-container>
 *   <img loading="lazy" alt="img" src="img.png"/>
 * </picture>
 * ```
 *
 * This mixin is used to enhance native image developer experience by adding specific classes when the image has completely loaded or not
 */
@ExportNs('ImageContainer')
export class ESLImageContainerMixin extends ESLMixinElement {
  public static override is = 'esl-image-container';

  /** Default configuration object */
  public static DEFAULT_CONFIG: ESLImageContainerConfig = {
    readyCls: 'img-container-loaded',
    errorCls: '',
    selector: 'img',
  };

  /** Configuration object */
  @jsonAttr({name: ESLImageContainerMixin.is}) public rawConfig: Partial<ESLImageContainerConfig>;

  /** Merged configuration object */
  @memoize()
  public get config(): ESLImageContainerConfig {
    return {...ESLImageContainerMixin.DEFAULT_CONFIG, ...this.rawConfig};
  }

  /** Image element */
  @memoize()
  protected get $images(): HTMLImageElement[] {
    if (this.$host.tagName === 'IMG') return [this.$host as HTMLImageElement];
    return findAll(this.$host, this.config.selector) as HTMLImageElement[];
  }

  /** Check if all images are loaded */
  public get complete(): boolean {
    return this.$images.every(img => img.complete);
  }
  /** Check if any image has loading error */
  public get hasError(): boolean {
    return this.$images.some(img => !img.naturalHeight && !img.naturalWidth);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this._onReady();
  }

  protected override attributeChangedCallback(name: string): void {
    if (name !== ESLImageContainerMixin.is) return;
    memoize.clear(this, ['config', '$images']);
    this._onReady();
  }

  @listen({
    event: 'load error',
    target: (that: ESLImageContainerMixin) => that.$images
  })
  protected _onReady(): void {
    if (!this.complete) return;
    this.$$off();
    this.$$cls(this.config.readyCls, true);
    this.$$cls(this.config.errorCls, this.hasError);
  }
}
