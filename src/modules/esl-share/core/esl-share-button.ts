import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, jsonAttr, listen} from '../../esl-utils/decorators';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';
import {toAbsoluteUrl} from '../../esl-utils/misc/url';
import {ESLShareActionRegistry} from './esl-share-action-registry';

import type {ESLShareBaseAction} from './esl-share-action';

/**
 * ESLShareButton
 * @author Dmytro Shovchko
 *
 * ESLShareButton is a custom element to create a "Share on social media" button.
 */
export class ESLShareButton extends ESLBaseElement {
  public static override is = 'esl-share-button';
  public static observedAttributes = ['action'];

  /** Name of share action that occurs after button click */
  @attr() public action: string;
  /** Link to share on a social network */
  @attr() public link: string;
  /** String social network identifier (no spaces) */
  @attr() public name: string;

  /** Additional params to pass into a button (can be used by share actions) */
  @jsonAttr() public additional: Record<string, any>;

  /** Marker of availability of share button */
  @boolAttr() public unavailable: boolean;

  protected get actionInstance(): ESLShareBaseAction | null {
    return ESLShareActionRegistry.instance.get(this.action);
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
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.initA11y();
    this.updateAction();
  }

  /** Sets initial a11y attributes */
  protected initA11y(): void {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'button');
    if (this.getAttribute('role') === 'button' && !this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }

  /** Does an action to share */
  public share(): void {
    this.actionInstance?.share(this);
  }

  protected updateAction(): void {
    this.$$attr('unavailable', !this.actionInstance?.isAvailable);
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
}
