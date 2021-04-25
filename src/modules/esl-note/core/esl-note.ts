import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {ESLBaseElement, attr, jsonAttr, boolAttr} from '../../esl-base-element/core';
import {ESLFootnotes} from '../../esl-footnotes/core/esl-footnotes';
import {EventUtils} from '../../esl-utils/dom/events';

@ExportNs('Note')
export class ESLNote extends ESLBaseElement {
  static is = 'esl-note';
  static eventNs = 'esl:note';

  protected _index: number;
  protected _text: string;

  constructor() {
    super();
    this._text = this.innerText;
  }

  get index(): number {
    return this._index;
  }

  set index(val: number) {
    this._index = val;
  }

  get text() {
    return this._text;
  }

  protected connectedCallback() {
    super.connectedCallback();

    EventUtils.dispatch(this, `${ESLNote.eventNs}:ready`);
    document.body.addEventListener(`${ESLFootnotes.eventNs}:ready`, this._handlerFootnotesReady);
  }

  update() {
    this.innerHTML = `${this._index}`;
  }

  @bind
  protected _handlerFootnotesReady(e: CustomEvent) {
    EventUtils.dispatch(this, `${ESLNote.eventNs}:ready`);
  }
}
