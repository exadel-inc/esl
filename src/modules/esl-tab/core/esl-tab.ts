import {ExportNs} from '../../esl-utils/environment/export-ns';
import ESLTrigger from '../../esl-trigger/core/esl-trigger';

@ExportNs('Tab')
export class ESLTab extends ESLTrigger {
  public static is = 'esl-tab';
  public static eventNs = 'esl:tab';

  public updateA11y() {
    const target = this.$a11yTarget;
    if (!target) return;
    target.setAttribute('aria-selected', String(this.active));
    target.setAttribute('tabindex', this.active ? '0' : '-1');

    // TODO: auto generate
    if (this.popup.id) {
      this.setAttribute('aria-controls', this.popup.id);
    }
  }
}

export default ESLTab;
