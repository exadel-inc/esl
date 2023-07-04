import {ESLTrigger} from '../../esl-trigger/core';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

/**
 * ESLShareTrigger component
 * @author Dmytro Shovchko
 *
 * ESLShareTrigger usually used in conjunction with a {@link ESLPopup}.
 * Can control any {@link ESLToggleable} instance and is used to forward the sharing attributes
 * from the parent share {@link ESLShare} component to its associated instance of {@link ESLToggleable}.
 */
export class ESLShareTrigger extends ESLTrigger {
  public static override is = 'esl-share-trigger';

  /** List of attributes to forward from the host to the trigger target */
  public static forwardedAttrs = ['share-title', 'share-url'];

  /** Show target toggleable with passed params */
  public override showTarget(params: ESLToggleableActionParams = {}): void {
    super.showTarget(params);

    this.forwardAttributes();
  }

  /**
   * Forwards share attributes from the host (or its parents) to the trigger target.
   * Doesn't do anything when share attributes are missing from the host and its parent elements.
   */
  protected forwardAttributes(): void {
    ESLShareTrigger.forwardedAttrs.forEach((name) => {
      const el = this.closest(`[${name}]`);
      const value = el && el.getAttribute(name);
      if (value) this.$target?.$$attr(name, value);
    });
  }
}
