import {ESLMixinElement} from '../../esl-mixin-element/core';
import {prop} from '../../esl-utils/decorators';

import type {ESLNote} from './esl-note';

export class ESLNoteIgnore extends ESLMixinElement {
  static is = 'esl-note-ignore';
  static observedAttributes: string[] = [ESLNoteIgnore.is];

  /** Selector to find all dependent ESLNote elements */
  @prop('esl-note') protected noteSelector: string;

  /** Callback to handle changing of additional attributes */
  public override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    [...this.$host.querySelectorAll<ESLNote>(this.noteSelector)].forEach(($note) => $note.updateIgnoredQuery());
  }
}
