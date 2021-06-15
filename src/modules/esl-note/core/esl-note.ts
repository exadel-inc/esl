import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {attr, boolAttr} from '../../esl-base-element/core';
import {ESLTrigger} from '../../esl-trigger/core';
import {ESLTooltip} from '../../esl-tooltip/core';
import {ESLFootnotes} from '../../esl-footnotes/core/esl-footnotes';
import {EventUtils} from '../../esl-utils/dom/events';

@ExportNs('Note')
export class ESLNote extends ESLTrigger {
  static is = 'esl-note';
  static eventNs = 'esl:note';

  /** Linked state marker */
  @boolAttr() public linked: boolean;

  @attr({defaultValue: 'toggle'}) public mode: string;
  @attr({defaultValue: 'hover'}) public event: string;

  public target = 'body';

  protected _$footnotes: ESLFootnotes | null;
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

  protected disconnectedCallback() {
    super.disconnectedCallback();

    if (this._$footnotes) {
      this._$footnotes.unlinkNote(this);
    }
  }

  link(footnotes: ESLFootnotes, index: number) {
    this.linked = true;
    this._$footnotes = footnotes;
    this.index = index;
    this.innerHTML = `${this.index}`;
  }

  unlink() {
    this.linked = false;
    this._$footnotes = null;
    this.innerText = this.text;
    EventUtils.dispatch(this, `${ESLNote.eventNs}:ready`);
  }

  @bind
  protected _handlerFootnotesReady(e: CustomEvent) {
    if (!this.linked) {
      EventUtils.dispatch(this, `${ESLNote.eventNs}:ready`);
    }
  }

  /** Handles trigger open type of event */
  @bind
  protected _onShowEvent(event: Event) {
    if (this._isIgnored(event.target)) return;
    ESLTooltip.show({
      activator: this,
      delay: this.showDelayValue,
      text: this.text,
      //behavior: 'none',
      //disableArrow: true,
      event
    });
    event.preventDefault();
  }

  /** Handles trigger hide type of event */
  @bind
  protected _onHideEvent(event: Event) {
    if (this._isIgnored(event.target)) return;
    ESLTooltip.hide({
      activator: this,
      delay: this.hideDelayValue,
      event
    });
    event.preventDefault();
  }
}
