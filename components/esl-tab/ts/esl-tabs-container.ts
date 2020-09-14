import ESLTriggersContainer from '../../esl-trigger/ts/esl-triggers-container';
import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import ESLTrigger from '../../esl-trigger/ts/esl-trigger';
import {attr} from "../../esl-base-element/ts/decorators/attr";

@ExportNs('TabsContainer')
export class ESLTabsContainer extends ESLTriggersContainer {
  public static is = 'esl-tabs-container';
  public static eventNs = 'esl:tabs-container';

  @attr({defaultValue: 'tab'}) public a11yRole: string;

  private $list: HTMLElement;

  protected connectedCallback() {
    super.connectedCallback();
    this.$list = this.querySelector('.esl-tab-list');

    this.fitToViewport(this.active(), 'auto');
    this._bindEvents();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this._unbindEvents();
  }

  protected _bindEvents() {
    this.addEventListener('click', this._onClick, false);
    this.$triggers.forEach((trigger: ESLTrigger) => {
      trigger.addEventListener(`${ESLTrigger.eventNs}:statechange`, this._onTriggerStateChange);
    });
  }

  protected _unbindEvents() {
    this.removeEventListener('click', this._onClick, false);
    this.$triggers.forEach((trigger: ESLTrigger) => {
      trigger.removeEventListener(`${ESLTrigger.eventNs}:statechange`, this._onTriggerStateChange, false);
    });
  }

  protected _onClick = (event: Event) => {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const target: HTMLElement = eventTarget.closest('[data-tab-direction]');
    const direction = target && target.dataset.tabDirection;

    if (!direction) return;
    this.moveTo(direction);
  };

  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const el = this.querySelector('.esl-tab-list') as HTMLElement;
    const widthToScroll = el.offsetWidth;

    el.scrollBy({
      left: direction === 'left' ? -widthToScroll - 1 : widthToScroll + 1,
      behavior: behavior
    });
  }

  protected fitToViewport(trigger: ESLTrigger, behavior: ScrollBehavior = 'smooth'): void {
    if (!trigger) return;

    const scrollLeft = this.$list.scrollLeft;
    const listWidth = this.$list.offsetWidth;
    const width = trigger.offsetWidth;
    const left = trigger.offsetLeft;

    let shiftLeft = 0;

    if (Math.abs(left - scrollLeft + width) > listWidth) {
      shiftLeft = (listWidth - (left + width)) * -1 - scrollLeft;
    } else if (scrollLeft > left) {
      shiftLeft = (scrollLeft - left) * -1;
    }

    this.$list.scrollBy({
      left: shiftLeft,
      behavior: behavior
    });
  }

  protected _onTriggerStateChange = (event: CustomEvent) => {
    const trigger = event.target as ESLTrigger;
    this.updateA11y(trigger);
    this.fitToViewport(this.active());
  };

  protected updateA11y(trigger: ESLTrigger) {
    const target = trigger.$a11yTarget || trigger;
        target.setAttribute('aria-selected', String(trigger.active));
        target.setAttribute('tabindex', trigger.active ? '0' : '-1');
  }
}

export default ESLTabsContainer;