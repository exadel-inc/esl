import {ExportNs} from '../../esl-utils/environment/export-ns';
import {bind} from '../../esl-utils/decorators/bind';
import {attr, boolAttr} from '../../esl-base-element/core';
import {ESLTrigger} from '../../esl-trigger/core';
import {ESLTooltip} from '../../esl-tooltip/core';
import {ESLFootnotes} from '../../esl-footnotes/core/esl-footnotes';
import {EventUtils} from '../../esl-utils/dom/events';

import type {ToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

@ExportNs('Note')
export class ESLNote extends ESLTrigger {
  static is = 'esl-note';
  static eventNs = 'esl:note';

  /** Linked state marker */
  @boolAttr() public linked: boolean;

  @attr({defaultValue: 'toggle'}) public mode: string;
  @attr({defaultValue: 'all'}) public trackClick: string;
  @attr({defaultValue: 'all'}) public trackHover: string;

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

  public static parseDelayValue2(delay: string): number | undefined {
    return isNaN(+delay) ? undefined : +delay;
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

  /** Show target toggleable with passed params */
  public showTarget(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
      delay: ESLNote.parseDelayValue2(this.showDelay),
      text: this.text,
      behavior: 'none',
      disableArrow: true,
    }, params);
    ESLTooltip.show(actionParams);
  }

  /** Hide target toggleable with passed params */
  public hideTarget(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
      delay: ESLNote.parseDelayValue2(this.hideDelay)
    }, params);
    ESLTooltip.hide(actionParams);
  }

}
