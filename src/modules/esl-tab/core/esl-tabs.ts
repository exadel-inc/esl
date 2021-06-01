import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {rafDecorator} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {RTLUtils} from '../../esl-utils/dom/rtl';
import {debounce} from '../../esl-utils/async/debounce';
import {CSSClassUtils} from '../../esl-utils/dom/class';
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

  /** List of supported scrollable types */
  public static supportedScrollableTypes = ['disabled', 'side', 'center'];

  static get observedAttributes() {
    return ['scrollable'];
  }

  /** Scrollable mode.
   * Supported types for different breakpoints ('disabled' by default):
   * - 'disabled' or not defined -  scroll behavior is disabled;
   * - 'center' - scroll behavior is enabled, tab is center-aligned;
   * - 'side' - scroll behavior is enabled, tab is side-aligned;
   * - empty or unsupported value - scroll behavior is enabled, tab is side-aligned;
   */
  @attr({defaultValue: 'disabled'}) public scrollable: string;

  /** Inner element to contain {@link ESLTab} collection. Will be scrolled in a scrollable mode */
  @attr({defaultValue: '.esl-tab-container'}) public scrollableTarget: string;

  private _scrollableTypeRules: ESLMediaRuleList<string>;


  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'scrollable') {
      this.scrollableTypeRules = ESLMediaRuleList.parse<string>(newVal, ESLMediaRuleList.STRING_PARSER);
      this.updateScrollableType();
    }
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.updateScrollableType();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindScrollableEvents();
  }

  protected bindScrollableEvents() {
    this.addEventListener('esl:change:active', this._onTriggerStateChange);
    this.addEventListener('click', this._onClick, false);
    this.addEventListener('focusin', this._onFocus);
    this.$scrollableTarget?.addEventListener('scroll', this._onScroll, {passive: true});

    window.addEventListener('resize', this._onResize);
  }
  protected unbindScrollableEvents() {
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
  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;
    let left = $scrollableTarget.offsetWidth;
    left = RTLUtils.isRtl(this) && RTLUtils.scrollType !== 'reverse' ? -left : left;
    left = direction === 'left' ? -left : left;

    $scrollableTarget.scrollBy({left, behavior});
  }

  /** Scroll tab to the view */
  protected fitToViewport($trigger: ESLTab, behavior: ScrollBehavior = 'smooth'): void {
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
  protected calcScrollOffset(itemRect: DOMRect, areaRect: DOMRect) {
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

  protected updateArrows() {
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

  protected updateMarkers() {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;

    const hasScroll = this.isScrollable && ($scrollableTarget.scrollWidth > this.clientWidth);
    this.toggleAttribute('has-scroll', hasScroll);
  }

  protected _deferredUpdateArrows = debounce(this.updateArrows.bind(this), 100);
  protected _deferredFitToViewport = debounce(this.fitToViewport.bind(this), 100);

  @bind
  protected _onTriggerStateChange() {
    this._deferredFitToViewport(this.$current);
  }

  @bind
  protected _onClick(event: Event) {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const target: HTMLElement | null = eventTarget.closest('[data-tab-direction]');
    const direction = target && target.dataset.tabDirection;

    if (!direction) return;
    this.moveTo(direction);
  }

  @bind
  protected _onFocus(e: FocusEvent) {
    const target = e.target;
    if (target instanceof ESLTab) this._deferredFitToViewport(target);
  }

  @bind
  protected _onScroll() {
    this._deferredUpdateArrows();
  }

  // TODO: is the raf decorator needed?
  protected _onResize = rafDecorator(() => {
    this._deferredFitToViewport(this.$current, 'auto');
  });

  /** ESLMediaRuleList instance of the scrollable type mapping */
  public get scrollableTypeRules() {
    if (!this._scrollableTypeRules) {
      this.scrollableTypeRules = ESLMediaRuleList.parse<string>(this.scrollable, ESLMediaRuleList.STRING_PARSER);
    }
    return this._scrollableTypeRules;
  }
  public set scrollableTypeRules(rules: ESLMediaRuleList<string>) {
    if (this._scrollableTypeRules) {
      this._scrollableTypeRules.removeListener(this._onScrollableTypeChange);
    }
    this._scrollableTypeRules = rules;
    this._scrollableTypeRules.addListener(this._onScrollableTypeChange);
  }

  /** @returns current scrollable type */
  public get currentScrollableType(): string {
    return this.scrollableTypeRules.activeValue || '';
  }

  /** Handles scrollable type change */
  @bind
  protected _onScrollableTypeChange() {
    this.updateScrollableType();
  }

  /** Update element state according to scrollable type */
  protected updateScrollableType() {
    ESLTabs.supportedScrollableTypes.forEach((type) => {
      CSSClassUtils.toggle(this, `${type}-alignment`, this.currentScrollableType === type);
    });

    this.$current && this._deferredFitToViewport(this.$current);

    if (this.currentScrollableType === 'disabled') {
      this.unbindScrollableEvents();
    } else {
      this.bindScrollableEvents();
    }
  }
}
