import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind, memoize, attr, listen, prop} from '../../esl-utils/decorators';
import {debounce} from '../../esl-utils/async/debounce';
import {ESLBaseElement} from '../../esl-base-element/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLEventUtils} from '../../esl-utils/dom/events';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {sequentialUID} from '../../esl-utils/misc/uid';
import {compileFootnotesGroupedList, compileFootnotesNongroupedList, sortFootnotes} from './esl-footnotes-data';

import type {ESLNote} from './esl-note';
import type {FootnotesItem} from './esl-footnotes-data';

@ExportNs('Footnotes')
export class ESLFootnotes extends ESLBaseElement {
  static override is = 'esl-footnotes';

  /** Event to request acknowledgment from {@link ESLNotes} instances */
  @prop('esl:footnotes:request') public FOOTNOTE_REQUEST_EVENT: string;
  /** Event to acknowledge {@link ESLFootnotes} instance about footnote */
  @prop('esl:footnotes:response') public FOOTNOTE_RESPONSE_EVENT: string;

  /** Target element {@link ESLTraversingQuery} to define scope */
  @attr({defaultValue: '::parent'}) public scopeTarget: string;

  /** Grouping note instances with identical content enable/disable */
  @attr({defaultValue: 'enable'}) public grouping: string;

  /** Label for 'return to note' button title */
  @attr({defaultValue: 'Back to note'}) public backToNoteLabel: string;

  protected _notes: ESLNote[] = [];
  protected deferredOnUpdate = debounce(() => this._onUpdate(), 150);

  /** Scope element */
  @memoize()
  protected get scopeEl(): HTMLElement {
    return ESLTraversingQuery.first(this.scopeTarget, this) as HTMLElement;
  }

  /** Notes that are allowed to be processed by footnotes */
  public get notes(): ESLNote[] {
    return this._notes.filter((note) => note.allowFootnotes);
  }

  /** List of notes to show */
  protected get footnotesList(): FootnotesItem[] {
    this.reindex();
    return this.grouping !== 'enable'
      ? compileFootnotesNongroupedList(this._notes)
      : compileFootnotesGroupedList(this._notes);
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    if (!this.id) {
      this.id = sequentialUID(this.baseTagName, this.baseTagName + '-');
    }

    this._notifyNotes();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();

    this._notes.forEach((el) => el.unlink());
    this._notes = [];
  }

  /** Adds the note to the footnotes list */
  public linkNote(note: ESLNote): void {
    if (this._notes.includes(note)) return;
    this._notes.push(note);
    const index = +sequentialUID(ESLFootnotes.is, '');
    note.link(this, index);
  }

  /** Reindexes the list of notes */
  public reindex(): void {
    this._sortNotes();
    this.notes.forEach((note, index) => note.index = index + 1);
  }

  /** Removes the note from the footnotes list */
  public unlinkNote(note: ESLNote): void {
    this._notes = this._notes.filter((el) => el !== note);
    this.deferredOnUpdate();
  }

  /** Updates the content of footnotes */
  public update(): void {
    this.deferredOnUpdate();
  }

  /** Sorts list of notes */
  protected _sortNotes(): void {
    this._notes = sortFootnotes(this._notes);
  }

  /** Builds content of footnotes */
  protected buildItems(): string {
    const items = this.footnotesList.map((footnote) => this.buildItem(footnote)).join('');
    return `<ul class="esl-footnotes-items">${items}</ul>`;
  }

  /** Builds one item from footnotes list */
  protected buildItem(footnote: FootnotesItem): string {
    const item = `${this.buildItemIndex(footnote)}${this.buildItemText(footnote)}${this.buildItemBack(footnote)}`;
    return `<li class="esl-footnotes-item" data-order="${footnote.index}">${item}</li>`;
  }

  /** Builds item index */
  protected buildItemIndex(footnote: FootnotesItem): string {
    return `<span class="esl-footnotes-index">${footnote.renderedIndex.map(this.buildWrappedItemIndex).join(', ')}</span>`;
  }

  /** Builds item index wrapped with span related to esl-note by id */
  @bind
  protected buildWrappedItemIndex(index: string): string {
    return `<span id="${this.id}-${index}">${index}</span>`;
  }

  /** Builds item text */
  protected buildItemText(footnote: FootnotesItem): string {
    return `<span class="esl-footnotes-text">${footnote.text}</span>`;
  }

  /** Builds item back-to-note button */
  protected buildItemBack(footnote: FootnotesItem): string {
    return `<span class="esl-footnotes-back-to-note" tabindex="0" title="${this.backToNoteLabel}"></span>`;
  }

  /** Actions on update footnotes */
  @bind
  protected _onUpdate(): void {
    this.innerHTML = this.buildItems();
  }

  /** Handles `response` event from note */
  @listen({
    event: (el: ESLFootnotes) => el.FOOTNOTE_RESPONSE_EVENT,
    target: (el: ESLFootnotes) => el.scopeEl
  })
  protected _onNoteSubscribe(e: CustomEvent): void {
    const note = e.target as ESLNote;
    this.linkNote(note);
    this.deferredOnUpdate();

    e.stopImmediatePropagation();
  }

  /** Handles `click` event */
  @listen({
    event: 'click',
    selector: '.esl-footnotes-back-to-note'
  })
  protected _onItemClick(e: MouseEvent | KeyboardEvent): void {
    const target = e.target as HTMLElement;
    const orderAttr = target.closest('.esl-footnotes-item')?.getAttribute('data-order');
    const order = orderAttr?.split(',').map((item) => +item);
    order && this._onBackToNote(order);

    e.preventDefault();
    e.stopPropagation();
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if ([ENTER, SPACE].includes(event.key)) this._onItemClick(event);
  }

  /** Actions on back-to-note click  */
  protected _onBackToNote(order: number[]): void {
    const index = order[order.length - 1];
    this.notes.forEach((note) => {
      note.highlight(order.includes(note.index));
      if (note.index === index) {
        note.activate();
      }
    });
  }

  /** Turns off highlight for notes with the same text */
  public turnOffHighlight(note: ESLNote): void {
    this._notes
      .filter((item) => note.html === item.html)
      .forEach((item) => item.highlight(false));
  }

  /**
   * Sends a request to all notes, expecting to get a response from
   * the unlinked ones and link up with them */
  protected _notifyNotes(): void {
    ESLEventUtils.dispatch(this, this.FOOTNOTE_REQUEST_EVENT);
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
