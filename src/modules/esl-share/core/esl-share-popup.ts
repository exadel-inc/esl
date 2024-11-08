import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLPopup} from '../../esl-popup/core/esl-popup';
import {attr, bind, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {ESLShareButton} from './esl-share-button';
import {ESLShareConfig} from './esl-share-config';

import type {ESLPopupActionParams} from '../../esl-popup/core/esl-popup';
import type {ESLShareButtonConfig} from './esl-share-config';
import type {FocusFlowType} from '../../esl-utils/dom/focus';
import type {PositionType} from '../../esl-popup/core/esl-popup-position';

export type {ESLSharePopupTagShape} from './esl-share-popup.shape';

function stringifyButtonsList(btns: ESLShareButtonConfig[]): string {
  return btns.map((btn) => btn.name).join(',');
}

export interface ESLSharePopupActionParams extends ESLPopupActionParams {
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
@ExportNs('SharePopup')
export class ESLSharePopup extends ESLPopup {
  static override is = 'esl-share-popup';

  /** Default params to pass into the share popup */
  static override DEFAULT_PARAMS: ESLSharePopupActionParams = {
    ...ESLPopup.DEFAULT_PARAMS,
    autofocus: true,
    position: 'top',
    hideDelay: 300
  };

  /** List of attributes to forward from the activator to the {@link ESLSharePopup} */
  public static forwardedAttrs = ['share-title', 'share-url'];

  /** Register {@link ESLSharePopup} component and dependent {@link ESLShareButton} */
  public static override register(): void {
    ESLShareButton.register();
    super.register();
  }

  /** Shared instance of ESLSharePopup */
  @memoize()
  public static get sharedInstance(): ESLSharePopup {
    return ESLSharePopup.create();
  }

  /**
   * Focus behaviour. Awailable values:
   * - 'none' - no focus management
   * - 'chain' (default) - focus on the first focusable element first and return focus to the activator after the last focusable element
   * - 'loop' - focus on the first focusable element and loop through the focusable elements
   */
  @attr({defaultValue: 'chain'}) public override focusBehaviour: FocusFlowType;

  /**
   * Popup position relative to the trigger.
   * Currently supported: 'top', 'bottom', 'left', 'right' position types ('top' by default)
   */
  @attr({defaultValue: 'top'}) public override position: PositionType;

  /** Popup behavior if it does not fit in the window ('fit' by default) */
  @attr({defaultValue: 'fit'}) public override behavior: string;

  /** Disable arrow at Tooltip */
  @boolAttr() public disableArrow: boolean;

  /** Hashstring with a list of buttons already rendered in the popup */
  protected _list: string = '';

  public override connectedCallback(): void {
    super.connectedCallback();
    this.classList.add(ESLPopup.is);
    this.classList.toggle('disable-arrow', this.disableArrow);
    this.tabIndex = 0;
  }

  /** Sets initial state of the Tooltip */
  protected override setInitialState(): void {}

  public override onShow(params: ESLSharePopupActionParams): void {
    if (params.disableArrow) {
      this.disableArrow = params.disableArrow;
    }
    if (params.list) {
      const buttonsList = ESLShareConfig.instance.get(params.list);
      this.appendButtonsFromList(buttonsList);
    }
    this.forwardAttributes();
    this.dir = params.dir || '';
    this.lang = params.lang || '';
    this.parentNode !== document.body && document.body.appendChild(this);
    super.onShow(params);
  }

  /** Actions to execute on Tooltip hiding. */
  public override onHide(params: ESLSharePopupActionParams): void {
    super.onHide(params);
    this.parentNode === document.body && document.body.removeChild(this);
  }

  /** Checks that the button list from the config was already rendered in the popup. */
  protected isEqual(config: ESLShareButtonConfig[]): boolean {
    return stringifyButtonsList(config) === this._list;
  }

  /** Appends a button to the popup. */
  @bind
  protected appendButton(btnCfg: ESLShareButtonConfig): void {
    const btn = ESLShareButton.create(btnCfg.name);
    btn && this.appendChild(btn);
  }

  /** Appends buttons from the list to the popup. */
  protected appendButtonsFromList(config: ESLShareButtonConfig[]): void {
    if (this.isEqual(config)) return;
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
