import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, bind, boolAttr, jsonAttr} from '../../esl-utils/decorators';
import {ESLShareList} from './esl-share-list';
import {ESLSharePopupTrigger} from './esl-share-popup-trigger';
import {ESLShareConfig} from './esl-share-config';

import type {ESLSharePopupActionParams} from './esl-share-popup';

/**
 * ESLShare
 * @author Dmytro Shovchko
 *
 * ESLShare is a custom element to dynamically draw {@link ESLShareList}
 * or {@link ESLSharePopupTrigger} depending on the specified mode
 */
export class ESLShare extends ESLBaseElement {
  public static override is = 'esl-share';

  /** Register {@link ESLShare} component and dependent {@link ESLShareList} and {@link ESLSharePopupTrigger} */
  public static override register(): void {
    ESLShareList.register();
    ESLSharePopupTrigger.register();
    super.register();
  }

  /**
   * Updates the configuration with either a new config object or by using a configuration provider function.
   * Every button and group specified in the new config will be added to the current configuration.
   * @returns Promise of the current config
   * @deprecated alias for ESLShareConfig.set(), will be removed soon
   */
  public static readonly config = ESLShareConfig.set;

  /** Default initial params to pass into the popup trigger */
  @jsonAttr<ESLSharePopupActionParams>({defaultValue: {
    trackClick: true,
    trackHover: true
  }}) public triggerInitialParams: ESLSharePopupTrigger;

  /**
   * List of social networks or groups of them to display (all by default).
   * The value - a string containing the names of the buttons or groups (specified with
   * the prefix group:) separated by spaces.
   * @example "facebook reddit group:default"
   * */
  @attr({defaultValue: 'all'}) public list: string;
  /** URL to share (current page URL by default) */
  @attr() public shareUrl: string;
  /** Title to share (current document title by default) */
  @attr() public shareTitle: string;
  /** Rendering mode of the share buttons ('list' by default) */
  @attr() public mode: 'list' | 'popup';

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public ready: boolean;

  protected _content: string;

  public override connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

  /** Initializes the component */
  protected init(force?: boolean): void {
    if (this.ready && !force) return;
    if (!this.mode) this.mode = 'list';
    if (!this._content) this._content = this.innerHTML;
    this.buildContent();
    this.onReady();
  }

  /** Builds component's content. */
  @bind
  protected buildContent(): void {
    this.innerHTML = '';
    this.mode === 'list' ? this.appendList() : this.appendPopupTrigger();
  }

  /** Appends share list to the share component. */
  protected appendList(): void {
    const $list = ESLShareList.create();
    $list.list = this.list;
    this.appendChild($list);
  }

  /** Appends share popup trigger to the share component. */
  protected appendPopupTrigger(): void {
    const {list} = this;
    const $trigger = ESLSharePopupTrigger.create();
    Object.assign($trigger, this.triggerInitialParams, {list});
    $trigger.innerHTML = this._content;
    this.appendChild($trigger);
  }

  /** Actions on complete init and ready component. */
  private onReady(): void {
    this.$$attr('ready', true);
  }
}
