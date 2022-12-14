import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLMixinElement} from '../../esl-mixin-element/core';
import {ESLPanel} from '../../esl-panel/core/esl-panel';
import {listen} from '../../esl-utils/decorators';

/**
 * ESLNestedAccordion mixin element
 * @author Anastasia Lesun, Natalia Smirnova
 *
 * ESLNestedAccordion is a custom mixin element that can be used with {@link ESLPanel} instance to allow hide all children panels
 */
@ExportNs('NestedAccordion')
export class ESLNestedAccordion extends ESLMixinElement {
  static is = 'esl-nested-accordion';

  /** @returns all nested panels  */
  public get $nestedPanels(): ESLPanel[] {
    return [...this.$host.querySelectorAll(ESLPanel.is)] as ESLPanel[];
  }

  /** Processes {@link ESLPanel} hide event */
  @listen('esl:hide')
  protected onHideChildren(e: CustomEvent): void {
    e.stopPropagation();
    this.$nestedPanels.length && this.$nestedPanels.forEach((panel: ESLPanel) => panel.hide());
  }
}
