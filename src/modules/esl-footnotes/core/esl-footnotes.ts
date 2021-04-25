import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {ESLBaseElement, attr, jsonAttr, boolAttr} from '../../esl-base-element/core';
import {ESLNote} from '../../esl-note/core/esl-note';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {EventUtils} from '../../esl-utils/dom/events';

@ExportNs('Note')
export class ESLFootnotes extends ESLBaseElement {
  static is = 'esl-footnotes';
  static eventNs = 'esl:footnotes';

  protected _notesIndex: number;
  protected _notes: ESLNote[];

  constructor() {
    super();

    this._notes = [];
    this._notesIndex = 0;
  }

  protected connectedCallback() {
    super.connectedCallback();

    const root = TraversingQuery.first('::parent', this) as Element;
    root.addEventListener(`${ESLNote.eventNs}:ready`, this._handlerNoteSubscribe);

    EventUtils.dispatch(this, `${ESLFootnotes.eventNs}:ready`);
  }

  public update() {
    this.innerHTML = '';
    this.append(this.buildItems());
  }

  protected buildItems(): HTMLElement {
    const $items = document.createElement('ul');
    $items.className = 'esl-footnotes-items';
    this._notes.forEach((note) => $items.append(this.buildItem(note)));
    return $items;
  }

  protected buildItem(note: ESLNote): HTMLElement {
    const $item = document.createElement('li');
    $item.className = 'esl-footnotes-item';
    $item.setAttribute('data-order', `${note.index}`);
    $item.append(this.buildItemIndexEl(note.index));
    $item.append(this.buildItemTextEl(note.text));
    return $item;
  }

  protected buildItemIndexEl(index: number): HTMLElement {
    const $index = document.createElement('span');
    $index.className = 'esl-footnotes-index';
    $index.innerText = `${index}`;
    return $index;
  }

  protected buildItemTextEl(text: string): HTMLElement {
    const $text = document.createElement('span');
    $text.className = 'esl-footnotes-text';
    $text.innerText = `${text}`;
    return $text;
  }

  @bind
  protected _handlerNoteSubscribe(e: CustomEvent) {
    const note = e.target as ESLNote;
    this._notes.push(note);
    this._notesIndex++;
    note.index = this._notesIndex;
    note.update();
    this.update()

    e.stopPropagation();
  }
}
