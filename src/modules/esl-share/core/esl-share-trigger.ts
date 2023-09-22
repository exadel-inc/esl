import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, jsonAttr, listen} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {ESLMediaQuery} from '../../esl-media-query/core';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLSharePopup} from './esl-share-popup';

import type {ESLSharePopupActionParams} from './esl-share-popup';

/**
 * ESLShareTrigger component
 * @author Dmytro Shovchko
 *
 * ESLShareTrigger is an component that allows triggering {@link ESLSharePopup} instance state changes.
 */
export class ESLShareTrigger extends ESLBaseElement {
  public static override is = 'esl-share-trigger';

  /**
   * List of social networks or groups of them to display (all by default).
   * The value - a string containing the names of the buttons or groups (specified with
   * the prefix group:) separated by spaces.
   * @example "facebook reddit group:default"
   * */
  @attr({defaultValue: 'all'}) public list: string;
  /** Popup state marker */
  @boolAttr() public popupShown: boolean;
  /** Click event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackClick: string;
  /** Hover event tracking media query. Default: `all` */
  @attr({defaultValue: 'all'}) public trackHover: string;

  /** Default initial params to pass into the popup */
  @jsonAttr<ESLSharePopupActionParams>({defaultValue: {
    position: 'top',
    hideDelay: 220
  }}) public popupInitialParams: ESLSharePopupActionParams;

  /** Marker to allow track hover */
  public get allowHover(): boolean {
    return DeviceDetector.hasHover && ESLMediaQuery.for(this.trackHover).matches;
  }
  /** Marker to allow track clicks */
  public get allowClick(): boolean {
    return ESLMediaQuery.for(this.trackClick).matches;
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
  protected get containerEl(): HTMLElement | undefined {
    const container = this.getClosestRelatedAttr('container');
    return container ? ESLTraversingQuery.first(container, this) as HTMLElement : undefined;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.initA11y();
  }

  /** Gets attribute value from the closest element with group behavior settings */
  protected getClosestRelatedAttr(attrName: string): string | null {
    const relatedAttrName = `${this.baseTagName}-${attrName}`;
    const $closest = this.closest(`[${relatedAttrName}]`);
    return $closest ? $closest.getAttribute(relatedAttrName) : null;
  }

  /** Sets initial a11y attributes */
  public initA11y(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (this.getAttribute('role') === 'button' && !this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /** Merge params to pass to the toggleable */
  protected mergeToggleableParams(this: ESLShareTrigger, ...params: ESLSharePopupActionParams[]): ESLSharePopupActionParams {
    const {list, containerEl, currentDir: dir, currentLang: lang} = this;
    return Object.assign({
      initiator: 'share',
      activator: this,
      containerEl,
      list,
      dir,
      lang
    }, this.popupInitialParams, ...params);
  }

  /** Shows popup with passed params */
  public showPopup(params: ESLSharePopupActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({}, params);
    if (ESLSharePopup.open) this.hidePopup();
    ESLSharePopup.show(actionParams);
  }
  /** Hides popup with passed params */
  public hidePopup(params: ESLSharePopupActionParams = {}): void {
    const actionParams = this.mergeToggleableParams({}, params);
    ESLSharePopup.hide(actionParams);
  }
  /** Toggles popup with passed params */
  public togglePopup(params: ESLSharePopupActionParams = {}, state: boolean = !this.popupShown): void {
    state ? this.showPopup(params) : this.hidePopup(params);
  }

  /** Handles `click` event */
  @listen('click')
  protected _onClick(event: MouseEvent): void {
    if (!this.allowClick) return;
    event.preventDefault();
    event.stopPropagation();
    return this.togglePopup({event});
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if (![ENTER, SPACE].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    return this.togglePopup({event});
  }

  /** Handles hover `mouseenter` event */
  @listen('mouseenter')
  protected _onMouseEnter(event: MouseEvent): void {
    if (!this.allowHover) return;
    this.showPopup({event});
    event.preventDefault();
  }

  /** Handles hover `mouseleave` event */
  @listen('mouseleave')
  protected _onMouseLeave(event: MouseEvent): void {
    if (!this.allowHover) return;
    this.hidePopup({event, trackHover: true});
    event.preventDefault();
  }
}

declare global {
  export interface ESLLibrary {
    ShareTrigger: typeof ESLShareTrigger;
  }
  export interface HTMLElementTagNameMap {
    'esl-share-trigger': ESLShareTrigger;
  }
}
