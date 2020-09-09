import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/esl-base-element';
import {ESLTrigger} from './esl-trigger';

@ExportNs('TriggersContainer')
export class ESLTriggersContainer extends ESLBaseElement {
  public static is = 'esl-triggers-container';
  public static eventNs = 'esl:triggers-container';

  @attr({defaultValue: 'button'}) public a11yRole: string;

  get $triggers(): ESLTrigger[] {
    const els = this.querySelectorAll(ESLTrigger.is);
    return els ? Array.from(els) as ESLTrigger[] : [];
  }

  public next(trigger: ESLTrigger) {
    const triggers = this.$triggers;
    const index = triggers.indexOf(trigger);
    return triggers[(index + 1) % triggers.length];
  }

  public previous(trigger: ESLTrigger) {
    const triggers = this.$triggers;
    const index = triggers.indexOf(trigger);
    return triggers[(index - 1 + triggers.length) % triggers.length];
  }

  public active() {
    return this.$triggers.find((el) => el.active);
  }
}

export default ESLTriggersContainer;
