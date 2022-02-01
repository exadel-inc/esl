import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {ready} from '../../esl-utils/decorators/ready';

@ExportNs('NoteGroup')
export class ESLNoteGroup extends ESLBaseElement {
  static is = 'esl-note-group';
  static readonly noteTag: string = 'esl-note';

  static readonly attributes: string[] = ['container', 'ignore-footnotes'];

  /** Array of child notes */
  public get notes(): HTMLElement[] {
    return Array.from(this.querySelectorAll((this.constructor as typeof ESLNoteGroup).noteTag));
  }

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    this.propagateAttributes();
  }

  /** Propagates attributes values from the list to all child notes */
  protected propagateAttributes(): void {
    const attrs = (this.constructor as typeof ESLNoteGroup).attributes;
    this.notes.forEach((el) => {
      attrs.forEach((attrName) => {
        const value = this.getAttribute(attrName);
        if (value === null) return;
        el.setAttribute(attrName, value);
      });
    });
  }
}

declare global {
  export interface ESLLibrary {
    NoteGroup: typeof ESLNoteGroup;
  }
  export interface HTMLElementTagNameMap {
    'esl-note-group': ESLNoteGroup;
  }
}
