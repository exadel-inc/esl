import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {rafDecorator, skipOneRender} from '../../esl-utils/async/raf';
import {memoize, attr, boolAttr, listen} from '../../esl-utils/decorators';
import {isRTL, RTLScroll} from '../../esl-utils/dom/rtl';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';
import {ESLMediaRuleList} from '../../esl-media-query/core/esl-media-rule-list';
import {ESLTab} from './esl-tab';

import type {DelegatedEvent} from '../../esl-event-listener/core';

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
  public static override is = 'esl-tabs';
  public static observedAttributes = ['scrollable'];

  /** List of supported scrollable types */
  public static supportedScrollableTypes = ['disabled', 'side', 'center'];

  /**
   * Scrollable mode (supports {@link ESLMediaRuleList}).
   * Supported types for different breakpoints ('disabled' by default):
   * - 'disabled' or not defined -  scroll behavior is disabled;
   * - 'center' - scroll behavior is enabled, tab is center-aligned;
   * - 'side' - scroll behavior is enabled, tab is side-aligned;
   * - empty or unsupported value is equal to 'side' behavior;
   */
  @attr({defaultValue: 'disabled'}) public scrollable: string;

  /** An inner element to contain {@link ESLTab} collection. Will be scrolled in a scrollable mode */
  @attr({defaultValue: '.esl-tab-container'}) public scrollableTarget: string;

  /** true if not enough space to show all tabs */
  @boolAttr({readonly: true}) public hasScroll: boolean;

  protected _deferredUpdateArrows = rafDecorator(this.updateArrows, this);
  protected _deferredFitToViewport = rafDecorator(this.fitToViewport, this);

  /** ESLMediaRuleList instance of the scrollable type mapping */
  @memoize()
  public get scrollableTypeRules(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.scrollable);
  }

  /** Is the scrollable mode enabled ? */
  public get isScrollable(): boolean {
    return this.currentScrollableType !== 'disabled';
  }

  /** @returns current scrollable type */
  public get currentScrollableType(): string {
    return this.scrollableTypeRules.activeValue || 'side';
  }

  /** Collection of inner {@link ESLTab} items */
  public get $tabs(): ESLTab[] {
    return Array.from(this.querySelectorAll(ESLTab.is));
  }

  /** Active {@link ESLTab} item */
  public get $current(): ESLTab | null {
    return this.$tabs.find((el) => el.active) || null;
  }

  /** Container element to scroll */
  public get $scrollableTarget(): HTMLElement | null {
    return this.querySelector(this.scrollableTarget);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.updateMarkers();
    this.updateScrollableType();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'scrollable') {
      memoize.clear(this, 'scrollableTypeRules');
      this.$$off(this._onScrollableTypeChange);
      this.$$on(this._onScrollableTypeChange);
      this.updateScrollableType();
    }
  }

  protected normalizeOffset($container: Element, offset: number): number {
    const min = -$container.scrollLeft;
    const max = $container.scrollWidth - $container.clientWidth - $container.scrollLeft;
    return Math.max(min, Math.min(max, offset));
  }

  /** Move scroll to the next/previous item */
  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth'): void {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;
    let left = $scrollableTarget.offsetWidth;
    left = isRTL(this) && RTLScroll.type !== 'reverse' ? -left : left;
    left = direction === 'left' ? -left : left;
    left = this.normalizeOffset($scrollableTarget, left);

    $scrollableTarget.scrollBy({left, behavior});
  }

  /** Scroll tab to the view */
  protected fitToViewport($trigger: ESLTab | null, behavior: ScrollBehavior = 'smooth'): void {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget || !$trigger) return;

    const areaRect = $scrollableTarget.getBoundingClientRect();
    const itemRect = $trigger.getBoundingClientRect();

    const offset = this.calcScrollOffset(itemRect, areaRect);
    const left = this.normalizeOffset($scrollableTarget, offset || 0);
    $scrollableTarget.scrollBy({left, behavior});
  }

  /** Get scroll offset position from the selected item rectangle */
  protected calcScrollOffset(itemRect: DOMRect, areaRect: DOMRect): number | undefined {
    const isReversedRTL = isRTL(this) && RTLScroll.type === 'reverse';

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

    const swapSides = isRTL(this) && RTLScroll.type === 'default';
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
    if (this.hasScroll === hasScroll) return;

    this.toggleAttribute('has-scroll', hasScroll);
    skipOneRender(() => this._deferredFitToViewport(this.$current));
  }

  /** Update element state according to scrollable type */
  protected updateScrollableType(): void {
    ESLTabs.supportedScrollableTypes.forEach((type) => {
      this.$$cls(`scrollable-${type}`, this.currentScrollableType === type);
    });
    this._deferredFitToViewport(this.$current);

    this.$$off(this._onScroll);
    this.$$off(this._onResize);
    this.$$on(this._onScroll);
    this.$$on(this._onResize);
  }

  @listen('esl:change:active')
  protected _onTriggerStateChange({detail}: CustomEvent): void {
    if (!detail.active) return;
    this._deferredFitToViewport(this.$current);
  }

  @listen({
    event: 'click',
    selector: '[data-tab-direction]'
  })
  protected _onClick(event: DelegatedEvent<PointerEvent>): void {
    if (!event.$delegate) return;
    const {tabDirection} = (event.$delegate as HTMLElement).dataset;
    if (tabDirection) this.moveTo(tabDirection);
  }

  @listen('focusin')
  protected _onFocus({target}: FocusEvent): void {
    if (target instanceof ESLTab) this._deferredFitToViewport(target);
  }

  @listen({
    event: 'scroll',
    target: (el: ESLTabs) => el.$scrollableTarget,
    condition: (el: ESLTabs) => el.isScrollable
  })
  protected _onScroll(): void {
    this._deferredUpdateArrows();
  }

  @listen({
    event: 'resize',
    target: ESLResizeObserverTarget.for,
    condition: (el: ESLTabs) => el.isScrollable
  })
  protected _onResize(): void {
    this.updateMarkers();
    this._deferredFitToViewport(this.$current, 'instant');
  }

  /** Handles scrollable type change */
  @listen({
    event: 'change',
    target: (el: ESLTabs) => el.scrollableTypeRules
  })
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
