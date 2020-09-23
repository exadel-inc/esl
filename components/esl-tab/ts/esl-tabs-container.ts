import ESLTriggersContainer, {GroupTarget} from '../../esl-trigger/ts/esl-triggers-container';
import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import ESLTab from './esl-tab';
import ESLTrigger from '../../esl-trigger/ts/esl-trigger';
import {attr} from '../../esl-base-element/ts/decorators/attr';
import {rafDecorator} from '../../esl-utils/async/raf';

@ExportNs('TabsContainer')
export class ESLTabsContainer extends ESLTriggersContainer {
  public static is = 'esl-tabs-container';
  public static eventNs = 'esl:tabs-container';

  @attr({defaultValue: 'tab'}) public a11yRole: string;
  @attr({defaultValue: '.esl-tab-list'}) public tabList: string;

  protected connectedCallback() {
    this.fitToViewport(this.current(), 'auto');
    this.updateArrows();
    super.connectedCallback();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener('click', this.onClick, false);
    this.addEventListener(`${ESLTab.eventNs}:statechange`, this.onTriggerStateChange);
    this.$list.addEventListener('scroll', this.onScroll, {passive: true});
    this.addEventListener('focusin', this.onFocus);
    window.addEventListener('resize', this.onResize);
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.removeEventListener('click', this.onClick, false);
    this.removeEventListener(`${ESLTab.eventNs}:statechange`, this.onTriggerStateChange);
    this.$list.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  get $triggers(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  get $list(): HTMLElement | null {
    return this.querySelector(this.tabList);
  }

  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const list = this.$list;
    const widthToScroll = list.offsetWidth;

    list.scrollBy({
      left: direction === 'left' ? -widthToScroll - 1 : widthToScroll + 1,
      behavior: behavior
    });
  }

  public goTo(target: GroupTarget, from: ESLTrigger = this.current()) {
    super.goTo(target, from);
    const targetEl = this[target](from);
    targetEl.click();
  }

  protected fitToViewport(trigger: ESLTab, behavior: ScrollBehavior = 'smooth'): void {
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
      behavior: behavior
    });
  }

  protected updateArrows() {
    const list = this.$list;
    // cache
    const lastTrigger = this.$triggers[this.$triggers.length - 1];
    if (!list) return;

    const scrollLeft = list.scrollLeft;
    const listWidth = list.offsetWidth;
    const lastLeft = lastTrigger.offsetLeft;
    const lastWidth = lastTrigger.offsetWidth;

    const rightArrow = this.querySelector('[data-tab-direction="right"]');
    const leftArrow = this.querySelector('[data-tab-direction="left"]');

    const hasScroll = lastLeft + lastWidth > listWidth;
    this.toggleAttribute('has-scroll', hasScroll);
    if (!hasScroll) return;

    // clear to go back to the initial state
    rightArrow.removeAttribute('disabled');
    leftArrow.removeAttribute('disabled');

    if (scrollLeft + listWidth + 1 >= lastLeft + lastWidth) {
      rightArrow.setAttribute('disabled', '');
    } else if (scrollLeft === 0) {
      leftArrow.setAttribute('disabled', '');
    }
  }

  protected updateA11y(trigger: ESLTab) {
    const target = trigger.$a11yTarget || trigger;
        target.setAttribute('aria-selected', String(trigger.active));
        target.setAttribute('tabindex', trigger.active ? '0' : '-1');
  }

  protected onClick = (event: Event) => {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const target: HTMLElement = eventTarget.closest('[data-tab-direction]');
    const direction = target && target.dataset.tabDirection;

    if (!direction) return;
    this.moveTo(direction);
  };

  protected onTriggerStateChange = (event: CustomEvent) => {
    const trigger = event.target as ESLTab;
    this.updateA11y(trigger);
    this.fitToViewport(this.current());
  };

  protected onScroll = rafDecorator(() => this.updateArrows());

  protected onFocus = (e: FocusEvent) => {
    const target = e.target;
    if (target instanceof ESLTab) {
      this.fitToViewport(target, 'auto');
    }
  };

  protected onResize = () => {
    this.fitToViewport(this.current(), 'auto');
  };
}

export default ESLTabsContainer;