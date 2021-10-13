import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLTrigger} from '../../esl-trigger/core';
import {attr} from '../../esl-base-element/decorators/attr';

/**
 * ESlTab component
 * @author Julia Murashko
 *
 * Tab trigger item, usually used in conjunction with a {@link ESLTabs}.
 * Can control any {@link ESLToggleable} instance but is usually used in conjunction with {@link ESLPanel}
 */
@ExportNs('Tab')
export class ESLTab extends ESLTrigger {
  public static is = 'esl-tab';

  @attr({defaultValue: 'show'}) public mode: string;
  @attr({defaultValue: 'active'}) public activeClass: string;

  public initA11y() {
    const target = this.$a11yTarget;
    if (!target) return;
    if (target.hasAttribute('role')) return;
    target.setAttribute('role', 'tab');
  }

  public updateA11y() {
    const target = this.$a11yTarget;
    if (!target) return;
    target.setAttribute('aria-selected', String(this.active));
    target.setAttribute('tabindex', this.active ? '0' : '-1');

    // TODO: auto generate
    if (this.$target && this.$target.id) {
      this.setAttribute('aria-controls', this.$target.id);
    }
  }
}

declare global {
  export interface ESLLibrary {
    Tab: typeof ESLTab;
  }
  export interface HTMLElementTagNameMap {
    'esl-tab': ESLTab;
  }
}
