import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {rafDecorator} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {ESLTab} from './esl-tab';
import {RTLUtils} from '../../esl-utils/dom/rtl';

@ExportNs('Tabs')
export class ESLTabs extends ESLBaseElement {
  public static is = 'esl-tabs';

  @attr({defaultValue: '.esl-tab-container'}) public container: string;

  @boolAttr() public scrollable: boolean;

  // TODO: think about update of arrows
  protected connectedCallback() {
    super.connectedCallback();
    this.bindScrollableEvents();

    this.updateScroll();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindScrollableEvents();
  }

  protected bindScrollableEvents() {
    this.addEventListener('esl:change:active', this._onTriggerStateChange);
    this.addEventListener('click', this._onClick, false);
    this.addEventListener('focusin', this._onFocus);
    this.$container?.addEventListener('scroll', this._onScroll, {passive: true});

    window.addEventListener('resize', this._onResize);
  }
  protected unbindScrollableEvents() {
    this.removeEventListener('esl:change:active', this._onTriggerStateChange);
    this.removeEventListener('click', this._onClick, false);
    this.removeEventListener('focusin', this._onFocus);
    this.$container?.removeEventListener('scroll', this._onScroll);

    window.removeEventListener('resize', this._onResize);
  }

  protected updateScroll() {
    this.updateArrows();
    this._deferredFitToViewport(this.$current, 'auto');
  }


  public get $tabs(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  public get $current(): ESLTab | null {
    return this.$tabs.find((el) => el.active) || null;
  }

  public get $container(): HTMLElement | null {
    return this.querySelector(this.container);
  }

  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const $container = this.$container;
    if (!$container) return;
    let left = $container.offsetWidth;
    left = RTLUtils.isRtl(this) && RTLUtils.scrollType !== 'reverse' ? -left : left;
    left = direction === 'left' ? -left : left;

    $container.scrollBy({left, behavior});
  }

  protected fitToViewport($trigger?: ESLTab, behavior: ScrollBehavior = 'smooth'): void {
    const $container = this.$container;
    if (!$container || !$trigger) return;

    const areaRect = $container.getBoundingClientRect();
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

    $container.scrollBy({
      left: shift,
      behavior
    });

    this.updateArrows();
  }

  protected updateArrows() {
    const $container = this.$container;
    if (!$container) return;

    const hasScroll = $container.scrollWidth > this.clientWidth;
    const swapSides = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'default';
    const scrollStart = Math.abs($container.scrollLeft) > 1;
    const scrollEnd = Math.abs($container.scrollLeft) + $container.clientWidth + 1 < $container.scrollWidth;

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
