import {ESLBaseElement} from '../../esl-base-element/core';
import {isEqual} from '../../esl-utils/misc/object/compare';
import {attr, bind, boolAttr, jsonAttr, listen, memoize, prop} from '../../esl-utils/decorators';
import {ESLShareButton} from './esl-share-button';
import {ESLSharePopup} from './esl-share-popup';
import {ESLShareTrigger} from './esl-share-trigger';
import {ESLShareConfig} from './esl-share-config';

import type {ESLSharePopupActionParams} from './esl-share-popup';
import type {ESLShareButtonConfig} from './esl-share-config';

/**
 * ESLShare
 * @author Dmytro Shovchko
 *
 * ESLShare is a custom element to dynamically draw {@link ESLShareButton}s using simplified shared config
 */
export class ESLShare extends ESLBaseElement {
  public static override is = 'esl-share';

  /** Register {@link ESLShare} component and dependent {@link ESLShareButton} */
  public static override register(): void {
    ESLShareButton.register();
    ESLSharePopup.register();
    ESLShareTrigger.register();
    super.register();
  }

  /**
   * Gets or updates config with a promise of a new config object or using a config provider function.
   * @returns Promise of the current config {@link ESLShareConfig}
   * @deprecated alias for ESLShareConfig.set(), will be removed soon
   */
  public static readonly config = ESLShareConfig.set;

  /** Event to dispatch on change of {@link ESLShare} */
  @prop('esl:share:changed') public SHARE_CHANGED_EVENT: string;

  /** Default initial params to pass into the popup trigger */
  @jsonAttr<ESLSharePopupActionParams>({defaultValue: {
    trackClick: true,
    trackHover: true
  }}) public triggerInitialParams: ESLShareTrigger;

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

  /** @returns config of buttons specified by the list attribute */
  @memoize()
  public get buttonsConfig(): ESLShareButtonConfig[] {
    return ESLShareConfig.getList(this.list);
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

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
    this.mode === 'list' ? this.appendButtons() : this.appendTrigger();
  }

  /** Appends buttons to the share component. */
  protected appendButtons(): void {
    this.buttonsConfig.forEach((cfg) => {
      const btn = ESLShareButton.create(cfg);
      btn && this.appendChild(btn);
    });
  }

  /** Appends trigger to the share component. */
  protected appendTrigger(): void {
    const {list} = this;
    const $trigger = ESLShareTrigger.create();
    Object.assign($trigger, this.triggerInitialParams, {list});
    $trigger.innerHTML = this._content;
    this.appendChild($trigger);
  }

  /** Actions on complete init and ready component. */
  private onReady(): void {
    this.$$attr('ready', true);
    this.$$fire(this.SHARE_CHANGED_EVENT, {bubbles: false});
  }

  @listen({event: 'change', target: ESLShareConfig.instance})
  protected onConfigChange(): void {
    const {buttonsConfig} = this;
    memoize.clear(this, 'buttonsConfig');
    if (isEqual(this.buttonsConfig, buttonsConfig)) return;
    this.init(true);
  }
}
