import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {attr} from '../../esl-base-element/ts/decorators/attr';
import {rafDecorator} from '../../esl-utils/async/raf';
import ESLTabsContainer from '../../esl-tab/ts/esl-tabs-container';
import ESLTab from '../../esl-tab/ts/esl-tab';

@ExportNs('ScrollableTabs')
export class ESLScrollableTabs extends ESLTabsContainer {
  public static is = 'esl-scrollable-tabs';
  public static eventNs = 'esl:sc-tabs';

  @attr({defaultValue: '.esl-tab-list'}) public tabList: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.fitToViewport(this.current() as ESLTab, 'auto');
    this.updateArrows();
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
    const widthToScroll = list.offsetWidth;

    list.scrollBy({
      left: direction === 'left' ? -widthToScroll - 1 : widthToScroll + 1,
      behavior
    });
  }

  protected fitToViewport(trigger: ESLTab | undefined, behavior: ScrollBehavior = 'smooth'): void {
    if (!trigger) return;

    const list = this.$list;
    if (!list) return;

    const scrollLeft = list.scrollLeft;
    const listWidth = list.offsetWidth;
    const left = trigger.offsetLeft;
    const width = trigger.offsetWidth;

    let shiftLeft = 0;

    if (Math.abs(left - scrollLeft + width) > listWidth) {
      shiftLeft = (listWidth - (left + width)) * -1 - scrollLeft;
    } else if (scrollLeft > left) {
      shiftLeft = (scrollLeft - left) * -1;
    }

    list.scrollBy({
      left: shiftLeft,
      behavior
    });
  }

  protected updateArrows() {
    const list = this.$list;
    // cache
    const lastTrigger = this.$triggers[this.$triggers.length - 1];
    if (!list) return;

    const tabsWidth = list.offsetWidth;
    const tabsLeft = list.scrollLeft;
    const tabsRight = lastTrigger.offsetLeft + lastTrigger.offsetWidth;

    const rightArrow = this.querySelector('[data-tab-direction="right"]');
    const leftArrow = this.querySelector('[data-tab-direction="left"]');

    const hasLeftArrow = tabsLeft > 0;
    const hasRightArrow = tabsLeft + tabsWidth + 1 < tabsRight;

    leftArrow && leftArrow.toggleAttribute('disabled', !hasLeftArrow);
    rightArrow && rightArrow.toggleAttribute('disabled', !hasRightArrow);
    this.toggleAttribute('has-scroll', hasLeftArrow || hasRightArrow);
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
    this.fitToViewport(this.current() as ESLTab);
  }

  protected onScroll = rafDecorator(() => this.updateArrows());

  protected onFocus = (e: FocusEvent) => {
    const target = e.target;
    if (target instanceof ESLTab) {
      this.fitToViewport(target);
    }
  };

  protected onResize = rafDecorator(() => {
    this.fitToViewport(this.current() as ESLTab, 'auto');
    this.updateArrows();
  });
}

export default ESLScrollableTabs;