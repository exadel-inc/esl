import {ESLTriggersContainer, GroupTarget} from '../../esl-trigger/core/esl-triggers-container';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import ESLTab from './esl-tab';
import ESLTrigger from '../../esl-trigger/core/esl-trigger';
import {bind} from '../../esl-utils/decorators/bind';
import {attr} from '../../esl-base-element/decorators/attr';

@ExportNs('TabsContainer')
export class ESLTabsContainer extends ESLTriggersContainer {
  public static is = 'esl-tabs-container';
  public static eventNs = 'esl:tabs-container';

  @attr({defaultValue: '.esl-tab-list'}) public tabList: string;

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener(`${ESLTab.eventNs}:statechange`, this._onTriggerStateChange);
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.removeEventListener(`${ESLTab.eventNs}:statechange`, this._onTriggerStateChange);
  }

  get $triggers(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  public goTo(target: GroupTarget, from: ESLTrigger | null = this.current()) {
    if (!from) return;
    super.goTo(target, from);
    const targetEl = this[target](from);
    if (!targetEl) return;
    targetEl.click();
  }

  protected updateA11y(trigger: ESLTab) {
    const target = trigger.$a11yTarget || trigger;
    target.setAttribute('aria-selected', String(trigger.active));
    target.setAttribute('tabindex', trigger.active ? '0' : '-1');
  }

  @bind
  protected _onTriggerStateChange(event: CustomEvent) {
    const trigger = event.target as ESLTab;
    this.updateA11y(trigger);
  }
}

export default ESLTabsContainer;
