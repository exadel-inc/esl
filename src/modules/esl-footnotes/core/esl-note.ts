import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseTrigger} from '../../esl-trigger/core/esl-base-trigger';
import {ready, attr, prop, boolAttr, memoize, listen} from '../../esl-utils/decorators';
import {ESLTooltip} from '../../esl-tooltip/core';
import {promisifyTimeout, repeatSequence} from '../../esl-utils/async';
import {scrollIntoView} from '../../esl-utils/dom/scroll';
import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';

import type {ESLToggleable, ESLToggleableActionParams} from '../../esl-toggleable/core/esl-toggleable';
import type {ESLFootnotes} from './esl-footnotes';
import type {ESLTooltipActionParams} from '../../esl-tooltip/core/esl-tooltip';
import type {IMediaQueryCondition} from '../../esl-media-query/core/conditions/media-query-base';

@ExportNs('Note')
export class ESLNote extends ESLBaseTrigger {
  public static override is = 'esl-note';
  public static observedAttributes = ['ignore'];

  /** Timeout before activating note (to have time to show content with this note) */
  public static readonly activateTimeout = 100;

  /** Event to request acknowledgment from {@link ESLNotes} instances */
  @prop('esl:footnotes:request') public FOOTNOTE_REQUEST_EVENT: string;
  /** Event to acknowledge {@link ESLFootnotes} instance about footnote */
  @prop('esl:footnotes:response') public FOOTNOTE_RESPONSE_EVENT: string;

  /** {@link ESLMediaQuery} to specify that footnotes must ignore this note. Default: `not all` */
  @attr({defaultValue: 'not all'}) public ignore: string;

  /** Tooltip content */
  @attr() public html: string;
  /**
   * Note label in stand-alone mode (detached from footnotes),
   * in the connected state it is a numeric index that is calculated automatically
   */
  @attr({defaultValue: '*'}) public standaloneLabel: string;

  /** Hover event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public override trackHover: string;

  /** Target to container element {@link ESLTraversingQuery} to define bounds of tooltip visibility (window by default) */
  @attr() public container: string;

  /** margin around the element that is used as the viewport for checking the visibility of the note tooltip */
  @attr({defaultValue: '0px'}) public intersectionMargin: string;

  /** Linked state marker */
  @boolAttr({readonly: true}) public linked: boolean;
  /** Standalone state marker */
  @boolAttr({readonly: true}) public standalone: boolean;

  protected _$footnotes: ESLFootnotes | null;
  protected _index: number;

  /** Target observable Toggleable */
  public override get $target(): ESLToggleable {
    return ESLTooltip.sharedInstance;
  }

  /** Marker to allow footnotes to pick up this note */
  public get allowFootnotes(): boolean {
    return !this.queryToIgnore.matches;
  }

  /** Note index in the scope content */
  public get index(): number {
    return this._index;
  }
  public set index(value: number) {
    this._index = value;
    this.innerHTML = this.renderedHTML;
  }

  /** Note index in the displayed list of footnotes */
  public get renderedIndex(): string {
    return this.allowFootnotes ? `${this._index}` : this.standaloneLabel;
  }

  /** Note markup */
  protected get renderedHTML(): string {
    const index = this.renderedIndex;
    if (!this._$footnotes) return index;
    const footnotesIndexId = `${this._$footnotes.id}-${index}`;
    return `<a class="esl-note-link" href="#${footnotesIndexId}" tabindex="-1">${index}</a>`;
  }

  /** Query to describe conditions to ignore note by footnotes  */
  @memoize()
  public get queryToIgnore(): IMediaQueryCondition {
    const ignore = this.getClosestRelatedAttr('ignore') || this.ignore;
    return ESLMediaQuery.for(ignore);
  }

  /** The text writing directionality of the element */
  protected get currentDir(): string {
    return getComputedStyle(this).direction;
  }

  /** The base language of the element */
  protected get currentLang(): string {
    const el = this.closest('[lang]');
    return el ? (el as HTMLElement).lang : '';
  }

  /** Checks that the target is in active state */
  public override get isTargetActive(): boolean {
    return this.$target.open && this.$target.activator === this;
  }

  @ready
  protected override connectedCallback(): void {
    this.init();
    super.connectedCallback();
    this._sendResponseToFootnote();
  }

  @ready
  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._$footnotes?.unlinkNote(this);
    this.restore();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'ignore') {
      this.updateIgnoredQuery();
    }
  }

  /** Revises the settings for ignoring the note */
  public updateIgnoredQuery(): void {
    memoize.clear(this, 'queryToIgnore');
    this.$$on(this._onIgnoreConditionChange);
    this._onIgnoreConditionChange();
  }

  /** Gets attribute value from the closest element with group behavior settings */
  protected getClosestRelatedAttr(attrName: string): string | null {
    const relatedAttrName = `${this.baseTagName}-${attrName}`;
    const $closest = this.closest(`[${relatedAttrName}]`);
    return $closest ? $closest.getAttribute(relatedAttrName) : null;
  }

  /** Activates note */
  public activate(): void {
    this.hideTarget();
    this.$$fire('esl:show:request');
    // TODO: replace timeout with a more reliable mechanism to have time to show content with this note
    repeatSequence(async () => {
      await promisifyTimeout((this.constructor as typeof ESLNote).activateTimeout);
      await scrollIntoView(this, {behavior: 'smooth', block: 'center'});
      return this.$target.open || this.showTarget();
    }, 3);
  }

  /** Highlights note */
  public highlight(enable: boolean = true): void {
    this.classList.toggle('highlight', enable);
  }

  /** Links note with footnotes */
  public link(footnotes: ESLFootnotes, index: number): void {
    this.$$attr('linked', true);
    this._$footnotes = footnotes;
    this.index = index;
    this.tabIndex = 0;
    this.update();
  }

  /** Unlinks note from footnotes */
  public unlink(): void {
    this.restore();
    this.update();
    this._sendResponseToFootnote();
  }

  /** Updates note state */
  public update(): void {
    this.$$attr('standalone', !(this.linked && this.allowFootnotes));
  }

  /** Initial initialization of the element during the connection to DOM */
  protected init(): void {
    this.html = this.html || this.innerHTML;
    memoize.clear(this, 'queryToIgnore');
    this.index = 0;
    this.$$attr('linked', false);
    this.update();
  }

  /** Restores original note content after unlinking */
  protected restore(): void {
    this.$$attr('linked', false);
    this._$footnotes = null;
    this.index = 0;
    this.tabIndex = -1;
  }

  /** Merge params to pass to the toggleable */
  protected override mergeToggleableParams(this: ESLNote, ...params: ESLTooltipActionParams[]): ESLTooltipActionParams {
    const container = this.getClosestRelatedAttr('container') || this.container;
    const containerEl = container ? ESLTraversingQuery.first(container, this) as HTMLElement : undefined;
    return super.mergeToggleableParams({
      initiator: 'note',
      activator: this,
      containerEl,
      html: this.html,
      dir: this.currentDir,
      lang: this.currentLang,
      intersectionMargin: this.intersectionMargin
    }, ...params);
  }

  /** Show target toggleable with passed params */
  public override showTarget(params: ESLToggleableActionParams = {}): void {
    super.showTarget(params);
    this.highlight();
  }

  /** Actions on breakpoint changing */
  @listen({
    event: 'change',
    target: (el: ESLNote) => el.queryToIgnore
  })
  protected _onIgnoreConditionChange(): void {
    this.hideTarget();
    this.innerHTML = this.renderedHTML;
    this.update();
    this._$footnotes?.update();
  }

  /** Handles footnotes request event */
  @listen({
    event: (el: ESLNote) => el.FOOTNOTE_REQUEST_EVENT,
    target: document.body
  })
  protected _onFootnotesReady(e: CustomEvent): void {
    if (this.linked) return;
    this._sendResponseToFootnote();
  }

  /** Handles ESLNote state change */
  @listen({
    event: 'esl:hide',
    target: (that: ESLNote) => that.$target
  })
  protected _onTargetHide(): void {
    if (!this.isTargetActive) this._$footnotes?.turnOffHighlight(this);
  }

  /** Handles ESLNote state change */
  @listen({
    event: 'esl:before:show',
    target: (that: ESLNote) => that.$target
  })
  protected _onBeforeTargetShow(): void {
    if (this.isTargetActive) this._$footnotes?.turnOffHighlight(this);
  }

  /** Sends the response to footnotes */
  protected _sendResponseToFootnote(): void {
    this.$$fire(this.FOOTNOTE_RESPONSE_EVENT);
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
