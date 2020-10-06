import {ESLTriggersContainer, GroupTarget} from '../../esl-trigger/ts/esl-triggers-container';
import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import ESLTab from './esl-tab';
import ESLTrigger from '../../esl-trigger/ts/esl-trigger';
import {attr} from '../../esl-base-element/ts/decorators/attr';

@ExportNs('TabsContainer')
export class ESLTabsContainer extends ESLTriggersContainer {
  public static is = 'esl-tabs-container';
  public static eventNs = 'esl:tabs-container';

  @attr({defaultValue: 'tab'}) public a11yRole: string;
  @attr({defaultValue: '.esl-tab-list'}) public tabList: string;

  protected bindEvents() {
    super.bindEvents();
    this.addEventListener(`${ESLTab.eventNs}:statechange`, (e: CustomEvent) => this.onTriggerStateChange(e));
  }

  protected unbindEvents() {
    super.unbindEvents();
    this.removeEventListener(`${ESLTab.eventNs}:statechange`, (e:CustomEvent) => this.onTriggerStateChange(e));
  }

  get $triggers(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  public goTo(target: GroupTarget, from: ESLTrigger | undefined = this.current()) {
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

  protected onTriggerStateChange(event: CustomEvent) {
    const trigger = event.target as ESLTab;
    this.updateA11y(trigger);
  }
}

export default ESLTabsContainer;