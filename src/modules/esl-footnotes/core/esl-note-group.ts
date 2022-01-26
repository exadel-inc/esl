import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {ready} from '../../esl-utils/decorators/ready';

const setAttribute = ($el: HTMLElement, attrName: string, attrValue: string | null): void => {
  if (attrValue !== null) {
    $el.setAttribute(attrName, attrValue);
  } else {
    $el.removeAttribute(attrName);
  }
};

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
    this.notes.forEach((el) => setAttribute(el, attrName, newVal));
  }

  /** Propagates attributes values from the list to all child notes */
  protected propagateAttributes(): void {
    const attrs = (this.constructor as typeof ESLNoteGroup).observedAttributes;
    this.notes.forEach((el): void => {
      attrs.forEach((attrName) => {
        const value = this.getAttribute(attrName);
        setAttribute(el, attrName, value);
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
