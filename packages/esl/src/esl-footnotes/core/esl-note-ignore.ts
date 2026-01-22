import {ESLMixinElement} from '../../esl-mixin-element/core';
import {prop} from '../../esl-utils/decorators';

import type {ESLNote} from './esl-note';

/**
 * Optional mixin element to support esl-note-ignore attribute dynamic changes
 */
export class ESLNoteIgnore extends ESLMixinElement {
  public static override is = 'esl-note-ignore';

  /** Type guard to check if the element is ESLNote */
  protected static isNote($el: Element): $el is ESLNote {
    return $el && typeof ($el as ESLNote).updateIgnoredQuery === 'function';
  }

  /** Tag to find all dependent ESLNote elements */
  @prop('esl-note') protected noteTag: string;

  public override connectedCallback(): void {
    super.connectedCallback();
    customElements.whenDefined(this.noteTag).then(() => this.updateChildNotes());
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateChildNotes();
  }

  /** Callback to handle changing of additional attributes */
  public override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.updateChildNotes();
  }

  /** Updates ignored query for all child notes */
  protected updateChildNotes(): void {
    [...this.$host.querySelectorAll(this.noteTag)].filter(ESLNoteIgnore.isNote).forEach(($note) => $note.updateIgnoredQuery());
  }
}
