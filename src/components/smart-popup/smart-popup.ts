class SmartPopup extends HTMLElement {

    static get is () {
        return 'smart-popup';
    }

    constructor() {
        super();
    }

    show() {

    }

    hide() {}

}

customElements.define(SmartPopup.is, SmartPopup);

export default SmartPopup;