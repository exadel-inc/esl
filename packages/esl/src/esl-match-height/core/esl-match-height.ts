import {ESLMixinElement} from '../../esl-mixin-element/core';
import {attr, listen, decorate, bind} from '../../esl-utils/decorators';
import {afterNextRender, throttle} from '../../esl-utils/async';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';
import {ExportNs} from '../../esl-utils/environment/export-ns';

/** Temporary wrapper object */
interface MatchItem {
  /** Wrapped HTMLElement */
  $el: HTMLElement;
  /** Order based on order parameter */
  order: number;
  /** Top position of the element on the page */
  top: number;
  /** Height of the element */
  height: number;
}

/** Parse order attribute value to array of the matching selector strings */
const parseMatchers = (v: string | null): string[] => (v || '').split('|').map((s) => s.trim()).concat('*');

/**
 * ESLMatchHeight - mixin element to equalize heights of child elements within a container
 * @author Feoktyst Shovchko, Alexey Stsefanovich (ala'n)
 *
 * Use example:
 * ```html
 * <div esl-match-height="selector"
 *      esl-match-height-order="selectorTopPriority | selectorSecondPriority">
 *   ... div.selector * n
 * </div>
 * ```
 */
@ExportNs('MatchHeight')
export class ESLMatchHeightMixin extends ESLMixinElement {
  public static override is = 'esl-match-height';

  static override observedAttributes = ['esl-match-height-order'];

  /** Default selector for child elements to normalize */
  public static readonly DEFAULT_SELECTOR = '[match-height]';

  /** Selector to find all the child elements that should be normalized by height */
  @attr({defaultValue: ESLMatchHeightMixin.DEFAULT_SELECTOR, name: ESLMatchHeightMixin.is})
  public selector: string;
  /** A list of selectors in the order of priority (always ends with '*' matcher) */
  @attr({defaultValue: ['*'], name: 'esl-match-height-order', parser: parseMatchers})
  public orders: string[];

  /** List of HTMLElements to normalize height */
  public get $elements(): HTMLElement[] {
    return Array.from(this.$host.querySelectorAll(this.selector || ESLMatchHeightMixin.DEFAULT_SELECTOR));
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    afterNextRender(() => this.update());
  }

  protected override disconnectedCallback(): void {
    this.clear();
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === ESLMatchHeightMixin.is && oldValue) this.clear(Array.from(this.$host.querySelectorAll(oldValue)));
    super.attributeChangedCallback(name, oldValue, newValue);
    this.update();
  }

  /** Starts elements normalization */
  @decorate(throttle, 200)
  public update(): void {
    this.clear();
    this.resize(this.$elements);
  }

  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  protected onResize(): void {
    this.update();
  }

  @listen({event: 'loadingdone', target: document.fonts})
  protected onFontsLoaded(): void {
    this.update();
  }

  /** Compares two {@link MatchItem} objects */
  @bind
  public compare(a: MatchItem, b: MatchItem): number {
    if (a.order === b.order) return a.top - b.top;
    return (a.order - b.order) * Number.POSITIVE_INFINITY;
  }

  /** Creates a wrapper object based on the passed element */
  @bind
  protected toMatchItem($el: HTMLElement): MatchItem {
    const {top, height} = $el.getBoundingClientRect();
    const order = this.orders.findIndex((sel) => $el.matches(sel));
    return {$el, order, top, height};
  }

  /** Resets height values */
  public clear($els: HTMLElement[] = this.$elements): void {
    $els.forEach(($el: HTMLElement) => $el.style.height = '');
  }

  /** Update height values for passed elements */
  public resize($els: HTMLElement[] = this.$elements): void {
    if ($els.length < 2) return;
    const items: MatchItem[] = $els.map(this.toMatchItem).sort(this.compare);
    const index = items.findIndex((item: MatchItem) => Math.abs(this.compare(item, items[0])) > 1);
    const group = items.slice(0, index > 0 ? index : items.length);
    if (group.length > 1) {
      const maxHeight = Math.max(...group.map((item: MatchItem) => item.height));
      group.forEach((item: MatchItem) => item.$el.style.height = `${maxHeight}px`);
    }
    this.resize(items.slice(group.length).map((item: MatchItem) => item.$el));
  }
}

declare global {
  export interface ESLLibrary {
    MatchHeight: typeof ESLMatchHeightMixin;
  }
}
