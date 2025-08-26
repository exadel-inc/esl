import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {isElement, isRelativeNode} from '../../esl-utils/dom';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';
import {ESLMediaRuleList} from '../../esl-media-query/core';

function roundLineHeight(value: number, precision = 0.1): number {
  return Math.round(value / precision) * precision;
}

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

  static mask: string = '@XS|@SM|@MD|@LG|@XL';

  /** Indicates whether the line clamping is active */
  @boolAttr({name: 'clamped', readonly: true}) public clamped: boolean;

  /** Media query to activate clamping with number of lines */
  @attr({name: ESLLineClamp.is, defaultValue: ''}) public lines: string;

  /**
   * Returns parsed media rule list for line clamping configuration
   * @returns ESLMediaRuleList instance for managing responsive line limits
   */
  @memoize()
  public get linesQuery(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.lines, ESLLineClamp.mask, String);
  }

  protected get linesExpected(): string | null {
    const lines = this.linesQuery.value;
    if (lines?.length === 0) return null;
    if (lines === 'auto') {
      const {lineHeight, maxHeight} = getComputedStyle(this.$host);

      // Need to round line height after fractional conversion from em to px
      const parsedLineHeight = roundLineHeight(parseFloat(lineHeight));
      const parsedMaxHeight = parseFloat(maxHeight);
      const autoLines = Math.floor(parsedMaxHeight / parsedLineHeight);

      if (!Number.isFinite(autoLines)) return null;
      return autoLines > 0 ? String(autoLines) : null;
    }
    return lines ?? null;
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

  protected updateLines(): void {
    const lines = this.linesExpected;
    if (lines) {
      this.$host.style.setProperty('--esl-line-clamp', lines);
    } else {
      this.$host.style.removeProperty('--esl-line-clamp');
    }
  }

  /** Handles query change and sets the CSS custom property for line clamping */
  @listen({event: 'change', target: ($this: ESLLineClamp) => $this.linesQuery})
  protected onQueryChange(): void {
    this.updateLines();
  }

  /** Handles focus out event and resets scroll position */
  @listen('focusout')
  protected onFocusOut(e: FocusEvent): void {
    const $relatedTarget = e.relatedTarget as HTMLElement;
    if (!isElement($relatedTarget) || this.$host.contains($relatedTarget)) return;
    const $target = e.target as Element & {$target?: Element};
    if (isElement($target.$target) && $target.$target.contains($relatedTarget)) return;
    this.$host.scrollTo(0, 0);
  }

  protected lastHeight = 0;
  /** Handles resize events to update clamped state */
  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  protected onResize(): void {
    const {height} = this.$host.getBoundingClientRect();
    if (this.linesQuery.value === 'auto' && this.lastHeight !== height) {
      this.lastHeight = height;
      this.updateLines();
    }
    const {clientHeight, clientWidth, scrollHeight, scrollWidth} = this.$host;
    this.$$attr('clamped', clientHeight < scrollHeight || clientWidth < scrollWidth);
  }

  /** Observes custom broadcast 'esl:refresh' event to force refresh */
  @listen({event: 'esl:refresh', target: window})
  protected onRefresh({target}: Event): void {
    if (isElement(target) && !isRelativeNode(target, this.$host)) return;
    this.updateLines();
  }

  /** Handles show request events to scroll target into view */
  @listen('esl:show:request')
  protected onShowRequest(e: CustomEvent): void {
    const $target: HTMLElement = (e.target as HTMLElement);
    $target.scrollIntoView();
  }
}
