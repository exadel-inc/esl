import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {rafDecorator} from '../../esl-utils/async/raf';
import {RTLUtils} from '../../esl-utils/dom/rtl';

import {ESLTab, ESLTabsContainer} from '../../esl-tab/core';

@ExportNs('ScrollableTabs')
export class ESLScrollableTabs extends ESLTabsContainer {
  public static is = 'esl-scrollable-tabs';

  @attr({defaultValue: '.esl-tab-list'}) public tabList: string;

  // TODO: think about update of arrows
  protected connectedCallback() {
    super.connectedCallback();
    this.updateArrows();
    this.deferredFitToViewport(this.current() as ESLTab, 'auto');
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener('click', this._onClick, false);
    this.$list?.addEventListener('scroll', this._onScroll, {passive: true});
    this.addEventListener('focusin', this._onFocus);
    this.addEventListener('change:active', this._onTriggerStateChange);
    window.addEventListener('resize', this.onResize);
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.removeEventListener('click', this._onClick, false);
    this.$list?.removeEventListener('scroll', this._onScroll);
    this.removeEventListener('focusin', this._onFocus);
    this.removeEventListener('change:active', this._onTriggerStateChange);
    window.removeEventListener('resize', this.onResize);
  }

  get $list(): HTMLElement | null {
    return this.querySelector(this.tabList);
  }

  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const list = this.$list;
    if (!list) return;
    let left = list.offsetWidth;
    left = RTLUtils.isRtl(this) && RTLUtils.scrollType !== 'reverse' ? -left : left;
    left = direction === 'left' ? -left : left;

    list.scrollBy({left, behavior});
  }

  protected fitToViewport(trigger?: ESLTab, behavior: ScrollBehavior = 'smooth'): void {
    const list = this.$list;
    if (!list || !trigger) return;

    const areaRect = list.getBoundingClientRect();
    const itemRect = trigger.getBoundingClientRect();

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

    list.scrollBy({
      left: shift,
      behavior
    });

    this.updateArrows();
  }

  protected updateArrows() {
    const list = this.$list;
    if (!list) return;

    const hasScroll = list.scrollWidth > this.clientWidth;
    const swapSides = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'default';
    const scrollStart = Math.abs(list.scrollLeft) > 1;
    const scrollEnd = Math.abs(list.scrollLeft) + list.clientWidth + 1 < list.scrollWidth;

    const rightArrow = this.querySelector('[data-tab-direction="right"]');
    const leftArrow = this.querySelector('[data-tab-direction="left"]');

    this.toggleAttribute('has-scroll', hasScroll);
    leftArrow && leftArrow.toggleAttribute('disabled', !(swapSides ? scrollEnd : scrollStart));
    rightArrow && rightArrow.toggleAttribute('disabled', !(swapSides ? scrollStart : scrollEnd));
  }

  protected deferredUpdateArrows = rafDecorator(this.updateArrows.bind(this));

  protected deferredFitToViewport = rafDecorator(this.fitToViewport.bind(this));

  @bind
  protected _onScroll() {
    this.deferredUpdateArrows();
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
  protected _onTriggerStateChange(event: CustomEvent) {
    this.deferredFitToViewport(this.current() as ESLTab);
  }

  @bind
  protected _onFocus(e: FocusEvent) {
    const target = e.target;
    if (target instanceof ESLTab) {
      this.deferredFitToViewport(target);
    }
  }

  // FIXME
  protected onResize = rafDecorator(() => {
    this.deferredFitToViewport(this.current() as ESLTab, 'auto');
  });
}

export default ESLScrollableTabs;
