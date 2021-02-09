import {ESLTriggersContainer, GroupTarget} from '../../esl-trigger/core/esl-triggers-container';
import {ESLTab} from './esl-tab';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr} from '../../esl-base-element/decorators/attr';

@ExportNs('TabsContainer')
export class ESLTabsContainer extends ESLTriggersContainer {
  public static is = 'esl-tabs-container';

  @attr({defaultValue: '.esl-tab-list'}) public tabList: string;

  get $triggers(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  public goTo(target: GroupTarget, from: ESLTab | null = this.current()) {
    if (!from) return;
    super.goTo(target, from);
    const targetEl = this[target](from);
    if (!targetEl) return;
    targetEl.click();
  }
}

export default ESLTabsContainer;
