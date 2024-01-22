import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, jsonAttr, prop, ready} from '../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLBaseTrigger} from '../../esl-trigger/core';

import {ESLSharePopup} from './esl-share-popup';

import type {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';
import type {ESLSharePopupActionParams} from './esl-share-popup';
export type {ESLShareTagShape} from './esl-share.shape';

/**
 * ESLShare
 * @author Dmytro Shovchko
 *
 * ESLShare is a component that allows triggering {@link ESLSharePopup} instance state changes.
 */
@ExportNs('Share')
export class ESLShare extends ESLBaseTrigger {
  public static override is = 'esl-share';
  public static observedAttributes = ['list'];

  /** Register {@link ESLShare} component and dependent {@link ESLSharePopup} */
  public static override register(): void {
    ESLSharePopup.register();
    super.register();
  }

  /** Event to dispatch on {@link ESLShare} ready state */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  /**
   * List of social networks or groups of them to display (all by default).
   * The value - a string containing the names of the buttons or groups (specified with
   * the prefix `group:`) separated by spaces.
   * @example "facebook reddit group:default"
   * */
  @attr({defaultValue: 'all'}) public list: string;

  /** Hover event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public override trackHover: string;

  /** Action params to pass into the popup */
  @jsonAttr<ESLSharePopupActionParams>({defaultValue: {}})
  public popupParams: ESLSharePopupActionParams;

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;

  /** Target observable Toggleable */
  public override get $target(): ESLToggleable | null {
    return ESLSharePopup.sharedInstance;
  }

  /** Checks that the target is in active state */
  public override get isTargetActive(): boolean {
    return !!this.$target?.open && this.$target?.activator === this;
  }

  /** The text writing directionality of the element */
  protected get currentDir(): string {
    return getComputedStyle(this).direction;
  }

  /** The base language of the element */
  protected get currentLang(): string {
    const el = this.closest('[lang]');
    return (el) ? (el as HTMLElement).lang : '';
  }

  /** Container element that defines bounds of popups visibility */
  protected get $containerEl(): HTMLElement | undefined {
    const container = this.getClosestRelatedAttr('container');
    return container ? ESLTraversingQuery.first(container, this) as HTMLElement : undefined;
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    if (!this.ready) {
      this.$$attr('ready', true);
      this.$$fire(this.SHARE_READY_EVENT, {bubbles: false});
    }
  }

  protected override attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null): void {
    if (!this.connected || oldValue === newValue) return;
    this.update();
  }

  /** Updates the component and related popup */
  protected update(): void {
    if (!this.isTargetActive) return;
    this.$target?.hide();
  }

  /** Gets attribute value from the closest element with group behavior settings */
  protected getClosestRelatedAttr(attrName: string): string | null {
    const relatedAttrName = `${this.baseTagName}-${attrName}`;
    const $closest = this.closest(`[${relatedAttrName}]`);
    return $closest ? $closest.getAttribute(relatedAttrName) : null;
  }

  /** Merges params to pass to the toggleable */
  protected override mergeToggleableParams(this: ESLShare, ...params: ESLSharePopupActionParams[]): ESLSharePopupActionParams {
    return super.mergeToggleableParams({
      initiator: 'share',
      containerEl: this.$containerEl,
      list: this.list,
      dir: this.currentDir,
      lang: this.currentLang
    }, this.popupParams, ...params);
  }
}

declare global {
  export interface ESLLibrary {
    Share: typeof ESLShare;
  }
  export interface HTMLElementTagNameMap {
    'esl-share': ESLShare;
  }
}
