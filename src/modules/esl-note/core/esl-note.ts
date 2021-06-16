import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {ESLTooltip} from '../../esl-tooltip/core';
import {ESLFootnotes} from '../../esl-footnotes/core/esl-footnotes';
import {EventUtils} from '../../esl-utils/dom/events';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {ESLMediaQuery} from '../../esl-media-query/core';

import type {ToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

@ExportNs('Note')
export class ESLNote extends ESLBaseElement {
  static is = 'esl-note';
  static eventNs = 'esl:note';

  /** Linked state marker */
  @boolAttr() public linked: boolean;

  /** @readonly Observed Toggleable active state marker */
  @boolAttr({readonly: true}) public active: boolean;

  /** Click event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackClick: string;
  /** Hover event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackHover: string;

  protected _$footnotes: ESLFootnotes | null;
  protected _index: number;
  protected _text: string;

  /** Marker to allow track hover */
  public get allowHover() {
    return DeviceDetector.hasHover && ESLMediaQuery.for(this.trackHover).matches;
  }
  /** Marker to allow track clicks */
  public get allowClick() {
    return ESLMediaQuery.for(this.trackClick).matches;
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

  @ready
  protected connectedCallback() {
    this._text = this.innerText;

    super.connectedCallback();

    EventUtils.dispatch(this, `${ESLNote.eventNs}:ready`);
    document.body.addEventListener(`${ESLFootnotes.eventNs}:ready`, this._handlerFootnotesReady);
    this.bindEvents();
  }

  @ready
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();

    if (this._$footnotes) {
      this._$footnotes.unlinkNote(this);
    }
  }

  protected bindEvents() {
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }
  protected unbindEvents() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('mouseleave', this._onMouseLeave);
  }

  public link(footnotes: ESLFootnotes, index: number) {
    this.linked = true;
    this._$footnotes = footnotes;
    this.index = index;
    this.innerHTML = `${this.index}`;
    this.tabIndex = 0;
  }

  public unlink() {
    this.linked = false;
    this._$footnotes = null;
    this.innerText = this.text;
    this.tabIndex = -1;
    EventUtils.dispatch(this, `${ESLNote.eventNs}:ready`);
  }

  /** Merge params to pass to the toggleable */
  protected mergeToggleableParams(this: ESLNote, ...params: ToggleableActionParams[]) {
    return Object.assign({
      initiator: 'note',
      activator: this
    }, ...params);
  }

  /** Show tooltip with passed params */
  public showTooltip(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
      text: this.text,
      // behavior: 'none',
      // disableArrow: true,
    }, params);
    ESLTooltip.show(actionParams);
  }
  /** Hide tooltip with passed params */
  public hideTooltip(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
    }, params);
    ESLTooltip.hide(actionParams);
  }
  /** Toggles tooltip with passed params */
  public toggleTooltip(params: ToggleableActionParams = {}, state: boolean = !this.active) {
    state ? this.showTooltip(params) : this.hideTooltip(params);
  }
  /** Toggles note active state */
  public updateState(newState: boolean) {
    this.toggleAttribute('active', newState);
  }

  /** Handles `click` event */
  @bind
  protected _onClick(event: MouseEvent) {
    if (!this.allowClick) return;
    event.preventDefault();
    return this.toggleTooltip({event});
  }

  /** Handles `keydown` event */
  @bind
  protected _onKeydown(event: KeyboardEvent) {
    if (![ENTER, SPACE].includes(event.key)) return;
    event.preventDefault();
    return this.toggleTooltip({event});
  }

  /** Handles hover `mouseenter` event */
  @bind
  protected _onMouseEnter(event: MouseEvent) {
    if (!this.allowHover) return;
    this.showTooltip({event});
    event.preventDefault();
  }

  /** Handles hover `mouseleave` event */
  @bind
  protected _onMouseLeave(event: MouseEvent) {
    if (!this.allowHover) return;
    this.hideTooltip({event, trackHover: true});
    event.preventDefault();
  }

  @bind
  protected _handlerFootnotesReady(e: CustomEvent) {
    if (!this.linked) {
      EventUtils.dispatch(this, `${ESLNote.eventNs}:ready`);
    }
  }

}
