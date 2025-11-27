import {attr, boolAttr} from '../../esl-utils/decorators';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLLineClamp} from './esl-line-clamp';

/**
 * ESLLineClampAlt mixin element
 * @author Feoktyst Shovchko
 *
 * ESLLineClampAlt is a mixin element designed to work complementary to {@link ESLLineClamp}
 * Its purpose is to provide alternative line clamp values that can be toggled,
 * allowing to switch between the regular clamp configuration and an alternative one.
 */
export class ESLLineClampAlt extends ESLMixinElement {
  public static override observedAttributes = ['esl-line-clamp'];

  static override is = 'esl-line-clamp-alt';

  public static readonly activeAttr = 'alt-active';

  public static readonly CLAMP_EVENT = 'esl:clamp:toggled';

  @attr({name: ESLLineClampAlt.is, defaultValue: ''}) public lines: string;

  @attr({name: ESLLineClamp.is, readonly: true}) public laaals: string;

  @boolAttr({name: ESLLineClampAlt.activeAttr, readonly: true}) public altActive: boolean;

  public defaultLinesQuery(): string | null {
    return this.$$attr(ESLLineClamp.is);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.altActive && this.updateState();
  }

  public toggle(): void {
    this.$$fire(ESLLineClampAlt.CLAMP_EVENT, {bubbles: false});
    this.$$attr(ESLLineClampAlt.activeAttr, !this.altActive);
    this.updateState();
  }

  protected updateState(): void {
    const defaultQuery = this.defaultLinesQuery();
    if (typeof defaultQuery !== 'string') return;
    this.$$attr(ESLLineClamp.is, this.lines);
    this.$$attr(ESLLineClampAlt.is, defaultQuery);
  }
}
