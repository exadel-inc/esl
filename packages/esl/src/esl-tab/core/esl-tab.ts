import {attr} from '../../esl-utils/decorators';
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
  public static override is = 'esl-tab';

  @attr({defaultValue: 'show'}) public override mode: 'show' | 'toggle' | 'hide';
  @attr({defaultValue: 'active'}) public override activeClass: string;

  public override initA11y(): void {
    const target = this.$a11yTarget;
    if (!target) return;
    if (target.hasAttribute('role')) return;
    setAttr(target, 'role', 'tab');
  }

  public override updateA11y(): void {
    const target = this.$a11yTarget;
    if (!target) return;

    if (this.a11yLabelActive !== null || this.a11yLabelInactive !== null) {
      setAttr(target, 'aria-label', this.a11yLabel);
    }
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
