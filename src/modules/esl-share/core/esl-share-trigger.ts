import {prop} from '../../esl-utils/decorators';
import {ESLTrigger} from '../../esl-trigger/core';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';
import type {ESLShare} from './esl-share';

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
  @prop(['share-title', 'share-url']) public forwardedAttrs: string[];

  /** @returns parent share {@link ESLShare} element (if exists) */
  public get $share(): ESLShare | null {
    return this.closest('esl-share');
  }

  /** Show target toggleable with passed params */
  public override showTarget(params: ESLToggleableActionParams = {}): void {
    super.showTarget(params);

    this.forwardHostAttributes();
  }

  /** Forwards share attributes from the host to the trigger target */
  protected forwardHostAttributes(): void {
    if (!this.$share) return;

    this.forwardedAttrs.forEach((name) => this.$target?.$$attr(name, this.$share!.$$attr(name)));
  }
}
