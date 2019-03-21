import {ISmartTrigger} from "../smart-trigger/smart-triger-interface";

export enum TOGGLE_STATES { OPEN = 1, CLOSE }

export interface ISmartPopupActionParams {
    trigger?: ISmartTrigger
}

export interface ISmartPopup {
    isOpen: boolean;

    show(params?: ISmartPopupActionParams): this;

    hide(params?: ISmartPopupActionParams): this;

    toggle(state?: TOGGLE_STATES): this;

    lazyInit?(): Promise<boolean> | void;
}

class SmartPopup extends HTMLElement implements ISmartPopup {

    static readonly is: string = 'smart-popup';

    protected _ewcConfig: DOMStringMap = this.dataset;

    get isOpen(): boolean {
        return this.classList.contains(this._ewcConfig.activeClass);
    }

    'attr<->prop'() {

    }

    constructor() {
        super();
    }

    show(params: ISmartPopupActionParams = {}) {
        return this;
    }

    hide(params: ISmartPopupActionParams = {}) {
        return this;
    }

    toggle(state?: TOGGLE_STATES) {
        return this;
    }

}

customElements.define(SmartPopup.is, SmartPopup);

export default SmartPopup;