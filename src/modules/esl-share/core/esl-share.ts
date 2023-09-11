import {ESLBaseElement} from '../../esl-base-element/core';
import {ESLPopup} from '../../esl-popup/core';
import {sequentialUID} from '../../esl-utils/misc/uid';
import {attr, bind, boolAttr, listen, prop} from '../../esl-utils/decorators';
import {ESLShareButton} from './esl-share-button';
import {ESLShareTrigger} from './esl-share-trigger';
import {ESLShareConfig} from './esl-share-config';

import type {PopupActionParams} from '../../esl-popup/core';
import type {ESLShareButtonConfig, ESLShareConfigProviderType} from './esl-share-config';

/**
 * ESLShare
 * @author Dmytro Shovchko
 *
 * ESLShare is a custom element to dynamically draw {@link ESLShareButton}s using simplified shared config
 */
export class ESLShare extends ESLBaseElement {
  public static override is = 'esl-share';
  protected static _popupStore: Map<string, ESLPopup> = new Map<string, ESLPopup>();

  /** Register {@link ESLShare} component and dependent {@link ESLShareButton} */
  public static override register(): void {
    ESLShareButton.register();
    ESLShareTrigger.register();
    super.register();
  }

  /**
   * Gets or updates config with a promise of a new config object or using a config provider function.
   * @returns Promise of the current config {@link ESLShareConfig}
   * @deprecated alias for ESLShareConfig.set(), will be removed soon
   */
  public static config(provider?: ESLShareConfigProviderType | ESLShareConfig): Promise<ESLShareConfig> {
    return ESLShareConfig.set(provider);
  }

  /** Event to dispatch on ready state of {@link ESLShare} */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  /** Event to dispatch on update of {@link ESLShare} */
  @prop('esl:share:update') public SHARE_CHANGED_EVENT: string;

  /** Default initial params to pass into the newly created popup */
  @prop({
    position: 'top',
    defaultParams: {
      hideDelay: 200
    }
  }) protected popupInitialParams: PopupActionParams;

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
  public get buttonsConfig(): ESLShareButtonConfig[] {
    const config = ESLShareConfig.instance;
    return (this.list !== 'all') ? config.getList(this.list) : config.buttons;
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

  /** Builds component's content from received `ESLShareButtonConfig` list */
  @bind
  protected buildContent(): void {
    this.innerHTML = '';

    if (this.mode === 'list') {
      this.appendButtonsTo(this);
      return;
    }

    const $popup = this.getStoredPopup() || this.createPopup();
    this.appendTrigger(`#${$popup.id}`);
  }

  /** Appends buttons to the passed element. */
  protected appendButtonsTo($el: Element): void {
    this.buttonsConfig.forEach((cfg) => {
      const btn = ESLShareButton.create(cfg);
      btn && $el.appendChild(btn);
    });
  }

  /** Appends trigger to the share component. */
  protected appendTrigger(target: string): void {
    const $trigger = ESLShareTrigger.create();
    Object.assign($trigger, {
      target,
      trackClick: true,
      trackHover: true
    });
    $trigger.innerHTML = this._content;
    this.appendChild($trigger);
  }

  /** Creates popup element with share buttons. */
  protected createPopup(): ESLPopup {
    const $popup = ESLPopup.create();
    const id = sequentialUID(this.baseTagName + '-');
    Object.assign($popup, {id, ...this.popupInitialParams});
    $popup.appendArrow();
    document.body.appendChild($popup);
    this.storePopup($popup);

    this.appendButtonsTo($popup);
    return $popup;
  }

  /** Gets popup element from the popup's store. */
  protected getStoredPopup(): ESLPopup | undefined {
    return (this.constructor as typeof ESLShare)._popupStore.get(this.list);
  }

  /** Adds popup element to the popup's store. */
  protected storePopup(value: ESLPopup): void {
    (this.constructor as typeof ESLShare)._popupStore.set(this.list, value);
  }

  /** Actions on complete init and ready component. */
  private onReady(): void {
    let eventName = this.SHARE_CHANGED_EVENT;
    if (!this.ready) {
      this.toggleAttribute('ready', true);
      eventName = this.SHARE_READY_EVENT;
    }
    this.$$fire(eventName, {bubbles: false});
  }

  @listen({event: 'change', target: ESLShareConfig.instance})
  protected onConfigChange(): void {
    this.init(true);
  }
}
