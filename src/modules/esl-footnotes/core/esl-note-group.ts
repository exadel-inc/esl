import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {ready} from '../../esl-utils/decorators/ready';

@ExportNs('NoteGroup')
export class ESLNoteGroup extends ESLBaseElement {
  static is = 'esl-note-group';
  static readonly noteTag: string = 'esl-note';

  static get observedAttributes(): string[] {
    return ['container', 'ignore-footnotes'];
  }

  /** Tag name of the note element */
  protected get _childTagName(): string {
    return (this.constructor as typeof ESLNoteGroup).noteTag;
  }

  /** Array of child notes */
  public get notes(): HTMLElement[] {
    return Array.from(this.querySelectorAll(this._childTagName));
  }

  @ready
  protected connectedCallback(): void {
    super.connectedCallback();
    this.propagateAttributes();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    this.getControlledNotes(attrName)
      .forEach((el) => newVal !== null ? el.setAttribute(attrName, newVal) : el.removeAttribute(attrName));
  }

  /** Gets an array of controlled child notes */
  protected getControlledNotes(attrName?: string): HTMLElement[] {
    const attrSel = attrName ? `[${attrName}]` : '';
    const groupSel = (this.constructor as typeof ESLNoteGroup).is + attrSel;
    return this.notes.filter((note) => note.closest(groupSel) === this);
  }

  /** Propagates attributes values from the list to all child notes */
  protected propagateAttributes(): void {
    const attrs = (this.constructor as typeof ESLNoteGroup).observedAttributes;
    attrs.forEach((attrName) => {
      const value = this.getAttribute(attrName);
      if (value === null) return;
      this.getControlledNotes(attrName)
        .forEach((el) => el.setAttribute(attrName, value));
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
