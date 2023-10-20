import {ESLTooltip} from '../../esl-tooltip/core/esl-tooltip';
import {bind, listen, memoize} from '../../esl-utils/decorators';
import {ESLShareButton} from './esl-share-button';
import {ESLShareConfig} from './esl-share-config';

import type {ESLToggleableActionParams} from '../../esl-toggleable/core';
import type {TooltipActionParams} from '../../esl-tooltip/core/esl-tooltip';
import type {ESLShareButtonConfig} from './esl-share-config';

function stringifyButtonsList(btns: ESLShareButtonConfig[]): string {
  return btns.map((btn) => btn.name).join(',');
}

export interface ESLSharePopupActionParams extends TooltipActionParams {
  /** list of social networks or groups of them to display */
  list?: string;
}

/**
 * ESLSharePopup component
 * @author Dmytro Shovchko
 *
 * ESLSharePopup is an extension of {@link ESLPopup} that:
 * - exists as a singleton
 * - renders a list of {@link ESLShareButton}s based on the {@link ESLShareConfig} config from host {@link ESLShare} component
 * - forwards the sharing attributes from the host share {@link ESLShare} component
 */
export class ESLSharePopup extends ESLTooltip {
  static override is = 'esl-share-popup';

  /** List of attributes to forward from the activator to the {@link ESLSharePopup} */
  public static forwardedAttrs = ['share-title', 'share-url'];

  /** Shared instance of ESLSharePopup */
  @memoize()
  public static override get sharedInstance(): ESLSharePopup {
    return ESLSharePopup.create();
  }

  protected _list: string = '';

  /**
   * Actions to execute before showing of popup.
   * @returns false if the show task should be canceled
   */
  protected override onBeforeShow(params: ESLToggleableActionParams): boolean | void {
    const result = super.onBeforeShow(params);
    if (params.list) {
      const buttonsList = ESLShareConfig.getList(params.list);
      this.appendButtonsFromList(buttonsList);
    }
    this.forwardAttributes();
    return result;
  }

  /** Checks that the button list was rendered previously. */
  protected isEqualList(config: ESLShareButtonConfig[]): boolean {
    return stringifyButtonsList(config) === this._list;
  }

  /** Appends a button to the popup. */
  @bind
  protected appendButton(btnCfg: ESLShareButtonConfig): void {
    const btn = ESLShareButton.create(btnCfg);
    btn && this.appendChild(btn);
  }

  /** Appends buttons from the list to the popup. */
  protected appendButtonsFromList(config: ESLShareButtonConfig[]): void {
    if (this.isEqualList(config)) return;
    this.innerHTML = '';
    config.forEach(this.appendButton);
    memoize.clear(this, '$arrow');
    this._list = stringifyButtonsList(config);
  }

  /**
   * Forwards share attributes from the activator (or its parents) to the {@link ESLSharePopup} instance.
   * Skips empty attributes
   */
  protected forwardAttributes(): void {
    const {activator} = this;
    if (!activator) return;
    ESLSharePopup.forwardedAttrs.forEach((name) => {
      const el = activator.closest(`[${name}]`);
      const value = el && el.getAttribute(name);
      this.$$attr(name, value);
    });
  }

  @listen({event: 'change', target: ESLShareConfig.instance})
  protected _onConfigChange(): void {
    this.hide();
  }
}

declare global {
  export interface ESLLibrary {
    SharePopup: typeof ESLSharePopup;
  }
  export interface HTMLElementTagNameMap {
    'esl-share-popup': ESLSharePopup;
  }
}
