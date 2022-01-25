import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {ready} from '../../esl-utils/decorators/ready';

import type {ESLNote} from './esl-note';

interface Attribute {
  name: string;
  value: string;
}

@ExportNs('NoteGroup')
export class ESLNoteGroup extends ESLBaseElement {
  static is = 'esl-note-group';
  static readonly noteTag: string = 'esl-note';

  static get observedAttributes(): string[] {
    return ['container', 'ignore-footnotes'];
  }

  /** Target to container element {@link TraversingQuery} to define bounds of tooltip visibility (window by default) */
  @attr({defaultValue: null}) public container: string;

  /** Media query to specify that footnotes must ignore this note */
  @attr({defaultValue: null}) public ignoreFootnotes: string;

  /** Tag name of the note element */
  protected get _childTagName(): string {
    return (this.constructor as typeof ESLNoteGroup).noteTag;
  }

  /** Array of child notes */
  public get notes(): ESLNote[] {
    return Array.from(this.querySelectorAll(this._childTagName));
  }

  protected get _containerAttr(): Attribute {
    return this._getAttr('container', this.container);
  }
  protected get _ignoreFootnotesAttr(): Attribute {
    return this._getAttr('ignore-footnotes', this.ignoreFootnotes);
  }
  protected _getAttr(name: string, value: string): Attribute {
    return {name, value};
  }

  @ready
  protected connectedCallback(): void {
    this.propagateAttributes([
      this._containerAttr,
      this._ignoreFootnotesAttr
    ]);
    super.connectedCallback();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'container') {
      this.propagateAttributes([this._containerAttr]);
    }
    if (attrName === 'ignore-footnotes') {
      this.propagateAttributes([this._ignoreFootnotesAttr]);
    }
  }

  /** Propagates attributes values from the list to all child notes */
  protected propagateAttributes(attributes: Attribute[]): void {
    this.notes.forEach((note): void => {
      attributes.forEach((attribute): void => {
        const {name, value} = attribute;
        if (value === null) return;
        if (value) {
          note.setAttribute(name, value);
        } else {
          note.removeAttribute(name);
        }
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
