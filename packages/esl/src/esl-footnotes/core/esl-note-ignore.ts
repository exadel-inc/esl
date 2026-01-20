import {ESLMixinElement} from '../../esl-mixin-element/core';
import {prop} from '../../esl-utils/decorators';

import type {ESLNote} from './esl-note';

/**
 * Optional mixin element to support esl-note-ignore attribute dynamic changes
 */
export class ESLNoteIgnore extends ESLMixinElement {
  public static override is = 'esl-note-ignore';

  /** Selector to find all dependent ESLNote elements */
  @prop('esl-note') protected noteSelector: string;

  public override connectedCallback(): void {
    super.connectedCallback();
    this.updateChildNotes();
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
    [...this.$host.querySelectorAll<ESLNote>(this.noteSelector)].forEach(($note) => $note.updateIgnoredQuery());
  }
}
