import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {EventUtils} from '../../esl-utils/dom/events';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {sequentialUID} from '../../esl-utils/misc/uid';
import {compileFootnotesGroupedList, compileFootnotesNongroupedList, sortFootnotes} from './esl-footnotes-data';

import type {ESLNote} from './esl-note';
import type {FootnotesItem} from './esl-footnotes-data';

@ExportNs('Footnotes')
export class ESLFootnotes extends ESLBaseElement {
  static is = 'esl-footnotes';
  static eventNs = 'esl:footnotes';

  /** Target element {@link TraversingQuery} to define scope */
  @attr({defaultValue: '::parent'}) public scopeTarget: string;

  /** Grouping note instances with identical content enable/disable */
  @attr({defaultValue: 'enable'}) public grouping: string;

  /** Label for 'return to note' button title */
  @attr({defaultValue: 'Back to note'}) public backToNoteLabel: string;

  protected _notes: ESLNote[] = [];

  @memoize()
  protected get scopeEl() {
    return TraversingQuery.first(this.scopeTarget, this) as HTMLElement;
  }

  protected get footnotesList(): FootnotesItem[] {
    this.reindex();
    return this.grouping !== 'enable'
      ? compileFootnotesNongroupedList(this._notes)
      : compileFootnotesGroupedList(this._notes);
  }

  public reindex() {
    this._notes = sortFootnotes(this._notes);
    this._notes.forEach((note, index) => note.index = index + 1);
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.bindEvents();
    this._sendRequestToNote();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();

    this.unbindEvents();
    this._notes.forEach((el) => el.unlink());
    this._notes = [];
  }

  protected bindEvents() {
    if (this.scopeEl) {
      this.scopeEl.addEventListener(`${ESLFootnotes.eventNs}:response`, this._onNoteSubscribe);
    }
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
  }
  protected unbindEvents() {
    if (this.scopeEl) {
      this.scopeEl.removeEventListener(`${ESLFootnotes.eventNs}:response`, this._onNoteSubscribe);
    }
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
  }

  public linkNote(note: ESLNote) {
    if (this._notes.includes(note)) return;
    this._notes.push(note);
    const index = +sequentialUID(ESLFootnotes.is, '');
    note.link(this, index);
  }

  public unlinkNote(note: ESLNote) {
    this._notes = this._notes.filter((el) => el !== note);
    this.update();
  }

  public update() {
    this.innerHTML = this.buildItems();
  }

  protected buildItems(): string {
    const items = this.footnotesList.map((footnote) => this.buildItem(footnote)).join('');
    return `<ul class="esl-footnotes-items">${items}</ul>`;
  }

  protected buildItem(footnote: FootnotesItem): string {
    const item = `${this.buildItemIndex(footnote)}${this.buildItemText(footnote)}${this.buildItemBack(footnote)}`;
    return `<li class="esl-footnotes-item" data-order="${footnote.index}">${item}</li>`;
  }

  protected buildItemIndex(footnote: FootnotesItem): string {
    return `<span class="esl-footnotes-index">${footnote.renderedIndex.join(', ')}</span>`;
  }

  protected buildItemText(footnote: FootnotesItem): string {
    return `<span class="esl-footnotes-text">${footnote.text}</span>`;
  }

  protected buildItemBack(footnote: FootnotesItem): string {
    return `<span class="esl-footnotes-back-to-note" tabindex="0" title="${this.backToNoteLabel}"></span>`;
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
      const orderAttr = target.closest('.esl-footnotes-item')?.getAttribute('data-order');
      const order = orderAttr?.split(',').map((item) => +item);
      order && this._onBackToNote(order);
    }
  }

  @bind
  protected _onKeydown(event: KeyboardEvent) {
    if ([ENTER, SPACE].includes(event.key)) this._onClick(event);
  }

  protected _onBackToNote(order: number[]) {
    const index = order[order.length - 1];
    this._notes.forEach((note) => {
      note.highlight(order.includes(note.index));
      if (note.index === index) {
        note.activate();
      }
    });
  }

  public turnOffHighlight(note: ESLNote) {
    this._notes
      .filter((item) => note.html === item.html)
      .forEach((item) => item.highlight(false));
  }

  protected _sendRequestToNote() {
    EventUtils.dispatch(this, `${ESLFootnotes.eventNs}:request`);
  }
}

declare global {
  export interface ESLLibrary {
    Footnotes: typeof ESLFootnotes;
  }
  export interface HTMLElementTagNameMap {
    'esl-footnotes': ESLFootnotes;
  }
}
