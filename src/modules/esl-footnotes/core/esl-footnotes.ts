import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {ESLNote} from '../../esl-note/core';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {EventUtils} from '../../esl-utils/dom/events';

@ExportNs('Note')
export class ESLFootnotes extends ESLBaseElement {
  static is = 'esl-footnotes';
  static eventNs = 'esl:footnotes';

  /** Target element {@link TraversingQuery} to define scope */
  @attr({defaultValue: '::parent'}) public scopeTarget: string;

  protected _notes: ESLNote[];

  constructor() {
    super();

    this._notes = [];
  }

  @memoize()
  protected get scopeEl() {
    return TraversingQuery.first(this.scopeTarget, this) as HTMLElement;
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.bindEvents();
    EventUtils.dispatch(this, `${ESLFootnotes.eventNs}:ready`);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();

    this.unbindEvents();
    this._notes.forEach((el) => el.unlink());
    this._notes = [];
  }

  protected bindEvents() {
    if (this.scopeEl) {
      this.scopeEl.addEventListener(`${ESLNote.eventNs}:ready`, this._handlerNoteSubscribe);
    }
    this.addEventListener('click', this._onClick);
  }
  protected unbindEvents() {
    if (this.scopeEl) {
      this.scopeEl.removeEventListener(`${ESLNote.eventNs}:ready`, this._handlerNoteSubscribe);
    }
    this.removeEventListener('click', this._onClick);
  }

  public linkNote(note: ESLNote) {
    const index = this._notes.push(note);
    note.link(this, index);
  }

  public unlinkNote(note: ESLNote) {
    this._notes = this._notes.filter((el) => el !== note);
    this._notes.forEach((el, index) => el.index = index + 1);
    this.update();
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
    $item.append(this.buildItemBack());
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

  protected buildItemBack(): HTMLElement {
    const $back = document.createElement('span');
    $back.className = 'esl-footnotes-back-to-note';
    $back.tabIndex = 0;
    return $back;
  }

  @bind
  protected _handlerNoteSubscribe(e: CustomEvent) {
    const note = e.target as ESLNote;
    this.linkNote(note);
    this.update();

    e.stopImmediatePropagation();
  }

  @bind
  protected _onClick(e: MouseEvent | KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains('esl-footnotes-back-to-note')) {
      const index = target.parentElement?.getAttribute('data-order');
      const note = index ? this._notes.find((el) => el.index === +index) : null;
      if (note) {
        note.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        note.showTooltip();
      }
    }
  }
}
