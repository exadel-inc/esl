import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {rafDecorator} from '../../esl-utils/async/raf';
import {bind, memoize, attr} from '../../esl-utils/decorators';
import {RTLUtils} from '../../esl-utils/dom/rtl';
import {debounce} from '../../esl-utils/async/debounce';
import {ESLMediaRuleList} from '../../esl-media-query/core/esl-media-rule-list';
import {ESLTab} from './esl-tab';

/**
 * ESlTabs component
 * @author Julia Murashko
 *
 * Tabs container component for Tabs trigger group.
 * Uses {@link ESLTab} as an item.
 * Each individual {@link ESLTab} can control {@link ESLToggleable} or, usually, {@link ESLPanel}
 */
@ExportNs('Tabs')
export class ESLTabs extends ESLBaseElement {
  public static is = 'esl-tabs';
  public static observedAttributes = ['scrollable'];

  /** List of supported scrollable types */
  public static supportedScrollableTypes = ['disabled', 'side', 'center'];

  /**
   * Scrollable mode.
   * Supported types for different breakpoints ('disabled' by default):
   * - 'disabled' or not defined -  scroll behavior is disabled;
   * - 'center' - scroll behavior is enabled, tab is center-aligned;
   * - 'side' - scroll behavior is enabled, tab is side-aligned;
   * - empty or unsupported value is equal to 'side' behavior;
   */
  @attr({defaultValue: 'disabled'}) public scrollable: string;

  /** Inner element to contain {@link ESLTab} collection. Will be scrolled in a scrollable mode */
  @attr({defaultValue: '.esl-tab-container'}) public scrollableTarget: string;

  protected _deferredUpdateArrows = debounce(this.updateArrows, 100, this);
  protected _deferredFitToViewport = debounce(this.fitToViewport, 100, this);

  /** ESLMediaRuleList instance of the scrollable type mapping */
  @memoize()
  public get scrollableTypeRules(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.scrollable);
  }

  /** @returns current scrollable type */
  public get currentScrollableType(): string {
    return this.scrollableTypeRules.activeValue || '';
  }

  protected connectedCallback(): void {
    super.connectedCallback();
    this.scrollableTypeRules.addEventListener(this._onScrollableTypeChange);
    this.updateScrollableType();
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this.scrollableTypeRules.removeEventListener(this._onScrollableTypeChange);
    this.unbindScrollableEvents();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'scrollable') {
      this.scrollableTypeRules.removeEventListener(this._onScrollableTypeChange);
      memoize.clear(this, 'scrollableTypeRules');
      this.scrollableTypeRules.addEventListener(this._onScrollableTypeChange);
      this.updateScrollableType();
    }
  }

  protected bindScrollableEvents(): void {
    this.addEventListener('esl:change:active', this._onTriggerStateChange);
    this.addEventListener('click', this._onClick, false);
    this.addEventListener('focusin', this._onFocus);
    this.$scrollableTarget?.addEventListener('scroll', this._onScroll, {passive: true});

    window.addEventListener('resize', this._onResize);
  }
  protected unbindScrollableEvents(): void {
    this.removeEventListener('esl:change:active', this._onTriggerStateChange);
    this.removeEventListener('click', this._onClick, false);
    this.removeEventListener('focusin', this._onFocus);
    this.$scrollableTarget?.removeEventListener('scroll', this._onScroll);

    window.removeEventListener('resize', this._onResize);
  }

  /** Collection of inner {@link ESLTab} items */
  public get $tabs(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  /** Active {@link ESLTab} item */
  public get $current(): ESLTab | null {
    return this.$tabs.find((el) => el.active) || null;
  }

  /** Container element to scroll */
  public get $scrollableTarget(): HTMLElement | null {
    return this.querySelector(this.scrollableTarget);
  }

  /** Is the scrollable mode enabled ? */
  public get isScrollable(): boolean {
    return this.currentScrollableType !== 'disabled';
  }

  /** Move scroll to the next/previous item */
  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth'): void {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;
    let left = $scrollableTarget.offsetWidth;
    left = RTLUtils.isRtl(this) && RTLUtils.scrollType !== 'reverse' ? -left : left;
    left = direction === 'left' ? -left : left;

    $scrollableTarget.scrollBy({left, behavior});
  }

  /** Scroll tab to the view */
  protected fitToViewport($trigger: ESLTab | null, behavior: ScrollBehavior = 'smooth'): void {
    this.updateMarkers();

    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget || !$trigger) return;

    const areaRect = $scrollableTarget.getBoundingClientRect();
    const itemRect = $trigger.getBoundingClientRect();

    $scrollableTarget.scrollBy({
      left: this.calcScrollOffset(itemRect, areaRect),
      behavior
    });

    this.updateArrows();
  }

  /** Get scroll offset position from the selected item rectangle */
  protected calcScrollOffset(itemRect: DOMRect, areaRect: DOMRect): number | undefined {
    const isReversedRTL = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'reverse';

    if (this.currentScrollableType === 'center') {
      const shift = itemRect.left + itemRect.width / 2 - (areaRect.left + areaRect.width / 2);
      return isReversedRTL ? -shift : shift;
    }

    // item is out of area from the right side
    // else item out is of area from the left side
    if (itemRect.right > areaRect.right) {
      return isReversedRTL ? Math.floor(areaRect.right - itemRect.right) : Math.ceil(itemRect.right - areaRect.right);
    } else if (itemRect.left < areaRect.left) {
      return isReversedRTL ? Math.ceil(areaRect.left - itemRect.left) : Math.floor(itemRect.left - areaRect.left);
    }
  }

  protected updateArrows(): void {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;

    const swapSides = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'default';
    const scrollStart = Math.abs($scrollableTarget.scrollLeft) > 1;
    const scrollEnd = Math.abs($scrollableTarget.scrollLeft) + $scrollableTarget.clientWidth + 1 < $scrollableTarget.scrollWidth;

    const $rightArrow = this.querySelector('[data-tab-direction="right"]');
    const $leftArrow = this.querySelector('[data-tab-direction="left"]');

    $leftArrow && $leftArrow.toggleAttribute('disabled', !(swapSides ? scrollEnd : scrollStart));
    $rightArrow && $rightArrow.toggleAttribute('disabled', !(swapSides ? scrollStart : scrollEnd));
  }

  protected updateMarkers(): void {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;

    const hasScroll = this.isScrollable && ($scrollableTarget.scrollWidth > this.clientWidth);
    this.toggleAttribute('has-scroll', hasScroll);
  }

  /** Update element state according to scrollable type */
  protected updateScrollableType(): void {
    this._deferredFitToViewport(this.$current);

    if (this.currentScrollableType === 'disabled') {
      this.unbindScrollableEvents();
    } else {
      this.bindScrollableEvents();
    }
  }

  @bind
  protected _onTriggerStateChange({detail}: CustomEvent): void {
    if (!detail.active) return;
    this._deferredFitToViewport(this.$current);
  }

  @bind
  protected _onClick(event: Event): void {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const target: HTMLElement | null = eventTarget.closest('[data-tab-direction]');
    const direction = target && target.dataset.tabDirection;

    if (!direction) return;
    this.moveTo(direction);
  }

  @bind
  protected _onFocus(e: FocusEvent): void {
    const target = e.target;
    if (target instanceof ESLTab) this._deferredFitToViewport(target);
  }

  @bind
  protected _onScroll(): void {
    this._deferredUpdateArrows();
  }

  // TODO: is the raf decorator needed?
  protected _onResize = rafDecorator(() => this._deferredFitToViewport(this.$current, 'auto'));

  /** Handles scrollable type change */
  @bind
  protected _onScrollableTypeChange(): void {
    this.updateScrollableType();
  }
}

declare global {
  export interface ESLLibrary {
    Tabs: typeof ESLTabs;
  }

  export interface HTMLElementTagNameMap {
    'esl-tabs': ESLTabs;
  }
}
