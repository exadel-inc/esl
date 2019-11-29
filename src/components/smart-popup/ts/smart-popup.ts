import { triggerComponentEvent } from '@helpers/component-utils';
import { ESC } from '@helpers/keycodes';
import { ISmartPopupTrigger } from './smart-popup-trigger';
import Manager from './smart-popup-manager';

export interface ISmartPopupActionParams {
  trigger?: ISmartPopupTrigger;
}

export interface ISmartPopup {
  isOpen: boolean;

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
      'class',
      'data-close-on-esc',
      'data-close-on-body-click',
      'data-group',
      'data-active-class',
      'data-body-class',
      'data-close-button'
    ];
  }

  protected Manager = Manager;
  protected activeClass = 'opened';
  protected bodyClass = '';
  protected closeButton: Element;
  public closeOnBodyClick = false;
  public group = '';

  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    switch (attr) {
      case 'class':
        this.setClass();
        break;
      case 'data-close-on-esc':
        this.bindCloseOnEsc(value);
        break;
      case 'data-close-on-body-click':
        this.setCloseOnBodyClick(value);
        break;
      case 'data-group':
        this.setGroup(value);
        break;
      case 'data-active-class':
        this.setActiveClass(value);
        break;
      case 'data-body-class':
        this.setBodyClass(value);
        break;
      case 'data-close-button':
        this.setCloseButton(value);
    }
  }

  protected connectedCallback() {
    this.classList.add(SmartPopup.is);
    this.Manager.register(this);
  }

  protected disconnectedCallback() {
    this.Manager.remove(this);
  }

  get isOpen(): boolean {
    return this.classList.contains(this.activeClass);
  }

  protected setClass() {
    this.isOpen ? this.onShown() : this.onHidden();
  }

  protected bindCloseOnEsc(value: string) {
    this.removeEventListener('keydown', this.closeOnEsc);
    if (value !== null) {
      this.addEventListener('keydown', this.closeOnEsc);
    }
  }

  protected closeOnEsc(e: KeyboardEvent) {
    if (e.which === ESC) {
      this.hide();
    }
  };

  protected setCloseOnBodyClick(value: string) {
    this.closeOnBodyClick = (value !== null);
    this.removeEventListener('click', this.stopEventPropagation);
    if (this.closeOnBodyClick) {
      this.addEventListener('click', this.stopEventPropagation);
    }
  }

  protected stopEventPropagation(e: Event) {
    e.stopPropagation();
  }

  protected setGroup(value: string) {
    this.group = value;
    this.Manager.remove(this);
    this.Manager.register(this);
  }

  protected setActiveClass(value: string) {
    this.activeClass = value || 'opened';
  }

  protected setBodyClass(value: string) {
    this.bodyClass = value;
  }

  protected setCloseButton(value: string) {
    this.closeButton && this.closeButton.removeEventListener('click', this.closeButtonHandler);
    this.closeButton = this.querySelector(value);
    this.closeButton && this.closeButton.addEventListener('click', this.closeButtonHandler);
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
    if (!this.isOpen) {
      this.classList.add(this.activeClass);
    }
    return this;
  }

  public hide(params: ISmartPopupActionParams = {}) {
    if (this.isOpen) {
      this.classList.remove(this.activeClass);
    }
    return this;
  }

  public toggle(newState: boolean = !this.isOpen, params?: ISmartPopupActionParams) {
    newState ? this.show(params) : this.hide(params);
    return this;
  }
}

customElements.define(SmartPopup.is, SmartPopup);
export default SmartPopup;
