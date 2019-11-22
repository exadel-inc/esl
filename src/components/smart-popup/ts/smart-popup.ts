import { triggerComponentEvent } from '@helpers/component-utils';
import { ESC } from '@helpers/keycodes';
import { ISmartTrigger } from './smart-popup-trigger';
import Manager from './smart-popup-manager';

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger;
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
    return ['class', 'data-close-on-esc', 'data-group'];
  }

  protected Manager = Manager;
  protected options = {
    group: ''
  };

  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    switch (attr) {
      case 'class':
        if (prevValue !== null && prevValue !== value) {
          const wasClosed = prevValue.split(' ').indexOf(this.activeClass) === -1;
          if (this.isOpen && wasClosed || !this.isOpen && !wasClosed) {
            triggerComponentEvent(this, 'popupStateChange');
          }
        }
        break;
      case 'data-close-on-esc':
        this.unbindCloseOnEsc();
        if (value !== null) {
          this.bindCloseOnEsc();
        }
        break;
      case 'data-group':
        this.options.group = value;
        this.Manager.remove(this);
        this.Manager.register(this);
    }
  }

  get activeClass(): string {
    return this.getAttribute('active-class') || 'opened';
  }

  get isOpen(): boolean {
    return this.classList.contains(this.activeClass);
  }

  get state(): boolean {
    return this.isOpen;
  }

  get newState(): boolean {
    return !this.isOpen;
  }

  protected bindCloseOnEsc() {
    this.addEventListener('keydown', this.closeOnEsc);
  }

  protected unbindCloseOnEsc() {
    this.removeEventListener('keydown', this.closeOnEsc);
  }

  protected closeOnEsc(e: any) {
    if (e.which === ESC) {
      this.classList.remove(this.activeClass);
    }
  };

  public show(params: ISmartPopupActionParams = {}) {
    if (!this.isOpen) {
      this.Manager.hidePopupsInGroup(this);
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

  public toggle(newState: boolean = this.newState, params?: ISmartPopupActionParams) {
    newState ? this.show(params) : this.hide(params);
    return this;
  }
}

customElements.define(SmartPopup.is, SmartPopup);
export default SmartPopup;
