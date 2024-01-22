import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, jsonAttr, listen, memoize, prop} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {isEqual} from '../../esl-utils/misc/object/compare';
import {toAbsoluteUrl} from '../../esl-utils/misc/url';
import {ESLShareActionRegistry} from './esl-share-action-registry';
import {ESLShareConfig} from './esl-share-config';

import type {ESLShareBaseAction} from './esl-share-action';
import type {ESLShareButtonConfig} from './esl-share-config';

export type {ESLShareButtonTagShape} from './esl-share-button.shape';

/**
 * ESLShareButton
 * @author Dmytro Shovchko
 *
 * ESLShareButton is a custom element to invoke a share actions, defined by {@link ESLShareBaseAction}
 */
@ExportNs('ShareButton')
export class ESLShareButton extends ESLBaseElement {
  public static override is = 'esl-share-button';
  public static observedAttributes = ['action', 'name'];

  /** Creates an instance of the ESLShareButton */
  public static override create<T extends typeof ESLShareButton>(this: T, buttonName?: string): InstanceType<T> {
    const $button = document.createElement(this.is) as InstanceType<T>;
    if (buttonName) {
      $button.name = buttonName;
      $button.defaultIcon = true;
    }
    return $button;
  }

  /** Event to dispatch when {@link ESLShareButton} configuration is changed */
  @prop('esl:share:changed') public SHARE_CHANGED_EVENT: string;
  /** Event to dispatch on {@link ESLShareButton} ready state */
  @prop('esl:share:ready') public SHARE_READY_EVENT: string;

  /** Name of share action that occurs after button click */
  @attr() public action: string;
  /** Link to share on a social network */
  @attr() public link: string;
  /** String social network identifier (no spaces) */
  @attr() public name: string;

  /** URL to share (current page URL by default) */
  @attr() public shareUrl: string;
  /** Title to share (current document title by default) */
  @attr() public shareTitle: string;

  /** Additional params to pass into a button (can be used by share actions) */
  @jsonAttr() public additional: Record<string, any>;

  /** Marker to render default icon inside button on init */
  @boolAttr() public defaultIcon: boolean;

  /** Marker of availability of share button */
  @boolAttr() public unavailable: boolean;

  /** @readonly Ready state marker */
  @boolAttr({readonly: true}) public readonly ready: boolean;

  /** @returns config of button specified by the name attribute */
  @memoize()
  public get config(): ESLShareButtonConfig | undefined {
    return ESLShareConfig.instance.getButton(this.name);
  }

  /** Gets a property from attribute, or from button config if not set attribute */
  protected get(name: 'action' | 'link'): string;
  protected get(name: 'additional'): Record<string, any>;
  protected get(name: 'action' | 'link' | 'additional'): string | Record<string, any> {
    if (name === 'additional') {
      // for object props
      return Object.keys(this[name]).length ? this[name] : this.config?.[name] || {};
    }
    // for string props
    return this[name] || this.config?.[name] || '';
  }

  /** @returns an instance of {@link ESLShareBaseAction} assigned to the button */
  protected get actionInstance(): ESLShareBaseAction | null {
    return ESLShareActionRegistry.instance.get(this.shareAction);
  }

  /** @returns name of action assigned to the button */
  public get shareAction(): string {
    return this.get('action');
  }

  /** @returns additional params assigned to the button */
  public get shareAdditional(): Record<string, any> {
    return this.get('additional');
  }

  /** @returns link to share on social network  */
  public get shareLink(): string {
    return this.get('link');
  }

  /** @returns title to share */
  public get titleToShare(): string {
    return this.getShareAttr('share-title', document.title);
  }

  /** @returns URL to share */
  public get urlToShare(): string {
    return toAbsoluteUrl(this.getShareAttr('share-url', window.location.href));
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'action') this.updateAction();
    if (attrName === 'name') this.updateName();
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.init();
  }

  /** Initializes the button */
  protected init(force?: boolean): void {
    if (this.ready && !force) return;

    if (this.defaultIcon) this.initIcon();
    this.initA11y();
    this.updateAction();
    this.onReady();
  }

  /** Sets initial a11y attributes */
  protected initA11y(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex') && this.getAttribute('role') === 'button') {
      this.tabIndex = 0;
    }
  }

  /** Initializes the button content */
  protected initIcon(): void {
    if (!this.config) return;
    const {title, icon} = this.config;
    this.title = title;
    this.innerHTML = icon || '';
    const $icon = this.firstElementChild as HTMLElement;
    if ($icon?.tagName !== 'svg') return;
    $icon.classList.add('esl-share-icon');
  }

  /** Does an action to share */
  public share(): void {
    this.actionInstance?.share(this);
  }

  /** Updates on button action change */
  protected updateAction(): void {
    this.$$attr('unavailable', !this.actionInstance?.isAvailable);
  }

  /** Updates on button name change */
  protected updateName(): void {
    memoize.clear(this, 'config');
    this.updateAction();
  }

  /** Gets attribute from the element or closest parent,
   *  returns fallback value in the case when an element with attribute not found */
  protected getShareAttr(name: string, fallback: string): string {
    const el = this.closest(`[${name}]`);
    return (el && el.getAttribute(name)) || fallback;
  }

  @listen('click')
  protected _onClick(e: MouseEvent): void {
    this.share();
  }

  @listen('keydown')
  protected _onKeydown(e: KeyboardEvent): void {
    if ([ENTER, SPACE].includes(e.key)) {
      this.click();
      e.preventDefault();
    }
  }

  @listen({event: 'change', target: ESLShareConfig.instance})
  protected _onConfigChange(): void {
    const {config} = this;
    memoize.clear(this, 'config');
    if (isEqual(this.config, config)) return;
    this.init(true);
    this.$$fire(this.SHARE_CHANGED_EVENT, {bubbles: false});
  }

  /** Actions on complete init and ready component */
  private onReady(): void {
    if (this.ready) return;
    this.$$attr('ready', true);
    this.$$fire(this.SHARE_READY_EVENT, {bubbles: false});
  }
}

declare global {
  export interface ESLLibrary {
    ShareButton: typeof ESLShareButton;
  }
  export interface HTMLElementTagNameMap {
    'esl-share-button': ESLShareButton;
  }
}
