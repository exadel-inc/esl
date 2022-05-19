import {attr} from '../../esl-utils/decorators/attr';
import {setAttr} from '../../esl-utils/dom/attr';
import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLTrigger} from '../../esl-trigger/core';

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

  public initA11y(): void {
    const target = this.$a11yTarget;
    if (!target) return;
    if (target.hasAttribute('role')) return;
    setAttr(target, 'role', 'tab');
  }

  public updateA11y(): void {
    const target = this.$a11yTarget;
    if (!target) return;

    setAttr(target, 'aria-label', this.a11yLabel);
    setAttr(target, 'aria-selected', String(this.active));
    setAttr(target, 'tabindex', this.active ? '0' : '-1');

    if (this.$target && this.$target.id) {
      setAttr(target, 'aria-controls', this.$target.id);
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
