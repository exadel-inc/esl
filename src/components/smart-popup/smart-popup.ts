import { triggerComponentEvent } from '../../helpers/component-utils';
import { ISmartTrigger } from '../smart-trigger/smart-triger-interface';
import Manager from '../smart-manager/smart-popup-manager';

export enum STATES { CLOSE, OPEN }

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger;
}

export interface ISmartPopup {
  isOpen: boolean;

  show(params?: ISmartPopupActionParams): this;

  hide(params?: ISmartPopupActionParams): this;

  toggle(newState?: STATES): this;

  lazyInit?(): Promise<boolean> | void;
}

class SmartPopup extends HTMLElement implements ISmartPopup {
  protected options = {
    closeOnEsc: false,
    closeOnBodyClick: false,
  };
  protected Manager = Manager;

  static readonly is: string = 'smart-popup';

  static observedAttributes: Array<string> = ['class', 'data-close-popup'];

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
      case 'data-close-popup':
        // document.body.addEventListener('click', (evt) => {evt.stopPropagation()});
        this.closeOnEsc();
        break;
    }
  }

  get activeClass(): string {
    return this.getAttribute('active-class') || 'opened';
  }

  get isOpen(): boolean {
    return this.classList.contains(this.activeClass);
  }

  get state(): STATES {
    return this.isOpen ? STATES.OPEN : STATES.CLOSE;
  }

  get newState(): STATES {
    return this.isOpen ? STATES.CLOSE : STATES.OPEN;
  }

  protected closeOnEsc() {
    this.Manager.register(this);
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        this.classList.remove(this.activeClass);
      }
    })
  };

  public show(params: ISmartPopupActionParams = {}) {
    this.classList.add(this.activeClass);
    if (!this.isOpen) {
      this.Manager.show(this, params);
    }
    return this;
  }

  public hide(params: ISmartPopupActionParams = {}) {
    this.classList.remove(this.activeClass);
    return this;
  }

  public toggle(newState: STATES = this.newState, params?: ISmartPopupActionParams) {
    switch (newState) {
      case STATES.OPEN:
        this.show(params);
        break;
      case STATES.CLOSE:
        this.hide(params);
        break;
    }
    return this;
  }
}

customElements.define(SmartPopup.is, SmartPopup);

export { SmartPopup };
