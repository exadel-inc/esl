import { triggerComponentEvent } from '@helpers/component-utils';
import { ESC } from '@helpers/keycodes';
import { ISmartPopupTrigger } from './smart-popup-trigger';
import { attr } from '@helpers/decorators/attr';
import Manager from './smart-popup-manager';

export interface ISmartPopupActionParams {
  trigger?: ISmartPopupTrigger;
}

export interface ISmartPopup {

  show(params?: ISmartPopupActionParams): this;

  hide(params?: ISmartPopupActionParams): this;

  toggle(newState?: boolean): this;

  lazyInit?(): Promise<boolean> | void;
}

class SmartPopup extends HTMLElement implements ISmartPopup {

  static get is() {
    return 'smart-popup';
  }

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

  protected Manager = Manager;
  protected _closeButtonEl: Element;

  @attr() public group: string;
  @attr() protected bodyClass: string;
  @attr() protected closeButton: string;
  @attr({conditional: true}) protected closeOnEsc: boolean;
  @attr({conditional: true}) public closeOnBodyClick: boolean;
  @attr({conditional: true}) public active: boolean;

  protected attributeChangedCallback(attrName: string) {
    switch (attrName) {
      case 'active':
        this.setState();
        break;
      case 'close-on-esc':
        this.bindCloseOnEscHandler();
        break;
      case 'close-on-body-click':
        this.setCloseOnBodyClick();
        break;
      case 'group':
        this.setGroup();
        break;
      case 'close-button':
        this.setCloseButton();
    }
  }

  protected connectedCallback() {
    this.classList.add(SmartPopup.is);
    this.Manager.register(this);
  }

  protected disconnectedCallback() {
    this.Manager.remove(this);
  }

  protected setState() {
    this.active ? this.onShown() : this.onHidden();
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
  };

  protected setCloseOnBodyClick() {
    this.removeEventListener('click', this.stopEventPropagation);
    if (this.closeOnBodyClick) {
      this.addEventListener('click', this.stopEventPropagation);
    }
  }

  protected stopEventPropagation(e: Event) {
    e.stopPropagation();
  }

  protected setGroup() {
    this.Manager.remove(this);
    this.Manager.register(this);
  }

  protected setCloseButton() {
    this._closeButtonEl && this._closeButtonEl.removeEventListener('click', this.closeButtonHandler);
    this._closeButtonEl = this.querySelector(this.closeButton);
    this._closeButtonEl && this._closeButtonEl.addEventListener('click', this.closeButtonHandler);
  }

  protected closeButtonHandler: EventListener = () => {
    this.hide();
  };

  protected onShown() {
    this.Manager.hidePopupsInGroup(this);
    this.bodyClass && document.body.classList.add(this.bodyClass);
    this.setAttribute('aria-hidden', 'false');
    triggerComponentEvent(this, 'show');
  }

  protected onHidden() {
    this.bodyClass && document.body.classList.remove(this.bodyClass);
    this.setAttribute('aria-hidden', 'true');
    triggerComponentEvent(this, 'hide');
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

customElements.define(SmartPopup.is, SmartPopup);
export default SmartPopup;
