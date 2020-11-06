import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {attr} from '../../esl-base-element/ts/decorators/attr';
import {rafDecorator} from '../../esl-utils/async/raf';
import ESLTabsContainer from '../../esl-tab/ts/esl-tabs-container';
import ESLTab from '../../esl-tab/ts/esl-tab';
import {isNegativeScroll, isRtl} from '../../esl-utils/dom/rtl';

@ExportNs('ScrollableTabs')
export class ESLScrollableTabs extends ESLTabsContainer {
  public static is = 'esl-scrollable-tabs';
  public static eventNs = 'esl:sc-tabs';

  @attr({defaultValue: '.esl-tab-list'}) public tabList: string;

  // TODO: think about update of arrows
  protected connectedCallback() {
    super.connectedCallback();
    this.updateArrows();
    this.fitToViewportRAF(this.current() as ESLTab, 'auto');
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener('click', this.onClick, false);
    this.$list && this.$list.addEventListener('scroll', this.onScroll, {passive: true});
    this.addEventListener('focusin', this.onFocus);
    window.addEventListener('resize', this.onResize);
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.removeEventListener('click', this.onClick, false);
    this.$list && this.$list.removeEventListener('scroll', this.onScroll);
    this.removeEventListener('focusin', this.onFocus);
    window.removeEventListener('resize', this.onResize);
  }

  get $list(): HTMLElement | null {
    return this.querySelector(this.tabList);
  }

  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const list = this.$list;
    if (!list) return;
    let left = list.offsetWidth;
    left = isRtl(this) && isNegativeScroll() ? -left : left;
    left = direction === 'left' ? -left : left;

    list.scrollBy({left, behavior});
  }

  protected fitToViewport(trigger: ESLTab | undefined, behavior: ScrollBehavior = 'smooth'): void {
    const list = this.$list;
    if (!list || !trigger) return;

    const areaRect = list.getBoundingClientRect();
    const itemRect = trigger.getBoundingClientRect();

    let shift = 0;

    // item out of area from the right side
    // else item out of area from the left side
    if (itemRect.right > areaRect.right) {
      shift = isRtl(this) && !isNegativeScroll() ?
        Math.floor(areaRect.right - itemRect.right) :
        Math.ceil(itemRect.right - areaRect.right);
    } else if (itemRect.left < areaRect.left) {
      shift = isRtl(this) && !isNegativeScroll() ?
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
    const scrollStart = Math.abs(list.scrollLeft) > 1;
    const scrollEnd = Math.abs(list.scrollLeft) + list.clientWidth + 1 < list.scrollWidth;

    const rightArrow = this.querySelector('[data-tab-direction="right"]');
    const leftArrow = this.querySelector('[data-tab-direction="left"]');

    this.toggleAttribute('has-scroll', hasScroll);
    leftArrow && leftArrow.toggleAttribute('disabled', !scrollStart);
    rightArrow && rightArrow.toggleAttribute('disabled', !scrollEnd);
  }

  protected onClick = (event: Event) => {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const target: HTMLElement | null = eventTarget.closest('[data-tab-direction]');
    const direction = target && target.dataset.tabDirection;

    if (!direction) return;
    this.moveTo(direction);
  };

  protected onTriggerStateChange(event: CustomEvent) {
    super.onTriggerStateChange(event);
    this.fitToViewportRAF(this.current() as ESLTab);
  }

  protected onScroll = rafDecorator(() => this.updateArrows());

  protected fitToViewportRAF = rafDecorator(this.fitToViewport.bind(this));

  protected onFocus = (e: FocusEvent) => {
    const target = e.target;
    if (target instanceof ESLTab) {
      this.fitToViewportRAF(target);
    }
  };

  protected onResize = rafDecorator(() => {
    this.fitToViewportRAF(this.current() as ESLTab, 'auto');
  });
}

export default ESLScrollableTabs;
