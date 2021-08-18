import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {ESLTooltip} from '../../esl-tooltip/core';
import {EventUtils} from '../../esl-utils/dom/events';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {scrollIntoViewAsync} from '../../esl-utils/dom/scroll';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLFootnotes} from './esl-footnotes';

import type {ToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';

@ExportNs('Note')
export class ESLNote extends ESLBaseElement {
  static is = 'esl-note';

  /** Linked state marker */
  @boolAttr() public linked: boolean;

  /** Tooltip state marker */
  @boolAttr() public tooltipShown: boolean;

  /** Tooltip content */
  @attr() public html: string;

  /** Click event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackClick: string;
  /** Hover event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackHover: string;

  protected _$footnotes: ESLFootnotes | null;
  protected _index: number;

  /** Marker to allow track hover */
  public get allowHover() {
    return DeviceDetector.hasHover && ESLMediaQuery.for(this.trackHover).matches;
  }
  /** Marker to allow track clicks */
  public get allowClick() {
    return ESLMediaQuery.for(this.trackClick).matches;
  }

  static get observedAttributes() {
    return ['tooltip-shown'];
  }

  get index(): number {
    return this._index;
  }

  @ready
  protected connectedCallback() {
    if (!this.html) {
      this.html = this.innerHTML;
    }
    super.connectedCallback();
    this.bindEvents();
    this._sendResponseToFootnote();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
    this._$footnotes?.unlinkNote(this);
    this.restore();
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'tooltip-shown' && newVal === null) {
      this._$footnotes?.turnOffHighlight(this);
    }
  }

  protected bindEvents() {
    document.body.addEventListener(`${ESLFootnotes.eventNs}:request`, this._onFootnotesReady);
    this.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('mouseenter', this._onMouseEnter);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }
  protected unbindEvents() {
    document.body.removeEventListener(`${ESLFootnotes.eventNs}:request`, this._onFootnotesReady);
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('mouseleave', this._onMouseLeave);
  }

  public activate() {
    scrollIntoViewAsync(this, {behavior: 'smooth', block: 'nearest'}).then(() => this.showTooltip());
  }

  public highlight(enable: boolean = true) {
    this.classList.toggle('highlight', enable);
  }

  public link(footnotes: ESLFootnotes, index: number) {
    this.linked = true;
    this._$footnotes = footnotes;
    this.setIndex(index);
    this.tabIndex = 0;
  }

  public unlink() {
    this.restore();
    this._sendResponseToFootnote();
  }

  public setIndex(index: number) {
    this._index = index;
    this.innerHTML = `${index}`;
  }

  protected restore() {
    this.linked = false;
    this._$footnotes = null;
    this.innerHTML = this.html;
    this.tabIndex = -1;
  }

  /** Merge params to pass to the toggleable */
  protected mergeToggleableParams(this: ESLNote, ...params: ToggleableActionParams[]) {
    return Object.assign({
      initiator: 'note',
      activator: this,
      html: this.html
    }, ...params);
  }

  /** Show tooltip with passed params */
  public showTooltip(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
    }, params);
    ESLTooltip.show(actionParams);
    this.highlight();
  }
  /** Hide tooltip with passed params */
  public hideTooltip(params: ToggleableActionParams = {}) {
    const actionParams = this.mergeToggleableParams({
    }, params);
    ESLTooltip.hide(actionParams);
  }
  /** Toggles tooltip with passed params */
  public toggleTooltip(params: ToggleableActionParams = {}, state: boolean = !this.tooltipShown) {
    state ? this.showTooltip(params) : this.hideTooltip(params);
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
  protected _onFootnotesReady(e: CustomEvent) {
    if (this.linked) return;
    this._sendResponseToFootnote();
  }

  protected _sendResponseToFootnote() {
    EventUtils.dispatch(this, `${ESLFootnotes.eventNs}:response`);
  }
}

declare global {
  export interface ESLLibrary {
    Note: typeof ESLNote;
  }
  export interface HTMLElementTagNameMap {
    'esl-note': ESLNote;
  }
}
