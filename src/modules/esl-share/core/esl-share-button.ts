import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, jsonAttr, listen, memoize} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {toAbsoluteUrl} from '../../esl-utils/misc/url';
import {ESLShareActionRegistry} from './esl-share-action-registry';
import {ESLShareConfig} from './esl-share-config';

import type {ESLShareBaseAction} from './esl-share-action';
import type {ESLShareButtonConfig} from './esl-share-config';

/**
 * ESLShareButton
 * @author Dmytro Shovchko
 *
 * ESLShareButton is a custom element to create a "Share on social media" button.
 */
export class ESLShareButton extends ESLBaseElement {
  public static override is = 'esl-share-button';
  public static observedAttributes = ['action', 'name'];

  /** Creates an instance of the ESLShareButton */
  public static override create<T extends typeof ESLShareButton>(this: T, cfg?: ESLShareButtonConfig): InstanceType<T> {
    const $button = document.createElement(this.is) as InstanceType<T>;
    if (cfg) {
      $button.name = cfg.name;
      $button.initContent();
    }
    return $button;
  }

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
  protected get(prop: 'action' | 'link'): string;
  protected get(prop: 'additional'): Record<string, any>;
  protected get(prop: 'action' | 'link' | 'additional'): string | Record<string, any> {
    return (prop === 'additional')
      ? Object.keys(this[prop]).length ? this[prop] : this.config?.[prop] || {}
      : this[prop] || this.config?.[prop] || '';
  }

  /** @returns an instance of the action assigned to the button */
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
  protected init(): void {
    if (this.ready) return;

    this.initA11y();
    this.updateAction();
    this.toggleAttribute('ready', true);
  }

  /** Sets initial a11y attributes */
  protected initA11y(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (!this.hasAttribute('tabindex') && this.getAttribute('role') === 'button') {
      this.tabIndex = 0;
    }
  }

  /** Initializes the button content */
  protected initContent(): void {
    if (!this.config) return;
    const {title, icon, iconBackground} = this.config;
    const $icon = document.createElement('span');
    $icon.title = title;
    $icon.classList.add('esl-share-icon');
    $icon.innerHTML = icon;
    iconBackground && $icon.setAttribute('style', `background-color:${iconBackground};`);
    this.appendChild($icon);
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
  protected onConfigChange(): void {
    this.updateName();
  }
}
