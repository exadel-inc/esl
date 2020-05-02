import {CustomElement} from '../../../helpers/custom-element';
import { ESC } from '../../../helpers/keycodes';
import { attr } from '../../../helpers/decorators/attr';
import PopupManager from './smart-popup-manager';

export interface ISmartPopupActionParams {
  trigger?: HTMLElement;
}

export interface ISmartPopup {
  show(params?: ISmartPopupActionParams): this;
  hide(params?: ISmartPopupActionParams): this;
  toggle(newState?: boolean): this;
  lazyInit?(): Promise<boolean> | void;
}

export class SmartPopup extends CustomElement implements ISmartPopup {
  public static is = 'smart-popup';
  public static eventNs = 'spopup';

  static get observedAttributes() {
    return [
      'active',
      'close-on-esc',
      'close-on-body-click',
      'group',
      'body-class',
      'close-button'
    ];
  }

  @attr() public group: string;
  @attr() public bodyClass: string;
  @attr() public activeClass: string;
  @attr() public closeButton: string;

  @attr({conditional: true}) public closeOnEsc: boolean;
  @attr({conditional: true}) public closeOnBodyClick: boolean;
  @attr({conditional: true}) public active: boolean;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    switch (attrName) {
      case 'active':
        this.setState();
        break;
      case 'close-on-esc':
        this.bindCloseOnEscHandler();
        break;
      case 'close-on-body-click':
        this.bindCloseOnBodyClickHandler();
        break;
      case 'group':
        this.setGroup(oldVal, newVal);
        break;
      case 'close-button':
        this.setCloseButton();
    }
  }

  protected connectedCallback() {
    this.classList.add((this.constructor as typeof SmartPopup).is);
    PopupManager.registerInGroup(this);
    PopupManager.registerCloseOnBodyClickPopup(this);
  }

  protected disconnectedCallback() {
    PopupManager.removeFromGroup(this);
    PopupManager.removeCloseOnBodyClickPopup(this);
  }

  protected setState() {
    this.active ? this.onShow() : this.onHide();
  }

  protected bindCloseOnEscHandler() {
    this.removeEventListener('keydown', this.closeOnEscHandler);
    if (this.closeOnEsc) {
      this.addEventListener('keydown', this.closeOnEscHandler);
    }
  }

  protected closeOnEscHandler(e: KeyboardEvent) {
    if (e.which === ESC) {
      this.hide();
    }
  }

  protected bindCloseOnBodyClickHandler() {
    PopupManager.removeCloseOnBodyClickPopup(this);
    PopupManager.registerCloseOnBodyClickPopup(this);
    this.removeEventListener('click', this.closeOnBodyClickHandler);
    if (this.closeOnBodyClick) {
      this.addEventListener('click', this.closeOnBodyClickHandler);
    }
  }

  protected closeOnBodyClickHandler(e: Event) {
    e.stopPropagation();
  }

  protected setGroup(oldGroup: string, newGroup: string) {
    PopupManager.removeFromGroup(this, oldGroup);
    PopupManager.registerInGroup(this, newGroup);
  }

  protected setCloseButton() {
    if (this.closeButton) {
      this.addEventListener('click', this.closeButtonHandler);
    } else {
      this.removeEventListener('click', this.closeButtonHandler);
    }
  }

  protected closeButtonHandler: EventListener = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.closest(this.closeButton)) {
      this.hide();
    }
  };

  protected onShow() {
    PopupManager.hidePopupsInGroup(this);
    this.activeClass && this.classList.add(this.activeClass);
    this.bodyClass && document.body.classList.add(this.bodyClass);
    this.setAttribute('aria-hidden', 'false');
    this.dispatchCustomEvent('show');
  }

  protected onHide() {
    this.activeClass && this.classList.remove(this.activeClass);
    this.bodyClass && document.body.classList.remove(this.bodyClass);
    this.setAttribute('aria-hidden', 'true');
    this.dispatchCustomEvent('hide');
  }

  public show(params: ISmartPopupActionParams = {}) {
    if (!this.active) {
      this.active = true;
    }
    return this;
  }

  public hide(params: ISmartPopupActionParams = {}) {
    if (this.active) {
      this.active = false;
    }
    return this;
  }

  public toggle(newState: boolean = !this.active, params?: ISmartPopupActionParams) {
    newState ? this.show(params) : this.hide(params);
    return this;
  }
}

export default SmartPopup;
