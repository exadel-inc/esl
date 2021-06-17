import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {ESLNote} from '../../esl-note/core';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {EventUtils} from '../../esl-utils/dom/events';

@ExportNs('Footnotes')
export class ESLFootnotes extends ESLBaseElement {
  static is = 'esl-footnotes';
  static eventNs = 'esl:footnotes';

  /** Target element {@link TraversingQuery} to define scope */
  @attr({defaultValue: '::parent'}) public scopeTarget: string;

  protected _notes: ESLNote[] = [];

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
      this.scopeEl.addEventListener(`${ESLNote.eventNs}:ready`, this._onNoteSubscribe);
    }
    this.addEventListener('click', this._onClick);
  }
  protected unbindEvents() {
    if (this.scopeEl) {
      this.scopeEl.removeEventListener(`${ESLNote.eventNs}:ready`, this._onNoteSubscribe);
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
    this.innerHTML = this.buildItems();
  }

  protected buildItems(): string {
    const items = this._notes.map((note) => this.buildItem(note)).join('');
    return `<ul class="esl-footnotes-items">${items}</ul>`;
  }

  protected buildItem(note: ESLNote): string {
    const item = `${this.buildItemIndex(note.index)}${this.buildItemText(note.html)}${this.buildItemBack()}`;
    return `<li class="esl-footnotes-item" data-order="${note.index}">${item}</li>`;
  }

  protected buildItemIndex(index: number): string {
    return `<span class="esl-footnotes-index">${index}</span>`;
  }

  protected buildItemText(text: string): string {
    return `<span class="esl-footnotes-text">${text}</span>`;
  }

  protected buildItemBack(): string {
    return '<span class="esl-footnotes-back-to-note" tabindex="0"></span>';
  }

  @bind
  protected _onNoteSubscribe(e: CustomEvent) {
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
      note?.activate();
    }
  }
}
