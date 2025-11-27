import {attr, boolAttr, listen, memoize, safe} from '../../esl-utils/decorators';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLMixinElement} from '../../esl-mixin-element/core';

/**
 * ESLLineClampAlt mixin element
 * @author Feoktyst Shovchko
 *
 * ESLLineClampAlt is a mixin element designed to work complementary to {@link ESLLineClamp}
 * Its purpose is to provide alternative line clamp values that can be toggled,
 * allowing to switch between the regular clamp configuration and an alternative one.
 */
export class ESLLineClampAlt extends ESLMixinElement {
  static override is = 'esl-line-clamp-alt';

  public static readonly activeAttr = 'alt-active';

  public static readonly CLAMP_EVENT = 'esl:clamp:toggled';

  @attr({name: ESLLineClampAlt.is, defaultValue: ''}) public lines: string;

  @boolAttr({name: ESLLineClampAlt.activeAttr, readonly: true}) public altActive: boolean;

  @memoize()
  @safe(ESLMediaRuleList.empty<string>())
  public get linesQuery(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.lines);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.onQueryChange();
  }

  protected override attributeChangedCallback(): void {
    memoize.clear(this, 'linesQuery');
    this.onQueryChange();
  }

  protected updateLines(): void {
    this.$host.style.setProperty('--esl-line-clamp-alt', this.linesQuery.value || '0');
  }

  public toggle(): void {
    this.$$fire(ESLLineClampAlt.CLAMP_EVENT, {bubbles: false});
    this.$$attr(ESLLineClampAlt.activeAttr, !this.altActive);
  }

  @listen({event: 'change', target: ($this: any) => $this.linesQuery})
  protected onQueryChange(): void {
    this.updateLines();
  }
}
