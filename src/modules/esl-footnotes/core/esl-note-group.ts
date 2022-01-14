import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {ready} from '../../esl-utils/decorators/ready';

import type {ESLNote} from './esl-note';

@ExportNs('NoteGroup')
export class ESLNoteGroup extends ESLBaseElement {
  static is = 'esl-note-group';
  static readonly noteTag: string = 'esl-note';

  static get observedAttributes() {
    return ['ignore-footnotes'];
  }

  /** Media query to specify that footnotes must ignore this note */
  @attr() public ignoreFootnotes: string;

  /** Tag name of the note element */
  protected get _childTagName(): string {
    return (this.constructor as typeof ESLNoteGroup).noteTag;
  }

  /** Array of child notes */
  public get notes(): ESLNote[] {
    return Array.from(this.querySelectorAll(this._childTagName));
  }

  @ready
  protected connectedCallback(): void {
    this.propagateIgnoreFootnotes();
    super.connectedCallback();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'ignore-footnotes') {
      this.propagateIgnoreFootnotes();
    }
  }

  /** Propagates ignore-footnotes attribute to all child notes */
  protected propagateIgnoreFootnotes(): void {
    this.propagateAttribute('ignore-footnotes', this.ignoreFootnotes);
  }

  /** Propagates attribute value to all child notes */
  protected propagateAttribute(name: string, value: string): void {
    this.notes.forEach((note): void => {
      if (value) {
        note.setAttribute(name, value);
      } else {
        note.removeAttribute(name);
      }
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
