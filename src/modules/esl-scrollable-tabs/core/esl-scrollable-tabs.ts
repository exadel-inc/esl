import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {rafDecorator} from '../../esl-utils/async/raf';
import {RTLUtils} from '../../esl-utils/dom/rtl';

import {ESLTab, ESLTabs} from '../../esl-tab/core';

@ExportNs('ScrollableTabs')
export class ESLScrollableTabs extends ESLTabs {
  public static is = 'esl-scrollable-tabs';

  @attr({defaultValue: '.esl-tab-list'}) public list: string;

  // TODO: think about update of arrows
  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();

    this.updateArrows();
    this._deferredFitToViewport(this.$current, 'auto');
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    this.addEventListener('esl:change:active', this._onTriggerStateChange);
    this.addEventListener('click', this._onClick, false);
    this.addEventListener('focusin', this._onFocus);
    this.$list?.addEventListener('scroll', this._onScroll, {passive: true});

    window.addEventListener('resize', this._onResize);
  }

  protected unbindEvents() {
    this.removeEventListener('esl:change:active', this._onTriggerStateChange);
    this.removeEventListener('click', this._onClick, false);
    this.removeEventListener('focusin', this._onFocus);
    this.$list?.removeEventListener('scroll', this._onScroll);

    window.removeEventListener('resize', this._onResize);
  }

  public get $tabs(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  public get $current(): ESLTab | null {
    return this.$tabs.find((el) => el.active) || null;
  }

  public get $list(): HTMLElement | null {
    return this.querySelector(this.list);
  }

  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const $list = this.$list;
    if (!$list) return;
    let left = $list.offsetWidth;
    left = RTLUtils.isRtl(this) && RTLUtils.scrollType !== 'reverse' ? -left : left;
    left = direction === 'left' ? -left : left;

    $list.scrollBy({left, behavior});
  }

  protected fitToViewport($trigger?: ESLTab, behavior: ScrollBehavior = 'smooth'): void {
    const $list = this.$list;
    if (!$list || !$trigger) return;

    const areaRect = $list.getBoundingClientRect();
    const itemRect = $trigger.getBoundingClientRect();

    let shift = 0;

    // item out of area from the right side
    // else item out of area from the left side
    if (itemRect.right > areaRect.right) {
      shift = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'reverse' ?
        Math.floor(areaRect.right - itemRect.right) :
        Math.ceil(itemRect.right - areaRect.right);
    } else if (itemRect.left < areaRect.left) {
      shift = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'reverse' ?
        Math.ceil(areaRect.left - itemRect.left) :
        Math.floor(itemRect.left - areaRect.left);
    }

    $list.scrollBy({
      left: shift,
      behavior
    });

    this.updateArrows();
  }

  protected updateArrows() {
    const $list = this.$list;
    if (!$list) return;

    const hasScroll = $list.scrollWidth > this.clientWidth;
    const swapSides = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'default';
    const scrollStart = Math.abs($list.scrollLeft) > 1;
    const scrollEnd = Math.abs($list.scrollLeft) + $list.clientWidth + 1 < $list.scrollWidth;

    const $rightArrow = this.querySelector('[data-tab-direction="right"]');
    const $leftArrow = this.querySelector('[data-tab-direction="left"]');

    this.toggleAttribute('has-scroll', hasScroll);
    $leftArrow && $leftArrow.toggleAttribute('disabled', !(swapSides ? scrollEnd : scrollStart));
    $rightArrow && $rightArrow.toggleAttribute('disabled', !(swapSides ? scrollStart : scrollEnd));
  }

  protected _deferredUpdateArrows = rafDecorator(this.updateArrows.bind(this));
  protected _deferredFitToViewport = rafDecorator(this.fitToViewport.bind(this));

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

  // FIXME
  protected _onResize = rafDecorator(() => {
    this._deferredFitToViewport(this.$current, 'auto');
  });
}
