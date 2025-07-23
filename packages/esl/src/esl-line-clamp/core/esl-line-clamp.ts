import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {isElement} from '../../esl-utils/dom';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';
import {ESLMediaRuleList} from '../../esl-media-query/core';

/**
 * ESLLineClamp mixin element
 * @author Dmytro Shovchko
 *
 * ESLLineClamp is a custom mixin element that applies line clamping to its content based on the specified number of lines.
 * It uses CSS custom properties to control the number of lines and applies truncation when necessary.
 * The element also handles focus management and scroll behavior to ensure a smooth user experience.
 */
@ExportNs('LineClamp')
export class ESLLineClamp extends ESLMixinElement {
  static override is = 'esl-line-clamp';

  /** Indicates whether the line clamping is active */
  @boolAttr({name: 'clamped'}) public clamped: boolean;

  /** Media query to activate clamping with number of lines */
  @attr({name: ESLLineClamp.is, defaultValue: ''}) public lines: string;

  /**
   * Returns parsed media rule list for line clamping configuration
   * @returns ESLMediaRuleList instance for managing responsive line limits
   */
  @memoize()
  public get linesQuery(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.lines, String);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.onQueryChange();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, 'linesQuery');
  }

  protected override attributeChangedCallback(): void {
    memoize.clear(this, 'linesQuery');
    this.onQueryChange();
  }

  /** Handles query change and sets the CSS custom property for line clamping */
  @listen({event: 'change', target: ($this: ESLLineClamp) => $this.linesQuery})
  protected onQueryChange(): void {
    const len = this.linesQuery.value;
    if (len) {
      this.$host.style.setProperty('--esl-line-clamp', len);
    } else {
      this.$host.style.removeProperty('--esl-line-clamp');
    }
  }

  /** Handles focus out event and resets scroll position */
  @listen('focusout')
  protected onFocusOut(e: FocusEvent): void {
    const $target = e.relatedTarget as HTMLElement;
    if (!isElement($target) || this.$host.contains($target)) return;
    this.$host.scrollTo(0, 0);
  }

  /** Handles resize events to update clamped state */
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  protected onResize(): void {
    const {clientHeight, clientWidth, scrollHeight, scrollWidth} = this.$host;
    this.clamped = clientHeight < scrollHeight || clientWidth < scrollWidth;
  }

  /** Handles show request events to scroll target into view */
  @listen({event: 'esl:show:request'})
  protected onShowRequest(e: CustomEvent): void {
    const $target: HTMLElement = (e.target as HTMLElement);
    $target.scrollIntoView();
  }
}
