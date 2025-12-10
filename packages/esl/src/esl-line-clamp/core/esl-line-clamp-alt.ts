import {attr, listen, memoize, prop, safe} from '../../esl-utils/decorators';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLLineClamp} from './esl-line-clamp';

/**
 * ESLLineClampAlt mixin element
 * @author Feoktyst Shovchko
 *
 * ESLLineClampAlt is a custom attribute designed to work complementary to {@link ESLLineClamp}
 * Its purpose is to provide alternative line clamp values that can be toggled,
 * allowing to switch between the regular clamp configuration and an alternative one.
 */
export class ESLLineClampAlt extends ESLMixinElement {
  static override is = 'esl-line-clamp-alt';

  /** Media query to activate alternate clamping with number of lines */
  @attr({name: ESLLineClampAlt.is, defaultValue: ''}) public lines: string;
  /** CSS variable to set alternate line clamp value */
  @prop('--esl-line-clamp-alt') public ALT_LINE_CLAMP_VAR: string;
  /** Media conditions tuple string (uses '|' as separator), to be used in case of tuple syntax */
  @attr({
    name: ESLLineClamp.is + '-mask',
    defaultValue: () => ESLLineClamp.DEFAULT_MASK
  })
  public mask: string;

  /** @returns parsed media rule list for line clamping configuration */
  @memoize()
  @safe(ESLMediaRuleList.empty<string>())
  public get linesQuery(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.lines, this.mask);
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
    this.$host.style.setProperty(this.ALT_LINE_CLAMP_VAR, this.linesQuery.value || '0');
  }

  @listen({event: 'change', target: ($this: any) => $this.linesQuery})
  protected onQueryChange(): void {
    this.updateLines();
  }
}
