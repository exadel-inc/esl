import {ESLTrigger} from '../../esl-trigger/core';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

/**
 * ESLShareTrigger component
 * @author Dmytro Shovchko
 *
 * ESLShareTrigger is an extension of {@link ESLTrigger} that
 * - controls an internal popup of {@link ESLShare} module in `popup` rendering mode.
 * - forwards the sharing attributes from the parent share {@link ESLShare} component to its associated instance of {@link ESLPopup}
 */
export class ESLShareTrigger extends ESLTrigger {
  public static override is = 'esl-share-trigger';

  /** List of attributes to forward from the host to the target share {@link ESLPopup} */
  public static forwardedAttrs = ['share-title', 'share-url'];

  /** Shows the target {@link ESLPopup} with a passed params */
  public override showTarget(params: ESLToggleableActionParams = {}): void {
    super.showTarget(params);

    this.forwardAttributes();
  }

  /**
   * Forwards share attributes from the host (or its parents) to the target share {@link ESLPopup} instance.
   * Skips empty attributes
   */
  protected forwardAttributes(): void {
    ESLShareTrigger.forwardedAttrs.forEach((name) => {
      const el = this.closest(`[${name}]`);
      const value = el && el.getAttribute(name);
      if (value) this.$target?.$$attr(name, value);
    });
  }
}
